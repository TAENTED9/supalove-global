'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Check, AlertCircle, Plus, Minus } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/Modal'
import type { ProductItem, VariantItem } from '@/lib/data'
import { trackStoreEvent } from '@/lib/analytics'

// ─── Wishlist helpers (localStorage, optimistic) ───────────────────────────
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
  if (wl.has(id)) { wl.delete(id) } else { wl.add(id) }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(wl)))
  return wl.has(id)
}

// ─── Badge resolution (ONE badge: Sale > Featured > New) ───────────────────
function resolveBadge(
  product: ProductItem,
  variant: VariantItem
): { label: string; className: string } | null {
  const discountPct = variant.compareAtPrice && variant.compareAtPrice > variant.price
    ? Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100)
    : 0

  if (discountPct > 0) {
    return {
      label: `-${discountPct}%`,
      className: 'bg-orange-500 text-white',
    }
  }
  if (product.isFeatured) {
    return { label: 'Featured', className: 'bg-brand-500 text-white' }
  }
  // "New" – no createdAt on ProductItem currently; skip for safety
  return null
}

// ─── Unit hint helper ───────────────────────────────────────────────────────
function unitHint(label: string, unit: string): string {
  // Show unit dimension hint after the price, e.g. "/ 50kg bag", "/ 5L jerry"
  if (unit === 'BAG' && label.toLowerCase().includes('50')) return '/ 50kg bag'
  if (unit === 'BAG' && label.toLowerCase().includes('25')) return '/ 25kg bag'
  if (unit === 'BAG') return '/ bag'
  if (unit === 'KG') {
    const match = label.match(/(\d+)\s*kg/i)
    return match ? `/ ${match[1]}kg` : '/ kg'
  }
  if (unit === 'LITRE') {
    const match = label.match(/(\d+)\s*l/i)
    return match ? `/ ${match[1]}L` : '/ litre'
  }
  if (unit === 'CARTON') return '/ carton'
  return ''
}

// ─── Component ─────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: ProductItem
  priority?: boolean // for LCP images
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem } = useCartStore()

  // Active variant state
  const [activeVariant, setActiveVariant] = useState<VariantItem>(
    product.variants[0] ?? {
      id: 'default', label: 'Standard', unit: 'KG', price: 0, stock: 10, sku: 'SKU',
    }
  )
  const [quantity, setQuantity] = useState(activeVariant.minOrderQty ?? 1)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  // Update quantity if activeVariant changes
  const handleSelectVariant = (v: VariantItem) => {
    setActiveVariant(v)
    setQuantity(v.minOrderQty ?? 1)
  }

  // Hydrate wishlist after mount to avoid SSR mismatch
  useEffect(() => {
    setWishlisted(getWishlist().has(product.id))
  }, [product.id])

  const handleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const next = toggleWishlist(product.id)
      setWishlisted(next)
      toast.success(next ? 'Added to wishlist' : 'Removed from wishlist')
    },
    [product.id]
  )

  const handleOpenSheet = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuantity(activeVariant.minOrderQty ?? 1)
    setSheetOpen(true)
  }

  const handleConfirmAddToCart = useCallback(() => {
    const minQty = activeVariant.minOrderQty ?? 1
    if (activeVariant.stock < minQty) {
      toast.error('This option is currently out of stock.')
      return
    }

    trackStoreEvent('add_to_cart', { productId: product.id, productSlug: product.slug })
    addItem({
      productId: product.id,
      variantId: activeVariant.id,
      qty: Math.max(minQty, quantity),
      name: product.name,
      label: activeVariant.label,
      price: activeVariant.price,
      image: product.images[0] ?? undefined,
      stock: activeVariant.stock,
      minOrderQty: minQty,
      sku: activeVariant.sku,
      unit: activeVariant.unit,
      slug: product.slug,
    })

    setAdded(true)
    setSheetOpen(false)
    toast.success(`${product.name} (${activeVariant.label}) added to cart!`)
    setTimeout(() => setAdded(false), 1500)
  }, [activeVariant, addItem, product, quantity])

  const primaryImage =
    product.images[0] ??
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'

  const badge = resolveBadge(product, activeVariant)
  const isOnSale = !!(activeVariant.compareAtPrice && activeVariant.compareAtPrice > activeVariant.price)
  const outOfStock = activeVariant.stock < (activeVariant.minOrderQty ?? 1)
  const lowStock = !outOfStock && activeVariant.stock <= 10
  const hint = unitHint(activeVariant.label, activeVariant.unit)

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-full flex flex-col">
      {/* ── Image area ──────────────────────────────────────────────── */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 flex-shrink-0 block"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover object-center group-hover:scale-[1.04] transition-transform duration-300"
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTRlN2VjIi8+PC9zdmc+"
        />

        {/* ONE badge top-left: Sale > Featured > New */}
        {badge && (
          <span
            className={cn(
              'absolute top-2 left-2 text-[10px] font-black px-2 py-0.5 rounded-full z-10',
              badge.className
            )}
          >
            {badge.label}
          </span>
        )}

        {/* Wishlist heart – top-right */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2 right-2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <Heart
            size={15}
            className={cn(
              'transition-colors',
              wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
            )}
          />
        </button>
      </Link>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="p-3 flex-1 flex flex-col">
        <Link href={`/products/${product.slug}`} className="flex-1 flex flex-col">
          {/* Product name – 2-line clamp */}
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug min-h-[2.6em] mb-2">
            {product.name}
          </h3>

          {/* Stock hint */}
          {outOfStock && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 mb-1">
              <AlertCircle size={10} />
              Out of stock
            </span>
          )}
          {lowStock && !outOfStock && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 mb-1">
              <AlertCircle size={10} />
              Only {activeVariant.stock} left
            </span>
          )}

          {/* Price line */}
          <div className="flex items-baseline gap-1.5 flex-wrap mt-auto">
            <span className="text-base font-black text-brand-500">
              {activeVariant.price === 0 ? 'From ₦—' : `From ${formatPrice(activeVariant.price)}`}
            </span>
            {hint && (
              <span className="text-[10px] text-gray-400 font-medium">{hint}</span>
            )}
            {isOnSale && activeVariant.compareAtPrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(activeVariant.compareAtPrice)}
              </span>
            )}
          </div>
        </Link>

        {/* Add button */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[10px] text-gray-400 truncate max-w-[60%]">
            {activeVariant.label}
          </span>
          <button
            type="button"
            onClick={handleOpenSheet}
            disabled={outOfStock}
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs active:scale-95 shrink-0',
              added
                ? 'bg-success-500 text-white'
                : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20',
              outOfStock && 'opacity-50 cursor-not-allowed pointer-events-none'
            )}
          >
            {added ? (
              <>
                <Check size={13} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Variant selection sheet / modal ─────────────────────────── */}
      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Select Size & Quantity"
      >
        <div className="space-y-4">
          {/* Product brief */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                {product.name}
              </h4>
              <p className="text-xs text-brand-500 font-bold mt-0.5">
                {formatPrice(activeVariant.price)}
                <span className="text-gray-400 font-normal ml-1">
                  ({activeVariant.unit})
                </span>
              </p>
            </div>
          </div>

          {/* Variant picker if > 1 variant */}
          {product.variants.length > 1 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Available Packaging &amp; Sizes
              </label>
              <div className="grid grid-cols-1 gap-2">
                {product.variants.map((v) => {
                  const isSelected = v.id === activeVariant.id
                  const isOut = v.stock < (v.minOrderQty ?? 1)
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={isOut}
                      onClick={() => handleSelectVariant(v)}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-xl border text-left transition-all',
                        isSelected
                          ? 'border-brand-500 bg-brand-50/60 ring-1 ring-brand-500'
                          : 'border-gray-200 hover:border-gray-300 bg-white',
                        isOut && 'opacity-40 cursor-not-allowed bg-gray-50'
                      )}
                    >
                      <div>
                        <div className="text-xs font-bold text-gray-900">
                          {v.label}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {isOut ? 'Out of stock' : `Stock: ${v.stock} ${v.unit.toLowerCase()}(s)`}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-brand-600">
                          {formatPrice(v.price)}
                        </span>
                        {v.compareAtPrice && v.compareAtPrice > v.price && (
                          <div className="text-[10px] text-gray-400 line-through">
                            {formatPrice(v.compareAtPrice)}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Quantity stepper */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-xs font-bold text-gray-700 block">Quantity</span>
              {activeVariant.minOrderQty && activeVariant.minOrderQty > 1 && (
                <span className="text-[10px] text-gray-400">
                  Min order: {activeVariant.minOrderQty}
                </span>
              )}
            </div>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(activeVariant.minOrderQty ?? 1, q - 1))}
                disabled={quantity <= (activeVariant.minOrderQty ?? 1)}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-10 text-center font-bold text-sm text-gray-900 select-none">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(activeVariant.stock, q + 1))}
                disabled={quantity >= activeVariant.stock}
                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Total & Confirm CTA */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block">
                Total Amount
              </span>
              <span className="text-base font-black text-brand-600">
                {formatPrice(activeVariant.price * quantity)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleConfirmAddToCart}
              disabled={outOfStock}
              className="flex-1 py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all text-center disabled:opacity-50"
            >
              Add to Basket
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default ProductCard
