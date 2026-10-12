import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

const updateVariantSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  unit: z.enum(['BAG', 'KG', 'LITRE', 'CARTON', 'PIECE']),
  price: z.number().min(0),
  stock: z.number().int().min(0),
  sku: z.string().min(1),
})

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  description: z.string().min(5).optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  variants: z.array(updateVariantSchema).optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true, variants: true },
    })

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, product })
  } catch (err) {
    console.error('Get product error:', err)
    return NextResponse.json({ success: false, error: 'Failed to retrieve product' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateProductSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { name, slug, description, categoryId, images, isActive, isFeatured, variants } = parsed.data

    const updated = await prisma.$transaction(async (tx) => {
      const updateData: Record<string, unknown> = {}
      if (name) updateData.name = name
      if (slug) updateData.slug = slugify(slug)
      if (description) updateData.description = description
      if (categoryId) updateData.categoryId = categoryId
      if (images !== undefined) updateData.images = images
      if (isActive !== undefined) updateData.isActive = isActive
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured

      const prod = await tx.product.update({
        where: { id: params.id },
        data: updateData,
      })

      // If variants are provided, update/upsert
      if (variants && variants.length > 0) {
        // Collect existing variant IDs
        const existingVariants = await tx.productVariant.findMany({
          where: { productId: params.id },
        })
        const incomingIds = variants.map((v) => v.id).filter(Boolean) as string[]

        // Delete removed variants
        const toDelete = existingVariants.filter((ev) => !incomingIds.includes(ev.id))
        for (const dv of toDelete) {
          await tx.productVariant.delete({ where: { id: dv.id } })
        }

        // Upsert or create
        for (const v of variants) {
          if (v.id) {
            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                label: v.label,
                unit: v.unit,
                price: Math.round(v.price),
                stock: v.stock,
                sku: v.sku.trim().toUpperCase(),
              },
            })
          } else {
            await tx.productVariant.create({
              data: {
                productId: params.id,
                label: v.label,
                unit: v.unit,
                price: Math.round(v.price),
                stock: v.stock,
                sku: v.sku.trim().toUpperCase(),
              },
            })
          }
        }
      }

      return tx.product.findUnique({
        where: { id: prod.id },
        include: { category: true, variants: true },
      })
    })

    return NextResponse.json({ success: true, product: updated })
  } catch (err) {
    console.error('Update product error:', err)
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    console.error('Delete product error:', err)
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 })
  }
}
