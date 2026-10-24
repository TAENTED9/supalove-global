'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Lock,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  MapPin,
  User,
} from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const { items, validateCart, subtotal, totalItems } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stockIssues, setStockIssues] = useState(false)

  // Form state
  const [customerName, setCustomerName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  // Calculated values: Lagos (₦1,500) vs other states (₦3,500)
  const isLagos = state.trim().toLowerCase() === 'lagos'
  const deliveryFee = state ? (isLagos ? 150000 : 350000) : 150000
  const cartSubtotal = subtotal()
  const total = cartSubtotal + deliveryFee

  useEffect(() => {
    setMounted(true)
    validateCart().then((res) => {
      if (res.hasStockIssues) {
        setStockIssues(true)
        toast.warning('Some item quantities were adjusted to match current warehouse stock.')
      }
    })
  }, [validateCart])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
          <RefreshCw className="animate-spin text-brand-green" size={20} />
          Loading checkout...
        </div>
      </div>
    )
  }

  const itemCount = totalItems()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={36} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h1>
          <p className="text-slate-500 mb-8">Add some foodstuffs to proceed with checkout.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          address,
          city,
          state,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            qty: i.qty,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      // Redirect to Flutterwave payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        throw new Error('No payment URL returned')
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 font-medium">
          <Link href="/" className="hover:text-slate-800 transition-colors">
            Home
          </Link>
          <ChevronRight size={13} />
          <Link href="/cart" className="hover:text-slate-800 transition-colors">
            Cart
          </Link>
          <ChevronRight size={13} />
          <span className="text-slate-800 font-bold">Checkout</span>
        </nav>

        {/* Stock Warning */}
        {stockIssues && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800">
              <p className="font-bold">Live Inventory Adjustment</p>
              <p className="mt-0.5">
                Some item quantities were adjusted to match current warehouse stock. Please review before proceeding.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-6">
                Customer Details
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <User size={16} /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Adewale Okafor"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. adewale@example.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 08012345678"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={16} /> Delivery Address
                  </h2>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 15 Adeniran Ogunsanya Street, Surulere"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Lagos"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        State *
                      </label>
                      <select
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                      >
                        <option value="">Select State</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Abuja">Abuja</option>
                        <option value="Kano">Kano</option>
                        <option value="Ibadan">Ibadan</option>
                        <option value="Port Harcourt">Port Harcourt</option>
                        <option value="Benin">Benin</option>
                        <option value="Kaduna">Kaduna</option>
                        <option value="Ilorin">Ilorin</option>
                        <option value="Aba">Aba</option>
                        <option value="Jos">Jos</option>
                        <option value="Owerri">Owerri</option>
                        <option value="Enugu">Enugu</option>
                        <option value="Abeokuta">Abeokuta</option>
                        <option value="Maiduguri">Maiduguri</option>
                        <option value="Zaria">Zaria</option>
                        <option value="Sokoto">Sokoto</option>
                        <option value="Calabar">Calabar</option>
                        <option value="Warri">Warri</option>
                        <option value="Uyo">Uyo</option>
                        <option value="Akure">Akure</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Order Summary Preview */}
                <div className="pt-4 border-t border-slate-100">
                  <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                    Order Items ({itemCount})
                  </h2>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.variantId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="relative w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.name || ''} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ShoppingBag size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-slate-500">{item.label} × {item.qty}</p>
                        </div>
                        <span className="text-xs font-bold text-brand-green">
                          {formatPrice((item.price ?? 0) * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-white font-bold text-sm transition-all shadow-lg shadow-brand-green/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} /> Pay {formatPrice(total)} with Flutterwave
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  By proceeding, you agree to our terms and conditions. Secure payment powered by Flutterwave.
                </p>
              </form>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-bold text-slate-900">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-slate-900">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>VAT / Tax</span>
                  <span className="text-brand-green text-xs font-bold">Included</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="text-2xl font-black text-brand-green">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Security Badges */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 text-xs text-slate-600 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Lock size={16} className="text-brand-green shrink-0" />
                <span>256-bit SSL Encrypted Checkout</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-brand-green shrink-0" />
                <span>PCI DSS Compliant Payment Processing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CreditCard size={16} className="text-brand-green shrink-0" />
                <span>Bank Transfer, Cards & USSD Accepted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
