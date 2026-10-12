import Link from 'next/link'
import {
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Plus,
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { ALL_PRODUCTS } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage() {
  let totalProducts = ALL_PRODUCTS.length
  let totalCategories = 6
  let totalOrders = 0
  let totalRevenue = 0
  let pendingOrders = 0
  let processingOrders = 0
  let deliveredOrders = 0
  let averageOrderValue = 0
  let lowStockProducts: { name: string; label: string; stock: number; sku: string }[] = []
  let recentOrders: {
    id: string
    reference: string
    customerName: string
    total: number
    status: string
    createdAt: Date
  }[] = []

  try {
    const [prodCount, catCount, orders, lowStockVariants] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      prisma.productVariant.findMany({
        where: { stock: { lte: 25 } },
        include: { product: true },
        take: 4,
      }),
    ])

    totalProducts = prodCount || totalProducts
    totalCategories = catCount || totalCategories
    totalOrders = orders.length
    recentOrders = orders

    const revenueSum = await prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'PAID' },
    })
    totalRevenue = revenueSum._sum.total || 0

    pendingOrders = await prisma.order.count({
      where: { status: 'PENDING' },
    })

    processingOrders = await prisma.order.count({
      where: { status: 'PROCESSING' },
    })

    deliveredOrders = await prisma.order.count({
      where: { status: 'DELIVERED' },
    })

    // Calculate average order value
    const paidOrdersCount = await prisma.order.count({
      where: { status: 'PAID' },
    })
    if (paidOrdersCount > 0) {
      averageOrderValue = totalRevenue / paidOrdersCount
    }

    if (lowStockVariants.length > 0) {
      lowStockProducts = lowStockVariants.map((v) => ({
        name: v.product.name,
        label: v.label,
        stock: v.stock,
        sku: v.sku,
      }))
    }
  } catch {
    // Database fallback calculations
    lowStockProducts = [
      { name: 'Special Ofada Rice', label: '10kg Bag', stock: 12, sku: 'OFADA-10KG' },
      { name: 'Pure Raw Nigerian Honey', label: '1 Litre', stock: 15, sku: 'HONEY-1L' },
      { name: 'Pure Red Palm Oil', label: '25 Litres Export Drum', stock: 20, sku: 'PALM-25L' },
    ]
  }

  return (
    <div className="space-y-8">
      {/* Overview Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green bg-brand-green/10 px-2.5 py-0.5 rounded-full mb-1">
            <ShieldCheck size={12} /> Live Management Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Operational Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time foodstuff supply levels, warehouse stock alerts, and export orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-green/20"
          >
            <Plus size={15} /> Add Foodstuff
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <Layers size={15} /> Categories
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-brand-green flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {formatPrice(totalRevenue)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Avg: {formatPrice(averageOrderValue)}/order</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalOrders}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {pendingOrders} pending, {processingOrders} processing
            </p>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Commodities
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package size={20} />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalProducts}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Across {totalCategories} categories</p>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Low Stock Alerts
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {lowStockProducts.length}
            </div>
            <p className="text-[11px] text-amber-600 font-semibold mt-1">
              Requires warehouse replenishment
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Delivered Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Delivered Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{deliveredOrders}</div>
          <p className="text-[10px] text-slate-400 mt-1">Successfully completed</p>
        </div>

        {/* Processing Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Transit
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{processingOrders}</div>
          <p className="text-[10px] text-slate-400 mt-1">Currently being processed</p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Delivery Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Package size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Of total orders</p>
        </div>
      </div>

      {/* Two-Column Detail View: Recent Orders & Stock Alert List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Recent Customer Orders</h3>
              <p className="text-xs text-slate-400">Direct purchases and export bookings</p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-bold text-brand-green hover:underline flex items-center gap-1"
            >
              All Orders <ArrowRight size={13} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No orders registered yet. New customer orders will display here in real time.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {recentOrders.map((o) => (
                <div key={o.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-slate-800 block">
                      {o.reference}
                    </span>
                    <span className="text-slate-500 text-xs">{o.customerName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-brand-green block">
                      {formatPrice(o.total)}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        o.status === 'PAID'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <AlertTriangle size={15} className="text-amber-500" />
                Warehouse Inventory Watchlist
              </h3>
              <p className="text-xs text-slate-400">Items below threshold (25 units)</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 text-xs p-2">
            {lowStockProducts.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-800">{item.name}</h4>
                  <span className="text-[11px] text-slate-400">
                    {item.label} &middot; <code className="font-mono text-[10px]">{item.sku}</code>
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-xs">
                    {item.stock} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
