'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Check, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'
import type { ProductItem, VariantItem } from '@/lib/data'

interface ProductCardProps {
  product: ProductItem
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  // Default to lowest price or first variant
  const [selectedVariant, setSelectedVariant] = useState<VariantItem>(
    product.variants[0] || {
      id: 'default',
      label: 'Standard',
      unit: 'KG',
      price: 0,
      stock: 10,
      sku: 'SKU',
    }
  )
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      qty: 1,
      name: product.name,
      label: selectedVariant.label,
      price: selectedVariant.price,
      image: product.images[0] || undefined,
      stock: selectedVariant.stock,
      sku: selectedVariant.sku,
      unit: selectedVariant.unit,
    })

    setAdded(true)
    toast.success(`Added ${product.name} (${selectedVariant.label}) to cart!`)
    setTimeout(() => setAdded(false), 1500)
  }

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1">
      {/* Product Image & Badges */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square w-full bg-slate-100 overflow-hidden block">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-full shadow-sm border border-slate-200/50">
            {product.category.name}
          </span>
          {product.isFeatured && (
            <span className="text-[9px] font-extrabold uppercase tracking-wider bg-brand-orange text-white px-2 py-0.5 rounded-full shadow-sm w-fit">
              Featured
            </span>
          )}
        </div>

        {/* Quick View Floating Action */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 hidden sm:block">
          <div className="p-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-700 hover:text-brand-green shadow-md">
            <Eye size={16} />
          </div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-brand-green transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Variant Selector Pills if multiple variants exist */}
          {product.variants.length > 1 && (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedVariant(v)
                  }}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    selectedVariant.id === v.id
                      ? 'border-brand-green bg-brand-green/10 text-brand-green font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Add to Cart Row */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              {selectedVariant.label}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-brand-green">
              {formatPrice(selectedVariant.price)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm active:scale-95 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-brand-green hover:bg-brand-green-hover text-white shadow-brand-green/20'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
export default ProductCard
