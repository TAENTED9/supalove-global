import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().optional(),
  image: z.string().nullable().optional(),
})

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateCategorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const dataToUpdate: Record<string, unknown> = {}
    if (parsed.data.name) {
      dataToUpdate.name = parsed.data.name
    }
    if (parsed.data.slug) {
      dataToUpdate.slug = slugify(parsed.data.slug)
    }
    if (parsed.data.image !== undefined) {
      dataToUpdate.image = parsed.data.image
    }

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: dataToUpdate,
    })

    return NextResponse.json({ success: true, category: updated })
  } catch (err) {
    console.error('Update category error:', err)
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: params.id },
    })

    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category because it contains ${productCount} products. Move or delete products first.`,
        },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true, message: 'Category deleted' })
  } catch (err) {
    console.error('Delete category error:', err)
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 })
  }
}
