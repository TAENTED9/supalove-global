'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  RefreshCw,
  Printer,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

interface OrderDetail {
  id: string
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
  status: 'PENDING' | 'PAID' | 'FAILED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED'
  flwTransactionId: string | null
  createdAt: Date
  items: {
    id: string
    nameSnapshot: string
    labelSnapshot: string
    qty: number
    unitPrice: number
  }[]
}

export default function AdminOrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/orders/${orderId}`)
      const data = await res.json()
      if (data.success) {
        setOrder(data.order)
      } else {
        toast.error(data.error || 'Failed to load order')
      }
    } catch {
      toast.error('Failed to load order')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order')
      }

      toast.success('Order status updated')
      fetchOrder()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error updating order')
    } finally {
      setUpdating(false)
    }
  }

  const handlePrint = () => {
    window.print()
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
        return null
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
          <RefreshCw size={20} className="animate-spin text-brand-green" /> Loading order...
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Order not found</h1>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white font-bold px-6 py-3 rounded-xl transition-all mt-4"
          >
            <ArrowLeft size={16} /> Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Order Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {order.reference}
              </h1>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar size={14} />
              <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {order.flwTransactionId && (
            <div className="text-xs">
              <span className="text-slate-500">Flutterwave TX:</span>
              <span className="font-mono text-slate-800 ml-1">{order.flwTransactionId}</span>
            </div>
          )}
        </div>

        {/* Status Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
          {order.status === 'PAID' && (
            <button
              type="button"
              onClick={() => handleStatusUpdate('PROCESSING')}
              disabled={updating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} /> Mark as Processing
            </button>
          )}
          {order.status === 'PROCESSING' && (
            <button
              type="button"
              onClick={() => handleStatusUpdate('DELIVERED')}
              disabled={updating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              <Truck size={14} /> Mark as Delivered
            </button>
          )}
          {(order.status === 'PENDING' || order.status === 'PAID') && (
            <button
              type="button"
              onClick={() => handleStatusUpdate('CANCELLED')}
              disabled={updating}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
            >
              <XCircle size={14} /> Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User size={16} /> Customer Information
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <User size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 text-xs">Name</p>
                  <p className="font-bold text-slate-900">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 text-xs">Email</p>
                  <p className="font-bold text-slate-900">{order.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 text-xs">Phone</p>
                  <p className="font-bold text-slate-900">{order.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 text-xs">Delivery Address</p>
                  <p className="font-bold text-slate-900">
                    {order.address}, {order.city}, {order.state}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShoppingBag size={16} /> Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-900">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-extrabold text-brand-green text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShoppingBag size={16} /> Order Items ({order.items.length})
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">{item.nameSnapshot}</p>
                    <p className="text-xs text-slate-500">{item.labelSnapshot} × {item.qty}</p>
                  </div>
                  <span className="font-bold text-brand-green text-sm">
                    {formatPrice(item.unitPrice * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
