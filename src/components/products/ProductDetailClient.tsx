'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Check,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Ship,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Share2,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
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
      sku: 'SKU',
    }
  )

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [added, setAdded] = useState(false)

  const galleryImages =
    product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80']

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Buy verified ${product.name} on Supalovefoods`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.info('Product link copied to clipboard!')
    }
  }

  const unitTotal = selectedVariant.price * quantity

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      {/* Left Column: Image Gallery */}
      <div className="lg:col-span-6 space-y-4">
        {/* Main Image Container */}
        <div className="relative aspect-square w-full rounded-3xl bg-slate-100 overflow-hidden border border-slate-200/80 shadow-md">
          <Image
            src={galleryImages[selectedImage] || galleryImages[0]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-all duration-300"
          />

          {/* Badges on Gallery */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-800 px-3 py-1 rounded-full shadow-sm border border-slate-200/50">
              {product.category.name}
            </span>
            <span className="text-xs font-extrabold uppercase tracking-wider bg-brand-green text-white px-3 py-1 rounded-full shadow-sm w-fit flex items-center gap-1">
              <CheckCircle2 size={12} /> 100% Stone-Free
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-slate-900 shadow-sm border border-slate-200/50 transition-colors"
            aria-label="Share product"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Thumbnail Selector if multiple images exist */}
        {galleryImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImage === idx
                    ? 'border-brand-green shadow-md scale-105'
                    : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Trust Card beneath gallery */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-brand-green" />
            Verified Commodity Assurance
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-brand-orange" />
              <span>Machine sorted &amp; de-stoned</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-brand-green" />
              <span>Doorstep Lagos delivery (24h)</span>
            </div>
            <div className="flex items-center gap-2">
              <Ship size={14} className="text-blue-600" />
              <span>Phyto-sanitary export clearance</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-brand-green" />
              <span>Tamper-evident packaging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Product Info & Variant Options */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-xs font-bold text-brand-green hover:underline uppercase tracking-wider"
            >
              {product.category.name}
            </Link>
            <span className="text-slate-300">&middot;</span>
            <span className="text-xs text-slate-400 font-mono">SKU: {selectedVariant.sku}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {product.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Variant Selection Box */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Select Size / Packaging Option:
              </span>
              <span className="text-xs font-semibold text-brand-green">
                {selectedVariant.label} ({selectedVariant.unit})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(v)
                      setQuantity(1)
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-brand-green bg-brand-green/10 ring-2 ring-brand-green/20'
                        : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-900">{v.label}</span>
                    <span className="block text-xs font-extrabold text-brand-green mt-1">
                      {formatPrice(v.price)}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {v.stock > 0 ? `${v.stock} in stock` : 'Out of stock'}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pricing Display */}
          <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Price ({selectedVariant.label})
              </span>
              <div className="text-2xl sm:text-3xl font-black text-brand-green">
                {formatPrice(selectedVariant.price)}
              </div>
            </div>
            {quantity > 1 && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Total ({quantity} units)
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {formatPrice(unitTotal)}
                </span>
              </div>
            )}
          </div>

          {/* Quantity Stepper & Stock Check */}
          <div className="flex items-center gap-4 pt-2">
            <span className="text-xs font-bold text-slate-700">Quantity:</span>
            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-12 text-center text-sm font-bold text-slate-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(selectedVariant.stock || 999, quantity + 1))}
                disabled={Boolean(selectedVariant.stock && quantity >= selectedVariant.stock)}
                className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-xs text-slate-400">
              {selectedVariant.unit} unit
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-brand-green hover:bg-brand-green-hover text-white shadow-brand-green/20'
              }`}
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
              className="py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-brand-orange hover:bg-brand-orange-hover text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-brand-orange/20 active:scale-95"
            >
              Buy Now <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* Commercial Wholesale Callout */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
          <PhoneCall size={18} className="text-brand-orange shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-slate-900">Ordering 50+ Bags or Need a 20ft/40ft Ocean Container?</p>
            <p className="text-slate-600 mt-0.5">
              Contact our wholesale desk directly at <span className="font-bold text-slate-800">+234 (0) 800-SUPALOVE</span> for direct bulk invoice discounting and freight booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProductDetailClient
