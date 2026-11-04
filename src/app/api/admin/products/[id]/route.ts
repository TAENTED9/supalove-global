import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auditAdminAction } from '@/lib/audit'
import { requireAdmin } from '@/lib/security'
import { slugify } from '@/lib/utils'
import { parseProductSpecs, productSpecsSettingKey } from '@/lib/product-specs'

const productSpecsSchema = z.object({
  origin: z.string().max(300),
  packaging: z.string().max(300),
  shelfLife: z.string().max(300),
  storage: z.string().max(300),
})

const updateVariantSchema = z.object({
  id: z.string().max(128).optional(),
  label: z.string().min(1).max(120),
  unit: z.enum(['BAG', 'KG', 'LITRE', 'CARTON', 'PIECE']),
  price: z.number().min(0).max(100000000),
  compareAtPrice: z.number().min(0).max(100000000).nullable().optional(),
  stock: z.number().int().min(0).max(500000),
  minOrderQty: z.number().int().min(1).max(500000).optional(),
  sku: z.string().min(1).max(80),
})

const updateProductSchema = z.object({
  name: z.string().min(2).max(160).optional(),
  slug: z.string().max(160).optional(),
  description: z.string().min(5).max(5000).optional(),
  categoryId: z.string().max(128).optional(),
  images: z.array(z.string().max(512)).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  specifications: productSpecsSchema.optional(),
  variants: z.array(updateVariantSchema).max(20).optional(),
})

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, variants: true },
    })

    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    }

    const specifications = await prisma.setting.findUnique({
      where: { key: productSpecsSettingKey(id) },
      select: { value: true },
    })

    return NextResponse.json({
      success: true,
      product: { ...product, specifications: parseProductSpecs(specifications?.value) },
    })
  } catch (err) {
    console.error('Get product error:', err)
    return NextResponse.json({ success: false, error: 'Failed to retrieve product' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await requireAdmin()
    if (!session) {
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

    const { name, slug, description, categoryId, images, isActive, isFeatured, specifications, variants } = parsed.data

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
        where: { id },
        data: updateData,
      })

      if (specifications !== undefined) {
        const key = productSpecsSettingKey(id)
        if (Object.values(specifications).some((value) => value.trim())) {
          await tx.setting.upsert({
            where: { key },
            create: { key, value: JSON.stringify(specifications) },
            update: { value: JSON.stringify(specifications) },
          })
        } else {
          await tx.setting.deleteMany({ where: { key } })
        }
      }

      // If variants are provided, update/upsert
      if (variants && variants.length > 0) {
        // Collect existing variant IDs
        const existingVariants = await tx.productVariant.findMany({
          where: { productId: id },
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
                compareAtPrice: v.compareAtPrice ?? null,
                stock: v.stock,
                minOrderQty: v.minOrderQty ?? 1,
                sku: v.sku.trim().toUpperCase(),
              },
            })
          } else {
            await tx.productVariant.create({
              data: {
                productId: id,
                label: v.label,
                unit: v.unit,
                price: Math.round(v.price),
                compareAtPrice: v.compareAtPrice ?? null,
                stock: v.stock,
                minOrderQty: v.minOrderQty ?? 1,
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

    await auditAdminAction('product.update', id, {
      changes: {
        name,
        slug,
        description,
        categoryId,
        isActive,
        isFeatured,
        specificationsUpdated: specifications !== undefined,
        variantsCount: variants?.length || 0,
      },
    }, session.user?.email || 'admin')

    revalidateTag('products')
    return NextResponse.json({ success: true, product: updated })
  } catch (err) {
    console.error('Update product error:', err)
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.$transaction([
      prisma.product.delete({ where: { id } }),
      prisma.setting.deleteMany({ where: { key: productSpecsSettingKey(id) } }),
    ])

    await auditAdminAction('product.delete', id, {}, session.user?.email || 'admin')

    revalidateTag('products')
    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (err) {
    console.error('Delete product error:', err)
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 })
  }
}
