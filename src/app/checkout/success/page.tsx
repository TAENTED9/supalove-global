import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Home, Package } from 'lucide-react'
import { verifyAndApplyOrderPayment } from '@/lib/flutterwave'
import { formatPrice } from '@/lib/utils'
import { ClearCartOnMount } from '@/components/cart/ClearCartOnMount'

interface PageProps {
  searchParams: Promise<{
    transaction_id?: string
    tx_ref?: string
  }>
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { transaction_id: transactionId, tx_ref: txRef } = await searchParams
  if (!transactionId || !/^\d+$/.test(transactionId) || !txRef) {
    redirect('/checkout/failed')
  }

  let payment: Awaited<ReturnType<typeof verifyAndApplyOrderPayment>>
  try {
    payment = await verifyAndApplyOrderPayment(txRef, transactionId)
  } catch (error) {
    console.error('Checkout redirect verification failed:', error)
    redirect('/checkout/failed')
  }

  if (!payment.verified) {
    redirect('/checkout/failed')
  }

  const order = payment.order

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClearCartOnMount transactionId={transactionId} />
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-500">
            Your payment is confirmed. We&apos;ve received your order and will begin processing shortly.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Order Details</h2>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                {order.status}
              </span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Order Reference</span>
                <span className="font-mono font-bold text-slate-900">{order.reference}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Customer</span>
                <span className="font-bold text-slate-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Email</span>
                <span className="font-bold text-slate-900">{order.email}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Total Paid</span>
                <span className="font-extrabold text-brand-green text-lg">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
              Order Items ({order.items.length})
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
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
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-white font-bold text-sm transition-all shadow-lg shadow-brand-green/30 flex items-center justify-center gap-2"
          >
            <Home size={18} /> Return to Home
          </Link>
          <Link
            href={`/orders/${order.reference}`}
            className="flex-1 py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Package size={18} /> Track Order
          </Link>
        </div>
      </div>
    </div>
  )
}
