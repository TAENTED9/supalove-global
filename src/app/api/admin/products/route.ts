import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auditAdminAction } from '@/lib/audit'
import { requireAdmin } from '@/lib/security'
import { slugify } from '@/lib/utils'

const variantSchema = z.object({
  id: z.string().max(128).optional(),
  label: z.string().min(1, 'Variant label required').max(120),
  unit: z.enum(['BAG', 'KG', 'LITRE', 'CARTON', 'PIECE']),
  price: z.number().min(0, 'Price must be positive').max(100000000),
  stock: z.number().int().min(0, 'Stock cannot be negative').max(500000),
  sku: z.string().min(1, 'SKU required').max(80),
})

const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(160),
  slug: z.string().max(160).optional(),
  description: z.string().min(5, 'Description required').max(5000),
  categoryId: z.string().min(1, 'Category is required').max(128),
  images: z.array(z.string().max(512)).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  variants: z.array(variantSchema).min(1, 'At least one variant is required').max(20),
})

export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
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
    const session = await requireAdmin()
    if (!session) {
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
            price: Math.round(v.price),
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

    await auditAdminAction('product.create', newProduct?.id || slug, {
      slug,
      categoryId,
      variantCount: variants.length,
    }, session.user?.email || 'admin')

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 })
  } catch (err) {
    console.error('Create product error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}
