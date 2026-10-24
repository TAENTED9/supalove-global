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
        minOrderQty: number
        sku: string
        unit: string
        priceTiers: { id?: string; minQty: number; price: number }[]
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
          include: {
            product: true,
            priceTiers: {
              orderBy: { minQty: 'desc' },
            },
          },
        })
        if (found) {
          variantData = {
            id: found.id,
            label: found.label,
            price: found.price,
            stock: found.stock,
            minOrderQty: found.minOrderQty || 1,
            sku: found.sku,
            unit: found.unit,
            priceTiers: found.priceTiers || [],
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
              minOrderQty: v.minOrderQty || 1,
              sku: v.sku,
              unit: v.unit,
              priceTiers: v.priceTiers ? [...v.priceTiers].sort((a, b) => b.minQty - a.minQty) : [],
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

      // Enforce minimum order quantity
      const minOrder = variantData.minOrderQty || 1
      if (confirmedQty < minOrder) {
        confirmedQty = minOrder
      }

      if (confirmedQty > availableStock) {
        confirmedQty = Math.max(1, availableStock)
        hasStockIssues = true
      }

      // Tier pricing: find highest tier where confirmedQty >= minQty
      let activeUnitPrice = variantData.price
      if (variantData.priceTiers && variantData.priceTiers.length > 0) {
        const matchingTier = variantData.priceTiers.find((t) => confirmedQty >= t.minQty)
        if (matchingTier) {
          activeUnitPrice = matchingTier.price
        }
      }

      const itemTotal = activeUnitPrice * confirmedQty
      subtotal += itemTotal

      validatedItems.push({
        productId: variantData.product.id,
        variantId: variantData.id,
        name: variantData.product.name,
        slug: variantData.product.slug,
        label: variantData.label,
        price: activeUnitPrice, // verified unit price in kobo with tiers applied
        unit: variantData.unit,
        image: variantData.product.images[0] || null,
        stock: variantData.stock,
        minOrderQty: minOrder,
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
