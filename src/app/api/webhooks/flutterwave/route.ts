import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

function secureCompare(input: string | null, expected: string | null) {
  if (!input || !expected) return false
  const a = Buffer.from(input)
  const b = Buffer.from(expected)

  if (a.length !== b.length) return false

  try {
    return crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function POST(req: Request) {
  try {
    const headersList = headers()
    const verifHash = headersList.get('verif-hash')
    const flwSecretHash = process.env.FLW_SECRET_HASH

    if (!flwSecretHash || !secureCompare(verifHash || '', flwSecretHash)) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 500 })
    }

    const body = await req.json()
    const { event, data } = body

    if (event !== 'charge.completed' && event !== 'transaction.completed') {
      return NextResponse.json({ success: true, message: 'Event ignored' })
    }

    const txRef = data?.tx_ref
    const transactionId = data?.id
    const flwAmount = Number(data?.amount)
    const flwCurrency = data?.currency
    const flwStatus = data?.status

    if (!txRef || !transactionId || !Number.isFinite(flwAmount) || !flwCurrency) {
      return NextResponse.json({ success: false, error: 'Missing payment data' }, { status: 500 })
    }

    const order = await prisma.order.findUnique({
      where: { reference: txRef },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 500 })
    }

    if (order.status === 'PAID') {
      return NextResponse.json({ success: true, message: 'Order already paid' })
    }

    const flwSecretKey = process.env.FLW_SECRET_KEY
    if (!flwSecretKey) {
      return NextResponse.json({ success: false, error: 'Payment verification unavailable' }, { status: 500 })
    }

    const verifyResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${flwSecretKey}`,
      },
    })

    const verifyData = await verifyResponse.json()
    const verifiedTx = verifyData?.data

    const isStatusValid = verifiedTx?.status === 'successful' && flwStatus === 'successful'
    const isAmountValid = Number(verifiedTx?.amount) * 100 === Number(order.total)
    const isCurrencyValid = verifiedTx?.currency === 'NGN' && flwCurrency === 'NGN'
    const isReferenceValid = verifiedTx?.tx_ref === txRef

    if (!verifyResponse.ok || !isStatusValid || !isAmountValid || !isCurrencyValid || !isReferenceValid) {
      return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 500 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          flwTransactionId: transactionId,
        },
      })

      for (const item of order.items) {
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } })
        if (!variant) continue

        if (variant.stock < item.qty) {
          throw new Error('Insufficient stock for payment completion')
        }

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

    return NextResponse.json({ success: true, message: 'Order updated' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 })
  }
}
