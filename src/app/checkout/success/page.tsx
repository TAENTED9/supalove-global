import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CheckCircle2, Package, Home } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  searchParams: {
    transaction_id?: string
    tx_ref?: string
  }
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { transaction_id, tx_ref } = searchParams

  if (!transaction_id || !tx_ref) {
    redirect('/checkout/failed')
  }

  // Verify transaction server-side with Flutterwave
  const flwSecretKey = process.env.FLW_SECRET_KEY
  let orderVerified = false
  let orderData: {
    reference: string
    customerName: string
    email: string
    total: number
    status: string
    createdAt: Date
    items: {
      nameSnapshot: string
      labelSnapshot: string
      qty: number
      unitPrice: number
    }[]
  } | null = null

  try {
    if (flwSecretKey) {
      const flwResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
        headers: {
          Authorization: `Bearer ${flwSecretKey}`,
        },
      })

      const flwData = await flwResponse.json()

      if (flwData.status === 'success' && flwData.data) {
        const { data } = flwData
        const flwStatus = data.status
        const flwAmount = data.amount
        const flwCurrency = data.currency
        const flwTxRef = data.tx_ref

        // Find order by reference
        const order = await prisma.order.findUnique({
          where: { reference: flwTxRef },
          include: { items: true },
        })

        if (!order) {
          throw new Error('Order not found')
        }

        // Verify: status === successful, amount >= order.total, currency === NGN, tx_ref matches
        const isAmountMatch = Math.abs(flwAmount * 100 - order.total) < 100 // Allow 1 Naira tolerance
        const isCurrencyMatch = flwCurrency === 'NGN'
        const isStatusMatch = flwStatus === 'successful'
        const isRefMatch = flwTxRef === order.reference

        if (isStatusMatch && isAmountMatch && isCurrencyMatch && isRefMatch) {
          // Update order to PAID if not already
          if (order.status === 'PENDING') {
            await prisma.$transaction(async (tx) => {
              // Update order status
              await tx.order.update({
                where: { id: order.id },
                data: {
                  status: 'PAID',
                  flwTransactionId: transaction_id,
                },
              })

              // Decrement stock for each item
              for (const item of order.items) {
                await tx.productVariant.update({
                  where: { id: item.variantId },
                  data: {
                    stock: {
                      decrement: item.qty,
                    },
                  },
                })
              }
            })
          }

          orderVerified = true
          orderData = {
            reference: order.reference,
            customerName: order.customerName,
            email: order.email,
            total: order.total,
            status: 'PAID',
            createdAt: order.createdAt,
            items: order.items,
          }
        }
      }
    }
  } catch (error) {
    console.error('Transaction verification error:', error)
  }

  if (!orderVerified || !orderData) {
    redirect('/checkout/failed')
  }

  const formatPrice = (amountInKobo: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amountInKobo / 100)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Payment Successful!
          </h1>
          <p className="text-slate-500">
            Thank you for your order. We&apos;ve received your payment and will begin processing shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-6">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Order Details</h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                {orderData.status}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Order Reference</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{orderData.reference}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Customer</span>
                <span className="font-bold text-slate-900">{orderData.customerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-bold text-slate-900">{orderData.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Total Paid</span>
                <span className="font-extrabold text-brand-green text-lg">{formatPrice(orderData.total)}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 sm:p-8 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
              Order Items ({orderData.items.length})
            </h3>
            <div className="space-y-3">
              {orderData.items.map((item, idx) => (
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
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Package size={16} /> What&apos;s Next?
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 font-bold text-xs">1</span>
              <span>You&apos;ll receive an order confirmation email shortly with full details.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 font-bold text-xs">2</span>
              <span>Our team will process your order within 24-48 hours.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 font-bold text-xs">3</span>
              <span>You&apos;ll receive delivery updates via SMS and email.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-white font-bold text-sm transition-all shadow-lg shadow-brand-green/30 flex items-center justify-center gap-2"
          >
            <Home size={18} /> Return to Home
          </Link>
          <Link
            href={`/orders/${orderData.reference}`}
            className="flex-1 py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Package size={18} /> Track Order
          </Link>
        </div>
      </div>
    </div>
  )
}
