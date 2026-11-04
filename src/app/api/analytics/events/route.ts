import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rateLimit'

const eventSchema = z.object({
  event: z.enum(['product_view', 'add_to_cart', 'search', 'checkout_started', 'purchase']),
  productId: z.string().max(128).optional(),
  productSlug: z.string().max(160).optional(),
  queryLength: z.number().int().min(0).max(200).optional(),
}).strict()

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || 'unknown'
  const rateLimit = checkRateLimit(`store-events:${ip}`, 120, 60 * 1000)

  if (!rateLimit.success) {
    return NextResponse.json({ success: false, error: 'Too many events' }, { status: 429 })
  }

  const body = await req.json().catch(() => ({}))
  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: 'Invalid event' }, { status: 400 })
  }

  const { event, productId, productSlug, queryLength } = parsed.data
  const target = productId || productSlug || null

  try {
    await prisma.auditLog.create({
      data: {
        actor: 'storefront',
        action: `analytics.${event}`,
        target,
        metadata: JSON.stringify({
          ...(productId && { productId }),
          ...(productSlug && { productSlug }),
          ...(queryLength !== undefined && { queryLength }),
          createdAt: new Date().toISOString(),
        }),
      },
    })

    return NextResponse.json({ success: true }, { status: 202 })
  } catch (error) {
    console.error('Store analytics event write failed:', error)
    return NextResponse.json({ success: false, error: 'Unable to record event' }, { status: 500 })
  }
}
