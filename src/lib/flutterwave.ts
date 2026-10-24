import { siteConfig } from '@/config/site'

export interface FlutterwavePaymentPayload {
  tx_ref: string
  amount: number
  currency: string
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

export const getFlutterwaveCustomizations = (description?: string) => ({
  title: `${siteConfig.name} Checkout`,
  description: description || siteConfig.tagline,
  logo: `${process.env.NEXT_PUBLIC_APP_URL || siteConfig.siteUrl}/logo-mark.png`,
})

export async function verifyFlutterwaveTransaction(transactionId: string) {
  const secretKey = process.env.FLW_SECRET_KEY
  if (!secretKey) {
    throw new Error('FLW_SECRET_KEY is not configured')
  }

  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secretKey}`,
    },
    cache: 'no-store',
  })

  return response.json()
}
