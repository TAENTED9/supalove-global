import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateReference } from '@/lib/utils'
import { checkRateLimit, getIdempotencyRecord, setIdempotencyRecord } from '@/lib/rateLimit'
import { siteConfig } from '@/config/site'

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Name is required').max(120),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().min(10, 'Phone number is required').max(30),
  address: z.string().min(5, 'Address is required').max(500),
  city: z.string().min(2, 'City is required').max(80),
  state: z.string().min(2, 'State is required').max(80),
  idempotencyKey: z.string().min(8).max(128).optional(),
  items: z.array(
    z.object({
      productId: z.string().max(128),
      variantId: z.string().max(128),
      qty: z.number().int().min(1).max(50),
    })
  ).min(1, 'Cart cannot be empty').max(50),
})

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const rateLimit = checkRateLimit(`checkout:${ip}`, 5, 15 * 60 * 1000)

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many checkout attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => ({}))
    const parsed = checkoutSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { customerName, email, phone, address, city, state, items, idempotencyKey } = parsed.data
    const activeKey = idempotencyKey || req.headers.get('x-idempotency-key') || undefined

    if (activeKey) {
      const duplicate = getIdempotencyRecord(activeKey)
      if (duplicate) {
        return NextResponse.json({ success: true, paymentUrl: duplicate.paymentUrl, txRef: duplicate.reference, duplicate: true })
      }
    }

    const flwSecretKey = process.env.FLW_SECRET_KEY
    const flwPublicKey = process.env.FLW_PUBLIC_KEY
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    if (!flwSecretKey || !flwPublicKey) {
      return NextResponse.json(
        { success: false, error: 'Payment system not configured' },
        { status: 500 }
      )
    }

    let subtotal = 0
    const orderItems: {
      productId: string
      variantId: string
      nameSnapshot: string
      labelSnapshot: string
      unitPrice: number
      qty: number
    }[] = []

    for (const item of items) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: item.variantId },
        include: {
          product: true,
          priceTiers: {
            orderBy: { minQty: 'desc' },
          },
        },
      })

      if (!variant || !variant.product.isActive) {
        return NextResponse.json(
          { success: false, error: 'Unable to continue with checkout.' },
          { status: 400 }
        )
      }

      const maxAllowedQty = Math.min(variant.stock, 50)
      if (item.qty > maxAllowedQty) {
        return NextResponse.json(
          { success: false, error: `Quantity exceeds available stock for ${variant.product.name}.` },
          { status: 400 }
        )
      }

      const minOrder = variant.minOrderQty || 1
      if (item.qty < minOrder) {
        return NextResponse.json(
          { success: false, error: `Minimum order quantity for ${variant.product.name} (${variant.label}) is ${minOrder}.` },
          { status: 400 }
        )
      }

      let unitPrice = variant.price
      if (variant.priceTiers && variant.priceTiers.length > 0) {
        const matchingTier = variant.priceTiers.find((t) => item.qty >= t.minQty)
        if (matchingTier) {
          unitPrice = matchingTier.price
        }
      }

      const lineTotal = unitPrice * item.qty
      subtotal += lineTotal

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        nameSnapshot: variant.product.name,
        labelSnapshot: variant.label,
        unitPrice,
        qty: item.qty,
      })
    }

    const isLagos = state.trim().toLowerCase() === 'lagos'
    const settingKey = isLagos ? 'delivery_fee_lagos' : 'delivery_fee_other'
    const deliveryFeeSetting = (await prisma.setting.findUnique({ where: { key: settingKey } })) || (await prisma.setting.findUnique({ where: { key: 'delivery_fee_default' } }))
    const defaultFee = isLagos ? 150000 : 350000
    const deliveryFee = deliveryFeeSetting ? Number.parseInt(deliveryFeeSetting.value, 10) : defaultFee
    const total = subtotal + deliveryFee

    const txRef = generateReference()
    const order = await prisma.order.create({
      data: {
        reference: txRef,
        customerName,
        email,
        phone,
        address,
        city,
        state,
        subtotal,
        deliveryFee,
        total,
        status: 'PENDING',
        items: {
          create: orderItems,
        },
      },
    })

    const flwResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${flwSecretKey}`,
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: total / 100,
        currency: 'NGN',
        redirect_url: `${appUrl}/checkout/success`,
        customer: {
          email,
          name: customerName,
          phonenumber: phone,
        },
        customizations: {
          title: `${siteConfig.name} Order`,
          description: `${orderItems.length} items - ₦${(total / 100).toLocaleString()}`,
          logo: `${siteConfig.siteUrl}/logo-mark.png`,
        },
        meta: {
          order_id: order.id,
          customer_email: email,
        },
      }),
    })

    const flwData = await flwResponse.json()

    if (!flwResponse.ok || flwData.status !== 'success') {
      console.error('Flutterwave error:', flwData)
      return NextResponse.json(
        { success: false, error: 'Failed to initialize payment' },
        { status: 500 }
      )
    }

    if (activeKey) {
      setIdempotencyRecord(activeKey, txRef, flwData.data.link)
    }

    return NextResponse.json({
      success: true,
      paymentUrl: flwData.data.link,
      txRef,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { success: false, error: 'Checkout failed. Please try again.' },
      { status: 500 }
    )
  }
}
