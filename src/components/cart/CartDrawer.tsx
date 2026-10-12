'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const router = useRouter()
  const { items, isDrawerOpen, closeDrawer, updateQty, removeItem, subtotal, totalItems } =
    useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  if (!mounted || !isDrawerOpen) return null

  const itemCount = totalItems()
  const cartSubtotal = subtotal()

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-up border-l border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Cart</h2>
              <p className="text-xs text-slate-500">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors"
            aria-label="Close cart drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                <ShoppingBag size={30} />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-[220px] mb-6">
                Explore our premium foodstuffs, grains, oils, and agricultural commodities.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeDrawer()
                  router.push('/products')
                }}
                className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-brand-green/20"
              >
                Browse Products <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.variantId} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                {/* Product Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 shrink-0 overflow-hidden relative flex items-center justify-center text-slate-400">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name || 'Product'}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <ShoppingBag size={20} />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                  <div className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md mt-0.5">
                    {item.label}
                  </div>
                  <p className="text-xs font-bold text-brand-green mt-1">
                    {formatPrice((item.price ?? 0) * item.qty)}
                    {item.qty > 1 && (
                      <span className="text-[10px] font-normal text-slate-400 ml-1">
                        ({formatPrice(item.price ?? 0)} each)
                      </span>
                    )}
                  </p>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQty(item.variantId, item.qty - 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-800">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (item.stock && item.qty >= item.stock) return
                          updateQty(item.variantId, item.qty + 1)
                        }}
                        disabled={Boolean(item.stock && item.qty >= item.stock)}
                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.variantId)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="font-extrabold text-slate-900 text-base">
                {formatPrice(cartSubtotal)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Delivery calculated at checkout based on location & weight.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  closeDrawer()
                  router.push('/cart')
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs bg-white hover:bg-slate-50 transition-colors text-center"
              >
                View Full Cart
              </button>
              <button
                type="button"
                onClick={() => {
                  closeDrawer()
                  router.push('/checkout')
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white font-bold text-xs transition-colors shadow-md shadow-brand-green/20 text-center flex items-center justify-center gap-1.5"
              >
                Checkout <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default CartDrawer
