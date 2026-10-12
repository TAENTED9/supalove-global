'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQty, removeItem, clearCart, subtotal, totalItems, validateCart, isSyncing } =
    useCartStore()
  const [mounted, setMounted] = useState(false)
  const [stockNotice, setStockNotice] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Always re-validate live prices & stock on cart page load
    validateCart().then((res) => {
      if (res.hasStockIssues) {
        setStockNotice(true)
        toast.warning('Some item quantities were adjusted to match current warehouse stock.')
      }
    })
  }, [validateCart])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
          <RefreshCw className="animate-spin text-brand-green" size={20} />
          Loading your shopping cart...
        </div>
      </div>
    )
  }

  const itemCount = totalItems()
  const cartSubtotal = subtotal()

  return (
    <div className="bg-slate-50/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 font-medium">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <ChevronRight size={13} />
          <span className="text-slate-800 font-bold">Shopping Cart</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200/80 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Your Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review your foodstuff selections, adjust quantities, and proceed to checkout.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              {isSyncing && (
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium animate-pulse">
                  <RefreshCw size={12} className="animate-spin" /> Verifying live prices...
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to remove all items from your cart?')) {
                    clearCart()
                    toast.info('Cart cleared')
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors border border-red-200"
              >
                <Trash2 size={13} /> Clear Cart
              </button>
            </div>
          )}
        </div>

        {/* Stock Warning Banner if clamped */}
        {stockNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <p className="font-bold">Live Inventory Adjustment</p>
              <p className="mt-0.5">
                We verified live warehouse quantities. Items with limited availability have been clamped to maximum available stock.
              </p>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <ShoppingBag size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
              You haven&apos;t added any foodstuffs yet. Discover our premium parboiled rice, pure palm oils, beans, and export commodities.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white text-xs sm:text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-md shadow-brand-green/20"
            >
              Start Shopping <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          /* Active Cart Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left: Line Items List */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden divide-y divide-slate-100">
              <div className="p-4 sm:p-6 bg-slate-50/70 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Produce &amp; Packaging</span>
                <span className="hidden sm:inline">Price &amp; Quantity</span>
              </div>

              {items.map((item) => {
                const itemTotal = (item.price ?? 0) * item.qty
                return (
                  <div
                    key={item.variantId}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    {/* Item Thumbnail & Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name || 'Produce'}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag size={24} />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        {item.slug ? (
                          <Link
                            href={`/products/${item.slug}`}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-brand-green transition-colors truncate block"
                          >
                            {item.name}
                          </Link>
                        ) : (
                          <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                            {item.name}
                          </h3>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] font-bold text-brand-green bg-brand-green/10 px-2.5 py-0.5 rounded-full">
                            {item.label}
                          </span>
                          {item.unit && (
                            <span className="text-[11px] font-semibold text-slate-400">
                              Unit: {item.unit}
                            </span>
                          )}
                          {item.sku && (
                            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                              SKU: {item.sku}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-semibold text-slate-600 sm:hidden mt-2">
                          {formatPrice(item.price ?? 0)} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity Stepper & Price Column */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="hidden sm:block text-right">
                        <span className="text-xs text-slate-400 block">Unit Price</span>
                        <span className="text-xs font-bold text-slate-800">
                          {formatPrice(item.price ?? 0)}
                        </span>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQty(item.variantId, item.qty - 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-9 text-center text-xs font-bold text-slate-800">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (item.stock && item.qty >= item.stock) {
                              toast.warning(`Maximum available warehouse stock reached (${item.stock})`)
                              return
                            }
                            updateQty(item.variantId, item.qty + 1)
                          }}
                          disabled={Boolean(item.stock && item.qty >= item.stock)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-xs text-slate-400 block sm:hidden">Total</span>
                        <span className="text-sm sm:text-base font-extrabold text-brand-green">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          removeItem(item.variantId)
                          toast.info('Item removed from cart')
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Bottom Actions inside table card */}
              <div className="p-4 sm:p-6 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-brand-green transition-colors"
                >
                  <RotateCcw size={14} /> Continue Shopping Foodstuffs
                </Link>
                <span className="text-xs text-slate-400 font-medium">
                  {itemCount} {itemCount === 1 ? 'total item' : 'total items'} in cart
                </span>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
                <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Produce Subtotal ({itemCount} items)</span>
                    <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Estimated Delivery</span>
                    <span className="text-slate-500 text-xs font-medium">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>Commodity Tax / VAT</span>
                    <span className="text-brand-green text-xs font-bold">
                      Included
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-900">Total Due</span>
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black text-brand-green block leading-none">
                      {formatPrice(cartSubtotal)}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Excluding doorstep freight
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/checkout')}
                  className="w-full py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-white font-bold text-sm transition-all shadow-lg shadow-brand-green/30 flex items-center justify-center gap-2 active:scale-95"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>

                <p className="text-[11px] text-center text-slate-400 leading-relaxed">
                  Fast, encrypted payment powered by Flutterwave. Bank Transfer, Cards &amp; USSD accepted.
                </p>
              </div>

              {/* Guarantees Box */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 text-xs text-slate-600 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-brand-green shrink-0" />
                  <span>100% Stone-Free &amp; Verified Pure Harvest</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck size={16} className="text-brand-orange shrink-0" />
                  <span>Doorstep Logistics across Lagos &amp; Nigeria</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CreditCard size={16} className="text-brand-green shrink-0" />
                  <span>Encrypted Checkout with Flutterwave</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
