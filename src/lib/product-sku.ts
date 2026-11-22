import { randomBytes } from 'node:crypto'
import type { Prisma } from '@prisma/client'

export async function generateUniqueProductSku(tx: Prisma.TransactionClient): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const sku = `SLF-${randomBytes(8).toString('hex').toUpperCase()}`
    const existing = await tx.productVariant.findUnique({
      where: { sku },
      select: { id: true },
    })

    if (!existing) return sku
  }

  throw new Error('Unable to generate a unique product SKU')
}
