import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/data'
import { checkRateLimit } from '@/lib/rateLimit'

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const rateLimit = checkRateLimit(`store-categories:${ip}`, 60, 60 * 1000)

  if (!rateLimit.success) {
    return NextResponse.json({ success: false, categories: [] }, { status: 429 })
  }

  try {
    const categories = await getCategories()
    return NextResponse.json({
      success: true,
      categories: categories.map(({ name, slug }) => ({ name, slug })),
    })
  } catch {
    return NextResponse.json({ success: false, categories: [] }, { status: 500 })
  }
}