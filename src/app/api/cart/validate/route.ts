import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ALL_PRODUCTS } from '@/lib/data'

const cartValidateSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      qty: z.number().int().min(1),
    })
  ),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = cartValidateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid cart payload', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const requestedItems = parsed.data.items
    const validatedItems = []
    let subtotal = 0
    let hasStockIssues = false
    const hasPriceChanges = false

    // Attempt DB validation first
    for (const reqItem of requestedItems) {
      let variantData: {
        id: string
        label: string
        price: number
        stock: number
        sku: string
        unit: string
        product: {
          id: string
          name: string
          slug: string
          images: string[]
          isActive: boolean
        }
      } | null = null

      try {
        const found = await prisma.productVariant.findUnique({
          where: { id: reqItem.variantId },
          include: { product: true },
        })
        if (found) {
          variantData = {
            id: found.id,
            label: found.label,
            price: found.price,
            stock: found.stock,
            sku: found.sku,
            unit: found.unit,
            product: {
              id: found.product.id,
              name: found.product.name,
              slug: found.product.slug,
              images: found.product.images,
              isActive: found.product.isActive,
            },
          }
        }
      } catch {
        // Fallback to memory array
      }

      // Memory array fallback lookup
      if (!variantData) {
        for (const p of ALL_PRODUCTS) {
          const v = p.variants.find((vr) => vr.id === reqItem.variantId || vr.sku === reqItem.variantId)
          if (v) {
            variantData = {
              id: v.id,
              label: v.label,
              price: v.price,
              stock: v.stock,
              sku: v.sku,
              unit: v.unit,
              product: {
                id: p.id,
                name: p.name,
                slug: p.slug,
                images: p.images,
                isActive: p.isActive,
              },
            }
            break
          }
        }
      }

      if (!variantData || !variantData.product.isActive) {
        hasStockIssues = true
        continue // Exclude discontinued items
      }

      const availableStock = variantData.stock
      let confirmedQty = reqItem.qty
      if (confirmedQty > availableStock) {
        confirmedQty = Math.max(1, availableStock)
        hasStockIssues = true
      }

      const itemTotal = variantData.price * confirmedQty
      subtotal += itemTotal

      validatedItems.push({
        productId: variantData.product.id,
        variantId: variantData.id,
        name: variantData.product.name,
        slug: variantData.product.slug,
        label: variantData.label,
        price: variantData.price, // verified in kobo
        unit: variantData.unit,
        image: variantData.product.images[0] || null,
        stock: variantData.stock,
        sku: variantData.sku,
        qty: confirmedQty,
        lineTotal: itemTotal,
      })
    }

    return NextResponse.json({
      success: true,
      items: validatedItems,
      subtotal, // in kobo
      totalItems: validatedItems.reduce((acc, i) => acc + i.qty, 0),
      hasStockIssues,
      hasPriceChanges,
    })
  } catch (error) {
    console.error('Cart validation error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error during cart validation' },
      { status: 500 }
    )
  }
}
