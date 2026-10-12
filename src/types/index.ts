export type { Product, ProductVariant, Category, Order, OrderItem, Setting, User } from '@prisma/client'

export type ProductWithVariants = {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  category: { id: string; name: string; slug: string }
  images: string[]
  isActive: boolean
  isFeatured: boolean
  createdAt: Date
  variants: {
    id: string
    label: string
    unit: string
    price: number
    stock: number
    sku: string
  }[]
}

export type CartValidatedItem = {
  productId: string
  variantId: string
  qty: number
  name: string
  label: string
  price: number
  image: string | null
  stock: number
  sku: string
  slug: string
}
