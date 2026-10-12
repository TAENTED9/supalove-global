import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

const variantSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, 'Variant label required'),
  unit: z.enum(['BAG', 'KG', 'LITRE', 'CARTON', 'PIECE']),
  price: z.number().min(0, 'Price must be positive'), // expects in kobo
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  sku: z.string().min(1, 'SKU required'),
})

const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().optional(),
  description: z.string().min(5, 'Description required'),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  variants: z.array(variantSchema).min(1, 'At least one variant is required'),
})

export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, products })
  } catch (err) {
    console.error('Admin list products error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { name, description, categoryId, images, isActive, isFeatured, variants } = parsed.data
    const slug = parsed.data.slug?.trim() ? slugify(parsed.data.slug) : slugify(name)

    const existingSlug = await prisma.product.findUnique({ where: { slug } })
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: 'A product with this slug already exists. Please choose a unique name or slug.' },
        { status: 400 }
      )
    }

    const newProduct = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name,
          slug,
          description,
          categoryId,
          images,
          isActive,
          isFeatured,
        },
      })

      for (const v of variants) {
        await tx.productVariant.create({
          data: {
            productId: product.id,
            label: v.label,
            unit: v.unit,
            price: Math.round(v.price), // in kobo
            stock: v.stock,
            sku: v.sku.trim().toUpperCase(),
          },
        })
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: { category: true, variants: true },
      })
    })

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
  } catch (err) {
    console.error('Create product error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}
