import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auditAdminAction } from '@/lib/audit'
import { requireAdmin } from '@/lib/security'

const updateOrderSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'PROCESSING', 'DELIVERED', 'CANCELLED']),
})

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.error('Get order error:', err)
    return NextResponse.json({ success: false, error: 'Failed to retrieve order' }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updateOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid status', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { status } = parsed.data

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: { items: true },
    })

    await auditAdminAction('order.status_update', updated.id, {
      status,
      reference: updated.reference,
    }, session.user?.email || 'admin')

    return NextResponse.json({ success: true, order: updated })
  } catch (err) {
    console.error('Update order error:', err)
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 })
  }
}
