'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  AlertTriangle,
  Home,
  RefreshCw,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

export default function OrderLookupPage() {
  const params = useParams()
  const reference = params.reference as string

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  const [alreadyLookedUp, setAlreadyLookedUp] = useState(false)

  type OrderData = {
    reference: string
    customerName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    subtotal: number
    deliveryFee: number
    total: number
    status: string
    createdAt: Date
    items: {
      nameSnapshot: string
      labelSnapshot: string
      qty: number
      unitPrice: number
    }[]
  }

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${reference}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Order not found')
      }

      setOrderData(data.order)
      setAlreadyLookedUp(true)
      toast.success('Order found!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to lookup order')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle2 size={20} className="text-emerald-600" />
      case 'PENDING':
        return <Clock size={20} className="text-amber-600" />
      case 'PROCESSING':
        return <RefreshCw size={20} className="text-blue-600" />
      case 'DELIVERED':
        return <Truck size={20} className="text-brand-green" />
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle size={20} className="text-red-600" />
      default:
        return <AlertTriangle size={20} className="text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-100 text-emerald-800'
      case 'PENDING':
        return 'bg-amber-100 text-amber-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'DELIVERED':
        return 'bg-brand-green/20 text-brand-green'
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  if (!reference) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <AlertTriangle size={48} className="text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid Order Reference</h1>
          <p className="text-slate-500 mb-8">Please check your order reference and try again.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white font-bold px-6 py-3 rounded-xl transition-all"
          >
            <Home size={16} /> Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto mb-4">
            <Package size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Order Status Lookup
          </h1>
          <p className="text-slate-500">
            Enter your email to view the status of order <span className="font-mono font-bold text-slate-800">{reference}</span>
          </p>
        </div>

        {!alreadyLookedUp ? (
          /* Lookup Form */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-6">
            <form onSubmit={handleLookup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address Used for Order
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-white font-bold text-sm transition-all shadow-lg shadow-brand-green/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" /> Looking up order...
                  </>
                ) : (
                  <>
                    <Search size={18} /> Look Up Order
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Order Details */
          <>
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
              {/* Order Header */}
              <div className="p-6 sm:p-8 border-b border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Order Details</h2>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(orderData?.status || 'PENDING')}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getStatusColor(orderData?.status || 'PENDING')}`}>
                      {orderData?.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Order Reference</span>
                    <span className="font-mono font-bold text-slate-900">{orderData?.reference}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Customer</span>
                    <span className="font-bold text-slate-900">{orderData?.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Email</span>
                    <span className="font-bold text-slate-900">{orderData?.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-bold text-slate-900">{orderData?.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Delivery Address</span>
                    <span className="font-bold text-slate-900 text-right max-w-[200px]">
                      {orderData?.address}, {orderData?.city}, {orderData?.state}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Order Date</span>
                    <span className="font-bold text-slate-900">
                      {orderData?.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 sm:p-8 bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                  Order Items ({orderData?.items.length})
                </h3>
                <div className="space-y-3">
                  {orderData?.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="font-bold text-slate-900">{item.nameSnapshot}</p>
                        <p className="text-xs text-slate-500">{item.labelSnapshot} × {item.qty}</p>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatPrice(item.unitPrice * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-6 sm:p-8 border-t border-slate-100">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">{formatPrice(orderData?.subtotal || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-slate-900">{formatPrice(orderData?.deliveryFee || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-extrabold text-brand-green text-lg">{formatPrice(orderData?.total || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
                Order Status Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${orderData?.status === 'PENDING' || orderData?.status === 'PAID' || orderData?.status === 'PROCESSING' || orderData?.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Order Placed</p>
                    <p className="text-xs text-slate-500">Your order has been received</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${orderData?.status === 'PAID' || orderData?.status === 'PROCESSING' || orderData?.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Payment Confirmed</p>
                    <p className="text-xs text-slate-500">Payment successfully processed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${orderData?.status === 'PROCESSING' || orderData?.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <RefreshCw size={16} className={orderData?.status === 'PROCESSING' || orderData?.status === 'DELIVERED' ? 'animate-spin' : ''} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Processing</p>
                    <p className="text-xs text-slate-500">Your order is being prepared</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${orderData?.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Truck size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Delivered</p>
                    <p className="text-xs text-slate-500">Order has been delivered</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-white font-bold text-sm transition-all shadow-lg shadow-brand-green/30 flex items-center justify-center gap-2"
          >
            <Home size={18} /> Return to Home
          </Link>
          {alreadyLookedUp && (
            <button
              type="button"
              onClick={() => {
                setAlreadyLookedUp(false)
                setOrderData(null)
                setEmail('')
              }}
              className="flex-1 py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Search size={18} /> Look Up Another Order
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
