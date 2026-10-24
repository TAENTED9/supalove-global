'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Check,
  Plus,
  Minus,
  Heart,
  MessageCircle,
  Phone,
  Package,
  ArrowLeft,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { siteWhatsappHref } from '@/config/site'
import { toast } from 'sonner'
import type { ProductItem, VariantItem } from '@/lib/data'

interface ProductDetailClientProps {
  product: ProductItem
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const { addItem, openDrawer } = useCartStore()

  const [selectedVariant, setSelectedVariant] = useState<VariantItem>(
    product.variants[0] || {
      id: 'default',
      label: 'Standard Pack',
      unit: 'KG',
      price: 0,
      stock: 10,
      minOrderQty: 1,
      sku: 'SKU',
    }
  )

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)
  const [saved, setSaved] = useState(false)

  const galleryImages =
    product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80']

  // Check if product is saved in wishlist
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setSaved(wishlist.includes(product.id))
  }, [product.id])

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      qty: quantity,
      name: product.name,
      label: selectedVariant.label,
      price: selectedVariant.price,
      image: galleryImages[0] || undefined,
      stock: selectedVariant.stock,
      sku: selectedVariant.sku,
      unit: selectedVariant.unit,
    })

    setAdded(true)
    toast.success(`Added ${quantity}x ${product.name} (${selectedVariant.label}) to cart!`)
    openDrawer()
    setTimeout(() => setAdded(false), 1500)
  }

  const handleBuyNow = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      qty: quantity,
      name: product.name,
      label: selectedVariant.label,
      price: selectedVariant.price,
      image: galleryImages[0] || undefined,
      stock: selectedVariant.stock,
      sku: selectedVariant.sku,
      unit: selectedVariant.unit,
    })

    router.push('/checkout')
  }

  const handleSave = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    if (saved) {
      const newWishlist = wishlist.filter((id: string) => id !== product.id)
      localStorage.setItem('wishlist', JSON.stringify(newWishlist))
      setSaved(false)
      toast.info('Removed from wishlist')
    } else {
      wishlist.push(product.id)
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
      setSaved(true)
      toast.success('Saved to wishlist')
    }
  }

  const handleWhatsAppOrder = () => {
    const message = `Hi, I want to order ${product.name} - ${selectedVariant.label} x${quantity}`
    const url = siteWhatsappHref(message)
    window.open(url, '_blank')
  }

  const minQty = selectedVariant.minOrderQty || 1

  // Clamp quantity to minOrderQty and stock
  const clampedQuantity = Math.max(minQty, Math.min(quantity, selectedVariant.stock || 999))

  return (
    <div>
      {/* Back button using router.back() */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-green transition-colors mb-4"
      >
        <ArrowLeft size={14} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column (lg:col-span-3): Hero, Thumbnails, Description */}
        <div className="lg:col-span-3 space-y-4">
        {/* Square Hero */}
        <div className="relative aspect-square w-full rounded-2xl bg-slate-100 overflow-hidden border border-slate-200/80">
          {galleryImages[selectedImage] ? (
            <Image
              src={galleryImages[selectedImage]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-green/20 to-brand-orange/20">
              <span className="text-6xl font-black text-slate-400">{product.name[0]}</span>
            </div>
          )}
        </div>

        {/* 64x64 Thumbnail Strip */}
        {galleryImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto md:flex-wrap">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 ${
                  selectedImage === idx
                    ? 'border-brand-green'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Description Card */}
        <div className="rounded-2xl border border-slate-200 p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Description</h3>
          <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Right Column (lg:col-span-2): Buy Box */}
      <div className="lg:col-span-2">
        <div className="rounded-2xl border border-slate-200 p-5 space-y-4">
          {/* Name */}
          <h1 className="text-xl font-black text-slate-900 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="space-y-1">
            {selectedVariant.compareAtPrice && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400 line-through">
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
                <span className="text-xs font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-full">
                  -{Math.round(((selectedVariant.compareAtPrice - selectedVariant.price) / selectedVariant.compareAtPrice) * 100)}%
                </span>
              </div>
            )}
            <div className="text-3xl font-black text-brand-green">
              {formatPrice(selectedVariant.price)}
            </div>
          </div>

          {/* Variant Chips */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Select variant
            </span>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(v)
                      setQuantity(Math.max(v.minOrderQty || 1, 1))
                    }}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-brand-green bg-brand-green/10 text-brand-green'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {v.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Qty Stepper */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Quantity (min: {minQty})
            </span>
            <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
                disabled={quantity <= minQty}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="flex-1 text-center text-sm font-bold text-slate-800">
                {clampedQuantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(selectedVariant.stock || 999, quantity + 1))}
                disabled={Boolean(selectedVariant.stock && quantity >= selectedVariant.stock)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Stock Badge */}
          <div className="flex items-center gap-2">
            <Package size={14} className="text-slate-400" />
            <span className="text-xs text-slate-600">
              {selectedVariant.stock > 0
                ? `${selectedVariant.stock} in stock`
                : 'Out of stock'}
            </span>
          </div>

          {/* Add to Cart + Buy Now */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={selectedVariant.stock === 0}
              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-green hover:bg-brand-green-hover text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? (
                <>
                  <Check size={16} /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={16} /> Add to Cart
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={selectedVariant.stock === 0}
              className="w-full py-3 rounded-xl font-bold text-sm bg-brand-orange hover:bg-brand-orange-hover text-white flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          {/* Order on WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full py-3 rounded-xl font-bold text-sm bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 transition-all"
          >
            <MessageCircle size={16} /> Order on WhatsApp
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              saved
                ? 'bg-brand-green text-white'
                : 'border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Heart size={16} className={saved ? 'fill-white' : ''} />
            {saved ? 'Saved' : 'Save for later'}
          </button>

          {/* Delivery Note */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-start gap-2">
              <Phone size={14} className="text-brand-green shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                Delivery fees calculated at checkout based on your location.
              </p>
            </div>
          </div>

          {/* Wholesale Tiers */}
          {selectedVariant.priceTiers && selectedVariant.priceTiers.length > 0 && (
            <div className="p-3 rounded-xl bg-brand-green/5 border border-brand-green/20">
              <h4 className="text-xs font-bold text-brand-green uppercase tracking-wider mb-2">
                Buy more, save more
              </h4>
              <div className="space-y-1.5">
                {selectedVariant.priceTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded bg-white/50"
                  >
                    <span className="text-slate-700">{tier.minQty}+ units</span>
                    <span className="font-bold text-brand-green">
                      {formatPrice(tier.price)} each
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)
}
export default ProductDetailClient
