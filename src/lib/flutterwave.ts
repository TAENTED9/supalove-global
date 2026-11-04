import { prisma } from '@/lib/prisma'
import { siteConfig } from '@/config/site'

export interface FlutterwavePaymentPayload {
  tx_ref: string
  amount: number
  currency: 'NGN'
  redirect_url: string
  customer: {
    email: string
    name: string
    phonenumber: string
  }
  customizations: {
    title: string
    description?: string
    logo: string
  }
  meta?: Record<string, unknown>
}

interface FlutterwaveTransaction {
  id: number | string
  tx_ref: string
  status: string
  amount: number
  currency: string
}

interface FlutterwaveVerifyResponse {
  status: string
  message?: string
  data?: FlutterwaveTransaction
}

export const getFlutterwaveCustomizations = (description?: string) => ({
  title: `${siteConfig.name} Checkout`,
  description: description || siteConfig.tagline,
  logo: `${process.env.NEXT_PUBLIC_APP_URL || siteConfig.siteUrl}/logo-mark.png`,
})

export async function verifyFlutterwaveTransaction(transactionId: string): Promise<FlutterwaveVerifyResponse> {
  const secretKey = process.env.FLW_SECRET_KEY
  if (!secretKey) {
    throw new Error('FLW_SECRET_KEY is not configured')
  }

  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
    cache: 'no-store',
  })

  const result = await response.json() as FlutterwaveVerifyResponse
  if (!response.ok || result.status !== 'success' || !result.data) {
    throw new Error(`Flutterwave transaction verification failed: ${result.message || response.statusText}`)
  }

  return result
}

export async function verifyAndApplyOrderPayment(txRef: string, transactionId: string) {
  const order = await prisma.order.findUnique({
    where: { reference: txRef },
    include: { items: true },
  })

  if (!order) {
    return { verified: false as const, reason: 'Order not found' }
  }

  if (order.status === 'PAID' && order.flwTransactionId === transactionId) {
    return { verified: true as const, order }
  }

  const verification = await verifyFlutterwaveTransaction(transactionId)
  const transaction = verification.data
  const amountInKobo = Number(transaction?.amount) * 100
  const isAmountValid = Number.isSafeInteger(Math.round(amountInKobo)) && Math.round(amountInKobo) === order.total
  const isTransactionIdValid = String(transaction?.id) === transactionId
  const isReferenceValid = transaction?.tx_ref === txRef && txRef === order.reference
  const isCurrencyValid = transaction?.currency === 'NGN'
  const isStatusValid = transaction?.status === 'successful'

  if (!isAmountValid || !isTransactionIdValid || !isReferenceValid || !isCurrencyValid || !isStatusValid) {
    return { verified: false as const, reason: 'Payment details do not match the order' }
  }

  const transactionUsedByAnotherOrder = await prisma.order.findFirst({
    where: {
      flwTransactionId: transactionId,
      NOT: { id: order.id },
    },
    select: { id: true },
  })

  if (transactionUsedByAnotherOrder) {
    return { verified: false as const, reason: 'Transaction has already been applied to another order' }
  }

  const paymentApplied = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: { id: order.id, status: 'PENDING' },
      data: { status: 'PAID', flwTransactionId: transactionId },
    })

    if (updated.count !== 1) {
      const currentOrder = await tx.order.findUnique({
        where: { id: order.id },
        include: { items: true },
      })
      return currentOrder?.status === 'PAID' && currentOrder.flwTransactionId === transactionId
        ? currentOrder
        : null
    }

    for (const item of order.items) {
      const stockUpdated = await tx.productVariant.updateMany({
        where: { id: item.variantId, stock: { gte: item.qty } },
        data: { stock: { decrement: item.qty } },
      })

      if (stockUpdated.count !== 1) {
        throw new Error(`Insufficient stock to fulfill paid order ${order.reference}`)
      }
    }

    return tx.order.findUnique({
      where: { id: order.id },
      include: { items: true },
    })
  })

  if (!paymentApplied) {
    return { verified: false as const, reason: 'Order is no longer pending payment' }
  }

  return { verified: true as const, order: paymentApplied }
}
