import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().optional(),
  image: z.string().nullable().optional(),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ success: true, categories })
  } catch (err) {
    console.error('Fetch categories error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = categorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { name, image } = parsed.data
    const slug = parsed.data.slug?.trim() ? slugify(parsed.data.slug) : slugify(name)

    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A category with this slug already exists' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: image || null,
      },
    })

    return NextResponse.json({ success: true, category }, { status: 201 })
  } catch (err) {
    console.error('Create category error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}
