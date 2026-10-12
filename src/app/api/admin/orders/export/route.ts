import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as { role?: string })?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Generate CSV
    const headers = [
      'Reference',
      'Customer Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'State',
      'Total (NGN)',
      'Status',
      'Created At',
      'Items Count',
    ]

    const rows = orders.map((order) => [
      order.reference,
      order.customerName,
      order.email,
      order.phone,
      order.address,
      order.city,
      order.state,
      (order.total / 100).toFixed(2),
      order.status,
      order.createdAt.toISOString(),
      order.items.length.toString(),
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (err) {
    console.error('Export orders error:', err)
    return NextResponse.json({ success: false, error: 'Failed to export orders' }, { status: 500 })
  }
}
