'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ShoppingBag,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  RefreshCw,
  Calendar,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

interface OrderRecord {
  id: string
  reference: string
  customerName: string
  email: string
  phone: string
  total: number
  status: 'PENDING' | 'PAID' | 'FAILED' | 'PROCESSING' | 'DELIVERED' | 'CANCELLED'
  createdAt: Date
  items: {
    nameSnapshot: string
    labelSnapshot: string
    qty: number
  }[]
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [exporting, setExporting] = useState(false)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
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
      fetchOrders()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error updating order')
    }
  }

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/admin/orders/export')
      if (!res.ok) {
        throw new Error('Failed to export orders')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Orders exported successfully')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error exporting orders')
    } finally {
      setExporting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle2 size={16} className="text-emerald-600" />
      case 'PENDING':
        return <Clock size={16} className="text-amber-600" />
      case 'PROCESSING':
        return <RefreshCw size={16} className="text-blue-600" />
      case 'DELIVERED':
        return <Truck size={16} className="text-brand-green" />
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle size={16} className="text-red-600" />
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === 'PENDING').length,
    PAID: orders.filter((o) => o.status === 'PAID').length,
    PROCESSING: orders.filter((o) => o.status === 'PROCESSING').length,
    DELIVERED: orders.filter((o) => o.status === 'DELIVERED').length,
    CANCELLED: orders.filter((o) => o.status === 'CANCELLED').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="text-brand-green" size={26} /> Customer Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage and track all customer orders and delivery status.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={exporting || orders.length === 0}
          className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
        >
          {exporting ? (
            <>
              <RefreshCw size={16} className="animate-spin" /> Exporting...
            </>
          ) : (
            <>
              <Download size={16} /> Export CSV
            </>
          )}
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === status
                ? 'bg-brand-green text-white shadow-md shadow-brand-green/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {status} ({count})
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by reference, customer name, or email..."
          className="w-full text-xs text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
            <RefreshCw size={16} className="animate-spin text-brand-green" /> Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            {orders.length === 0 ? 'No orders yet.' : 'No orders match your search criteria.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold text-slate-500">
                <tr>
                  <th className="py-3.5 px-6">Reference</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Items</th>
                  <th className="py-3.5 px-6">Total</th>
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-[11px] font-bold text-slate-800">
                        {order.reference}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-bold text-slate-900">{order.customerName}</p>
                        <p className="text-[10px] text-slate-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-brand-green">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} className="text-slate-400" />
                        <span className="text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-green hover:bg-slate-100 transition-colors"
                          title="View details"
                        >
                          <Eye size={15} />
                        </Link>
                        {order.status === 'PAID' && (
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(order.id, 'PROCESSING')}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Mark as processing"
                          >
                            <RefreshCw size={15} />
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-brand-green hover:bg-brand-green/10 transition-colors"
                            title="Mark as delivered"
                          >
                            <Truck size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
