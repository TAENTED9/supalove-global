import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rateLimit'

const querySchema = z.object({
  q: z.string().trim().min(2).max(80),
})

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const rateLimit = checkRateLimit(`product-suggestions:${ip}`, 60, 60 * 1000)

  if (!rateLimit.success) {
    return NextResponse.json({ success: false, suggestions: [] }, { status: 429 })
  }

  const parsed = querySchema.safeParse({
    q: new URL(request.url).searchParams.get('q') || '',
  })

  if (!parsed.success) {
    return NextResponse.json({ success: false, suggestions: [] }, { status: 400 })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        variants: { some: {} },
        OR: [
          { name: { contains: parsed.data.q, mode: 'insensitive' } },
          { description: { contains: parsed.data.q, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        category: { select: { name: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { name: 'asc' }],
      take: 6,
    })

    return NextResponse.json({
      success: true,
      suggestions: products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category.name,
      })),
    })
  } catch (error) {
    console.error('Product suggestions could not be loaded:', error)
    return NextResponse.json(
      { success: false, error: 'Product suggestions are temporarily unavailable', suggestions: [] },
      { status: 500 }
    )
  }
}