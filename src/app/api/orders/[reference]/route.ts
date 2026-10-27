import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const lookupSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
})

export async function POST(
  req: Request,
  { params }: { params: { reference: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const parsed = lookupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Unable to look up order.' },
        { status: 404 }
      )
    }

    const { email } = parsed.data
    const { reference } = params

    const order = await prisma.order.findUnique({
      where: { reference },
      include: { items: true },
    })

    if (!order || order.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Unable to look up order.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order: {
        reference: order.reference,
        customerName: order.customerName,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city,
        state: order.state,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          nameSnapshot: item.nameSnapshot,
          labelSnapshot: item.labelSnapshot,
          qty: item.qty,
          unitPrice: item.unitPrice,
        })),
      },
    })
  } catch (error) {
    console.error('Order lookup error:', error)
    return NextResponse.json(
      { success: false, error: 'Unable to look up order.' },
      { status: 404 }
    )
  }
}
