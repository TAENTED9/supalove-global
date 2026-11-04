import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyAndApplyOrderPayment } from '@/lib/flutterwave'

function secureCompare(input: string | null, expected: string | undefined) {
  if (!input || !expected) return false
  const provided = Buffer.from(input)
  const configured = Buffer.from(expected)

  return provided.length === configured.length && crypto.timingSafeEqual(provided, configured)
}

const webhookSchema = z.object({
  event: z.string(),
  data: z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tx_ref: z.string().optional(),
    status: z.string().optional(),
  }).passthrough(),
})

export async function POST(req: Request) {
  const secretHash = process.env.FLW_SECRET_HASH
  if (!secureCompare(req.headers.get('verif-hash'), secretHash)) {
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid webhook payload' }, { status: 400 })
  }

  const parsed = webhookSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid webhook payload' }, { status: 400 })
  }

  const { event, data } = parsed.data
  if (event !== 'charge.completed') {
    return NextResponse.json({ success: true, message: 'Event ignored' })
  }

  if (data.status !== 'successful') {
    return NextResponse.json({ success: true, message: 'Unsuccessful payment ignored' })
  }

  const txRef = data.tx_ref
  const transactionId = String(data.id ?? '')
  if (!txRef || !/^\d+$/.test(transactionId)) {
    return NextResponse.json({ success: false, error: 'Missing payment identifiers' }, { status: 400 })
  }

  try {
    const result = await verifyAndApplyOrderPayment(txRef, transactionId)
    if (!result.verified) {
      return NextResponse.json({ success: false, error: result.reason }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Payment processed' })
  } catch (error) {
    console.error('Flutterwave webhook processing failed:', error)
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 })
  }
}
