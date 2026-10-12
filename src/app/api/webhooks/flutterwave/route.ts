import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const headersList = headers()
    const verifHash = headersList.get('verif-hash')
    const flwSecretHash = process.env.FLW_SECRET_HASH

    // Validate webhook signature
    if (!flwSecretHash || verifHash !== flwSecretHash) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 })
    }

    const body = await req.json()
    const { event, data } = body

    // Only handle payment completion events
    if (event !== 'charge.completed' && event !== 'transaction.completed') {
      return NextResponse.json({ success: true, message: 'Event ignored' })
    }

    const txRef = data.tx_ref
    const flwStatus = data.status
    const flwAmount = data.amount
    const flwCurrency = data.currency
    const transactionId = data.id

    if (!txRef) {
      return NextResponse.json({ success: false, error: 'Missing tx_ref' }, { status: 400 })
    }

    // Find order by reference
    const order = await prisma.order.findUnique({
      where: { reference: txRef },
      include: { items: true },
    })

    if (!order) {
      console.error('Order not found for tx_ref:', txRef)
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    // If already PAID, return success (idempotent)
    if (order.status === 'PAID') {
      return NextResponse.json({ success: true, message: 'Order already paid' })
    }

    // Verify payment details
    const isAmountMatch = Math.abs(flwAmount * 100 - order.total) < 100 // Allow 1 Naira tolerance
    const isCurrencyMatch = flwCurrency === 'NGN'
    const isStatusMatch = flwStatus === 'successful'

    if (isStatusMatch && isAmountMatch && isCurrencyMatch) {
      // Update order to PAID and decrement stock
      await prisma.$transaction(async (tx) => {
        // Update order status
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            flwTransactionId: transactionId,
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

      console.log(`Order ${order.reference} marked as PAID via webhook`)

      // TODO: Send confirmation email via Resend
      // await sendOrderConfirmationEmail(order.customerEmail, order.reference)

      return NextResponse.json({ success: true, message: 'Order updated' })
    } else {
      console.error('Payment verification failed for order:', order.reference, {
        status: flwStatus,
        amount: flwAmount,
        currency: flwCurrency,
      })
      return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 })
    }
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 })
  }
}
