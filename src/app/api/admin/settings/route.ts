import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auditAdminAction } from '@/lib/audit'
import { requireAdmin } from '@/lib/security'
import { checkRateLimit } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const settingKeys = {
  deliveryFeeLagos: 'delivery_fee_lagos',
  deliveryFeeOther: 'delivery_fee_other',
  deliveryFeeDefault: 'delivery_fee_default',
} as const

const defaults = {
  deliveryFeeLagos: 150000,
  deliveryFeeOther: 350000,
  deliveryFeeDefault: 350000,
}

const settingsSchema = z.object({
  deliveryFeeLagos: z.number().int().min(0).max(100_000_000),
  deliveryFeeOther: z.number().int().min(0).max(100_000_000),
  deliveryFeeDefault: z.number().int().min(0).max(100_000_000),
})

function getStoredFee(value: string | undefined, fallback: number, key: string) {
  if (value === undefined) return fallback
  const parsed = Number(value)
  if (Number.isSafeInteger(parsed) && parsed >= 0) return parsed
  console.error(`Invalid persisted delivery fee setting: ${key}`)
  return fallback
}

export async function GET() {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const records = await prisma.setting.findMany({
      where: { key: { in: Object.values(settingKeys) } },
    })
    const values = new Map(records.map((record) => [record.key, record.value]))
    const settings = {
      deliveryFeeLagos: getStoredFee(
        values.get(settingKeys.deliveryFeeLagos),
        defaults.deliveryFeeLagos,
        settingKeys.deliveryFeeLagos
      ),
      deliveryFeeOther: getStoredFee(
        values.get(settingKeys.deliveryFeeOther),
        defaults.deliveryFeeOther,
        settingKeys.deliveryFeeOther
      ),
      deliveryFeeDefault: getStoredFee(
        values.get(settingKeys.deliveryFeeDefault),
        defaults.deliveryFeeDefault,
        settingKeys.deliveryFeeDefault
      ),
    }

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Fetch store settings error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch store settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const actor = session.user?.email || 'admin'
    const rateLimit = checkRateLimit(`admin-settings:${actor}`, 20, 60 * 1000)
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many settings updates. Please try again shortly.' },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const parsed = settingsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid delivery fees', details: parsed.error.format() },
        { status: 400 }
      )
    }

    await prisma.$transaction(
      Object.entries(settingKeys).map(([field, key]) =>
        prisma.setting.upsert({
          where: { key },
          create: { key, value: String(parsed.data[field as keyof typeof settingKeys]) },
          update: { value: String(parsed.data[field as keyof typeof settingKeys]) },
        })
      )
    )

    await auditAdminAction('settings.delivery_fees_update', 'delivery-fees', parsed.data, actor)
    return NextResponse.json({ success: true, settings: parsed.data })
  } catch (error) {
    console.error('Update store settings error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update store settings' }, { status: 500 })
  }
}
