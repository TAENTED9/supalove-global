'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import {
  ShoppingBag,
  Check,
  Plus,
  Minus,
  Heart,
  MessageCircle,
  Truck,
  Package,
  ArrowLeft,
  X,
  CreditCard,
  Building2,
  Lock,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { siteConfig, whatsappHref } from '@/config/site'
import { toast } from 'sonner'
import type { ProductItem, VariantItem } from '@/lib/data'
import { trackStoreEvent } from '@/lib/analytics'

interface ProductDetailClientProps {
  product: ProductItem
}

const WISHLIST_KEY = 'supalovefoods-wishlist'

function getWishlist(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    return new Set(Array.isArray(JSON.parse(raw ?? '[]')) ? JSON.parse(raw ?? '[]') : [])
  } catch {
    return new Set()
  }
}

function toggleWishlist(id: string): boolean {
  const wl = getWishlist()
  if (wl.has(id)) {
    wl.delete(id)
  } else {
    wl.add(id)
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(wl)))
  return wl.has(id)
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const { addItem, openDrawer } = useCartStore()

  const [selectedVariant, setSelectedVariant] = useState<VariantItem>(
    product.variants[0] ?? {
      id: 'default',
      label: 'Standard Pack',
      unit: 'KG',
      price: 0,
      stock: 10,
      minOrderQty: 1,
      sku: 'SKU',
    }
  )

  const minQty = selectedVariant.minOrderQty || 1
  const [quantity, setQuantity] = useState(minQty)
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  // Ref to buy box to track when it scrolls out of view on mobile
  const buyBoxRef = useRef<HTMLDivElement>(null)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const galleryImages = useMemo(
    () =>
      product.images.length > 0
        ? product.images
        : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
    [product.images]
  )

  // Hydrate wishlist state
  useEffect(() => {
    setWishlisted(getWishlist().has(product.id))
  }, [product.id])

  // Track product view event
  useEffect(() => {
    trackStoreEvent('product_view', { productId: product.id, productSlug: product.slug })
  }, [product.id, product.slug])

  // IntersectionObserver for mobile sticky bottom CTA
  useEffect(() => {
    const el = buyBoxRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar when buy box top is above viewport
        setShowStickyBar(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Keyboard navigation for image lightbox
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
      if (event.key === 'ArrowLeft') {
        setSelectedImage((idx) => (idx + galleryImages.length - 1) % galleryImages.length)
      }
      if (event.key === 'ArrowRight') {
        setSelectedImage((idx) => (idx + 1) % galleryImages.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [galleryImages.length, lightboxOpen])

  const clampedQuantity = Math.min(Math.max(quantity, minQty), selectedVariant.stock)

  const handleAddToCart = useCallback(() => {
    if (selectedVariant.stock < minQty) {
      toast.error('This variant is currently out of stock.')
      return
    }

    trackStoreEvent('add_to_cart', { productId: product.id, productSlug: product.slug })
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      qty: clampedQuantity,
      name: product.name,
      label: selectedVariant.label,
      price: selectedVariant.price,
      image: galleryImages[0] || undefined,
      stock: selectedVariant.stock,
      minOrderQty: minQty,
      sku: selectedVariant.sku,
      unit: selectedVariant.unit,
      slug: product.slug,
    })

    setAdded(true)
    toast.success(
      `Added ${clampedQuantity}x ${product.name} (${selectedVariant.label}) to cart!`,
      {
        action: {
          label: 'View Cart',
          onClick: () => openDrawer(),
        },
      }
    )
    setTimeout(() => setAdded(false), 1500)
  }, [addItem, clampedQuantity, galleryImages, minQty, openDrawer, product, selectedVariant])

  const handleBuyNow = useCallback(() => {
    if (selectedVariant.stock < minQty) {
      toast.error('This variant is currently out of stock.')
      return
    }

    trackStoreEvent('add_to_cart', { productId: product.id, productSlug: product.slug })
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      qty: clampedQuantity,
      name: product.name,
      label: selectedVariant.label,
      price: selectedVariant.price,
      image: galleryImages[0] || undefined,
      stock: selectedVariant.stock,
      minOrderQty: minQty,
      sku: selectedVariant.sku,
      unit: selectedVariant.unit,
      slug: product.slug,
    })

    router.push('/checkout')
  }, [addItem, clampedQuantity, galleryImages, minQty, product, router, selectedVariant])

  const handleWishlistToggle = useCallback(() => {
    const next = toggleWishlist(product.id)
    setWishlisted(next)
    toast.success(next ? 'Added to wishlist' : 'Removed from wishlist')
  }, [product.id])

  const handleWhatsAppOrder = useCallback(() => {
    const message = `Hello ${siteConfig.name}, I would like to order:\n\n*Product:* ${product.name}\n*Variant:* ${selectedVariant.label}\n*Quantity:* ${clampedQuantity}\n*Price:* ${formatPrice(selectedVariant.price * clampedQuantity)}\n\nPlease confirm availability and delivery timeframe.`
    const url = whatsappHref(message)
    window.open(url, '_blank')
  }, [clampedQuantity, product.name, selectedVariant])

  const discountPercent =
    selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > selectedVariant.price
      ? Math.round(
          ((selectedVariant.compareAtPrice - selectedVariant.price) /
            selectedVariant.compareAtPrice) *
            100
        )
      : 0

  const isOutOfStock = selectedVariant.stock < minQty
  const isLowStock = !isOutOfStock && selectedVariant.stock <= 10
  const specs = [
    { label: 'Origin', value: product.specifications?.origin },
    { label: 'Packaging', value: product.specifications?.packaging },
    { label: 'Shelf life', value: product.specifications?.shelfLife },
    { label: 'Storage', value: product.specifications?.storage },
  ].filter((spec) => spec.value)

  return (
    <Dialog.Root open={lightboxOpen} onOpenChange={setLightboxOpen}>
      <div className="space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-green transition-colors"
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>

          <span className="text-xs text-gray-400">
            {product.category.name}
          </span>
        </div>

        {/* 5-Column Grid: Gallery (3 cols) / Buy Box (2 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column (3 cols): Gallery, Description, Specs */}
          <div className="lg:col-span-3 space-y-5">
            {/* Square Hero Gallery with Next.js image */}
            <div
              role="group"
              aria-label="Product image gallery. Use the arrow keys or swipe to browse images."
              tabIndex={0}
              onKeyDown={(event) => {
                if (galleryImages.length < 2) return
                if (event.key === 'ArrowLeft') {
                  event.preventDefault()
                  setSelectedImage((idx) => (idx + galleryImages.length - 1) % galleryImages.length)
                }
                if (event.key === 'ArrowRight') {
                  event.preventDefault()
                  setSelectedImage((idx) => (idx + 1) % galleryImages.length)
                }
              }}
              onTouchStart={(event) => {
                touchStartX.current = event.touches[0]?.clientX ?? null
              }}
              onTouchEnd={(event) => {
                const startX = touchStartX.current
                const endX = event.changedTouches[0]?.clientX
                touchStartX.current = null
                if (startX === null || endX === undefined || galleryImages.length < 2) return
                const delta = endX - startX
                if (Math.abs(delta) < 50) return
                setSelectedImage((idx) =>
                  delta < 0
                    ? (idx + 1) % galleryImages.length
                    : (idx + galleryImages.length - 1) % galleryImages.length
                )
              }}
              className="relative aspect-square w-full rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
            >
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`View ${product.name} image ${selectedImage + 1} enlarged`}
                className="absolute inset-0 h-full w-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-brand-green"
              >
                <Image
                  src={galleryImages[selectedImage] || galleryImages[0]}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
              </button>

              {/* Wishlist toggle top-right */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
              >
                <Heart
                  size={18}
                  className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}
                />
              </button>

              {/* Discount / Badge */}
              {discountPercent > 0 && (
                <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-black shadow-sm">
                  -{discountPercent}% OFF
                </span>
              )}

              {/* Click to expand hint */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 z-10 text-[11px] font-bold bg-black/60 text-white px-2.5 py-1 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Click to expand
              </button>
            </div>

            {/* 64px Thumbnails strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`Select product image ${idx + 1}`}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === idx
                        ? 'border-brand-green ring-2 ring-brand-green/20'
                        : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description Card */}
            <div className="rounded-2xl bg-white p-5 shadow-xs">
              <h3 className="text-lg font-black text-gray-900 mb-2.5">
                Product Details
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.description || 'No product details yet.'}
              </p>
            </div>

            {specs.length > 0 && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-xs">
                <div className="px-5 py-3">
                  <h3 className="text-lg font-black text-gray-900">
                    Product Specifications
                  </h3>
                </div>
                <div className="divide-y divide-gray-100 text-xs">
                  {specs.map((item) => (
                    <div key={item.label} className="grid grid-cols-3 px-5 py-3 gap-2">
                      <span className="font-bold text-gray-500">{item.label}</span>
                      <span className="col-span-2 text-gray-900 font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (2 cols): Sticky Buy Box */}
          <div className="lg:col-span-2">
            <div
              ref={buyBoxRef}
              className="lg:sticky lg:top-20 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5"
            >
              {/* Title & Category */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-green block mb-1">
                  {product.category.name}
                </span>
                <h1 className="text-xl font-black text-gray-900 leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price Line */}
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl font-black text-brand-green">
                    {formatPrice(selectedVariant.price)}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    / {selectedVariant.label}
                  </span>
                </div>
                {selectedVariant.compareAtPrice &&
                  selectedVariant.compareAtPrice > selectedVariant.price && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(selectedVariant.compareAtPrice)}
                      </span>
                      <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                        Save {formatPrice(selectedVariant.compareAtPrice - selectedVariant.price)}
                      </span>
                    </div>
                  )}
              </div>

              {/* Variant Chips */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  Select Package Size ({product.variants.length} available)
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id
                    const isOut = v.stock < (v.minOrderQty || 1)
                    return (
                      <button
                        key={v.id}
                        type="button"
                        disabled={isOut}
                        onClick={() => {
                          setSelectedVariant(v)
                          setQuantity(v.minOrderQty || 1)
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-brand-green bg-brand-green/5 ring-1 ring-brand-green'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        } ${isOut ? 'opacity-40 cursor-not-allowed bg-gray-50' : ''}`}
                      >
                        <div>
                          <div className="text-xs font-bold text-gray-900">{v.label}</div>
                          <div className="text-[10px] text-gray-400">
                            {isOut ? 'Out of stock' : `Stock: ${v.stock} ${v.unit.toLowerCase()}(s)`}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-brand-green">
                            {formatPrice(v.price)}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Quantity
                  </span>
                  {minQty > 1 && (
                    <span className="text-[10px] text-orange-600 font-bold">
                      Min order: {minQty} units
                    </span>
                  )}
                </div>
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
                    disabled={quantity <= minQty}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="flex-1 text-center text-sm font-bold text-gray-900 select-none">
                    {clampedQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                    disabled={isOutOfStock || quantity >= selectedVariant.stock}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* Wholesale Tiers Table (if tiers exist) */}
              {selectedVariant.priceTiers && selectedVariant.priceTiers.length > 0 && (
                <div className="rounded-xl border border-brand-green/20 bg-brand-green/5 p-3.5 space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-brand-green block">
                    Buy More, Save More (Wholesale Tiers)
                  </span>
                  <div className="divide-y divide-brand-green/10 text-xs">
                    {selectedVariant.priceTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="flex items-center justify-between py-1.5 text-gray-700"
                      >
                        <span className="font-semibold">{tier.minQty}+ units:</span>
                        <span className="font-black text-brand-green">
                          {formatPrice(tier.price)} each
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Badge */}
              <div className="flex items-center gap-2 text-xs">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                    <Package size={13} /> Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                    <Package size={13} /> Only {selectedVariant.stock} left in warehouse
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-bold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full">
                    <Check size={13} /> In Stock
                  </span>
                )}
              </div>

              {/* Action Buttons: Add to Cart + Buy Now */}
              <div className="space-y-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-green hover:bg-brand-green-hover text-white shadow-brand-green/20'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {added ? (
                    <>
                      <Check size={17} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={17} /> Add to Cart (
                      {formatPrice(selectedVariant.price * clampedQuantity)})
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-brand-orange hover:bg-brand-orange-hover text-white flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now &rarr;
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>Order on WhatsApp</span>
                </button>
              </div>

              {/* Delivery Note */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed">
                <Truck size={16} className="text-brand-green shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 block">Delivery timing</span>
                  <span>Estimated delivery timing is confirmed for your address during checkout.</span>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500">
                Questions about this product or delivery? Use the WhatsApp order option above.
              </p>

              {/* Payment Badges (Flutterwave) */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                  <span className="flex items-center gap-1 font-semibold text-gray-600">
                    <Lock size={12} className="text-brand-green" />
                    Secured by Flutterwave
                  </span>
                  <span>Debit Card &middot; Bank Transfer &middot; USSD</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-[10px]">
                    <CreditCard size={12} /> Cards
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-[10px]">
                    <Building2 size={12} /> Bank Transfer
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-100 text-[10px]">
                    USSD
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile Sticky Bottom CTA Bar (appears when buy box scrolls away) ── */}
        {showStickyBar && (
          <div className="md:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-lg flex items-center justify-between gap-3 animate-slide-up">
            <div className="min-w-0">
              <span className="block text-[11px] text-gray-400 truncate">
                {selectedVariant.label}
              </span>
              <span className="block text-base font-black text-brand-green leading-tight">
                {formatPrice(selectedVariant.price * clampedQuantity)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="py-2.5 px-5 rounded-xl font-bold text-xs bg-brand-green hover:bg-brand-green-hover text-white shadow-md active:scale-95 transition-all shrink-0 disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        )}

        {/* ── Lightbox Dialog ── */}
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm" />
          <Dialog.Content
            aria-label={`${product.name} image viewer`}
            className="fixed inset-0 z-[71] flex items-center justify-center p-4 focus:outline-none"
            onClick={(event) => {
              if (event.target === event.currentTarget) setLightboxOpen(false)
            }}
          >
            <Dialog.Title className="sr-only">{product.name} image viewer</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close image viewer"
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </Dialog.Close>

            <div className="relative h-[min(80vh,800px)] w-full max-w-4xl">
              <Image
                src={galleryImages[selectedImage] || galleryImages[0]}
                alt={`${product.name}, image ${selectedImage + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImage((idx) => (idx + galleryImages.length - 1) % galleryImages.length)
                  }
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedImage((idx) => (idx + 1) % galleryImages.length)}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/15 p-3 text-white hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ArrowLeft size={20} className="rotate-180" />
                </button>
                <p className="absolute bottom-6 text-xs font-semibold text-white/80 bg-black/40 px-3 py-1 rounded-full">
                  {selectedImage + 1} / {galleryImages.length} &middot; Use keyboard arrows to browse
                </p>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  )
}
export default ProductDetailClient
