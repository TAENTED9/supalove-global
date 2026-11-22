import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import type { Prisma } from '@prisma/client'
import { parseProductSpecs, productSpecsSettingKey, type ProductSpecs } from '@/lib/product-specs'
import { withRetry } from '@/lib/db-read'

export interface CategoryItem {
  id: string
  name: string
  slug: string
  image?: string | null
  description?: string
}

export interface VariantItem {
  id: string
  label: string
  unit: 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE'
  price: number // in kobo
  compareAtPrice?: number | null // original price before discount (in kobo)
  stock: number
  minOrderQty?: number // minimum order quantity
  sku: string
  priceTiers?: PriceTierItem[]
}

export interface PriceTierItem {
  id: string
  minQty: number
  price: number // in kobo
}

export interface ProductItem {
  id: string
  name: string
  slug: string
  description: string
  categoryId: string
  category: { id: string; name: string; slug: string }
  images: string[]
  isActive: boolean
  isFeatured: boolean
  specifications?: ProductSpecs
  variants: VariantItem[]
}

export interface ProductFilterParams {
  category?: string
  unit?: string
  search?: string
  minPrice?: number // in Naira
  maxPrice?: number // in Naira
  inStock?: boolean
  sort?: string // 'price_asc' | 'price_desc' | 'newest' | 'featured'
  page?: number
  limit?: number
}

const publicProductSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  categoryId: true,
  images: true,
  isActive: true,
  isFeatured: true,
  category: {
    select: { id: true, name: true, slug: true },
  },
  variants: {
    orderBy: { price: 'asc' },
    select: {
      id: true,
      label: true,
      unit: true,
      price: true,
      compareAtPrice: true,
      stock: true,
      minOrderQty: true,
      sku: true,
      priceTiers: {
        orderBy: { minQty: 'asc' },
        select: { id: true, minQty: true, price: true },
      },
    },
  },
} satisfies Prisma.ProductSelect

type PublicProductRecord = Prisma.ProductGetPayload<{ select: typeof publicProductSelect }>

function mapProduct(product: PublicProductRecord): ProductItem {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    categoryId: product.categoryId,
    category: product.category,
    images: product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      label: variant.label,
      unit: variant.unit,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      stock: variant.stock,
      minOrderQty: variant.minOrderQty,
      sku: variant.sku,
      priceTiers: variant.priceTiers,
    })),
  }
}

async function fetchCategories(): Promise<CategoryItem[]> {
  const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, image: true },
      orderBy: { name: 'asc' },
    })
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    image: category.image,
  }))
}

const getCachedCategories = unstable_cache(
  () => withRetry(fetchCategories, { retries: 2, delay: 300 }, 'categories.list'),
  ['categories'],
  { tags: ['categories'], revalidate: 60 }
)
export const getCategories = cache(() => getCachedCategories())

async function fetchSettings(): Promise<Record<string, string>> {
  const settings = await prisma.setting.findMany({
    select: { key: true, value: true },
  })

  return Object.fromEntries(settings.map(({ key, value }) => [key, value]))
}

const getCachedSettings = unstable_cache(
  () => withRetry(fetchSettings, { retries: 2, delay: 300 }, 'settings.list'),
  ['settings'],
  { tags: ['settings'], revalidate: 300 }
)
export const getSettings = cache(() => getCachedSettings())

async function fetchFeaturedProducts(): Promise<ProductItem[]> {
  const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        variants: { some: {} },
      },
      select: publicProductSelect,
      take: 8,
    })
  return products.map(mapProduct)
}

const getCachedFeaturedProducts = unstable_cache(
  () => withRetry(fetchFeaturedProducts, { retries: 2, delay: 300 }, 'products.featured'),
  ['featured-products'],
  { tags: ['products'], revalidate: 60 }
)
export const getFeaturedProducts = cache(() => getCachedFeaturedProducts())

async function fetchNewArrivals(): Promise<ProductItem[]> {
  const products = await prisma.product.findMany({
      where: {
        isActive: true,
        variants: { some: {} },
      },
      orderBy: { createdAt: 'desc' },
      select: publicProductSelect,
      take: 5,
    })
  return products.map(mapProduct)
}

const getCachedNewArrivals = unstable_cache(
  () => withRetry(fetchNewArrivals, { retries: 2, delay: 300 }, 'products.new_arrivals'),
  ['new-arrivals'],
  { tags: ['products'], revalidate: 60 }
)
export const getNewArrivals = cache(() => getCachedNewArrivals())

async function fetchSeasonalOffers(): Promise<ProductItem[]> {
  const products = await prisma.product.findMany({
      where: {
        isActive: true,
        variants: {
          some: {
            compareAtPrice: { not: null },
          },
        },
      },
      select: publicProductSelect,
      take: 5,
    })
  return products.map(mapProduct)
}

const getCachedSeasonalOffers = unstable_cache(
  () => withRetry(fetchSeasonalOffers, { retries: 2, delay: 300 }, 'products.seasonal_offers'),
  ['seasonal-offers'],
  { tags: ['products'], revalidate: 60 }
)
export const getSeasonalOffers = cache(() => getCachedSeasonalOffers())

async function fetchProducts(params: ProductFilterParams = {}): Promise<{
  products: ProductItem[]
  total: number
  totalPages: number
  currentPage: number
}> {
  const { category, unit, search, minPrice, maxPrice, inStock, sort, page = 1, limit = 12 } = params

  try {
    // Build Prisma query where clause
    const whereClause: Record<string, unknown> = {
      isActive: true,
      variants: { some: {} },
    }

    if (category) {
      whereClause.category = { slug: category }
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (unit || inStock) {
      whereClause.variants = {
        some: {
          ...(unit ? { unit } : {}),
          ...(inStock ? { stock: { gt: 0 } } : {}),
        },
      }
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where: whereClause }),
      prisma.product.findMany({
        where: whereClause,
        select: publicProductSelect,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    const mapped = products.map(mapProduct)

      // Apply client-side price filter if specified
    let filtered = mapped
    if (minPrice != null) {
      filtered = filtered.filter((p) => p.variants.some((v) => v.price >= minPrice * 100))
    }
    if (maxPrice != null) {
      filtered = filtered.filter((p) => p.variants.some((v) => v.price <= maxPrice * 100))
    }

      // Apply sorting
    if (sort === 'price_asc') {
      filtered.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0))
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0))
    }

    return {
      products: filtered,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
    }
  } catch (error) {
    throw error
  }
}

const getCachedProducts = unstable_cache(
  fetchProducts,
  ['product-list'],
  { tags: ['products'], revalidate: 60 }
)
export const getProducts = cache((params: ProductFilterParams = {}) =>
  withRetry(() => getCachedProducts(params), { retries: 2, delay: 300 }, 'products.list')
)

async function fetchProductBySlug(slug: string): Promise<ProductItem | null> {
  const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      select: publicProductSelect,
    })

  if (!product || product.variants.length === 0) return null

  const settings = await getSettings()
  return {
    ...mapProduct(product),
    specifications: parseProductSpecs(settings[productSpecsSettingKey(product.id)]),
  }
}

export const getProductBySlug = cache((slug: string): Promise<ProductItem | null> => {
  const getCached = unstable_cache(
    () => fetchProductBySlug(slug),
    ['product-detail', slug],
    { tags: ['products', 'settings', `product:${slug}`], revalidate: 60 }
  )
  return withRetry(() => getCached(), { retries: 2, delay: 300 }, 'products.detail')
})

async function fetchRelatedProducts(currentId: string, categoryId: string): Promise<ProductItem[]> {
  const related = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: currentId },
        isActive: true,
        variants: { some: {} },
      },
      select: publicProductSelect,
      take: 4,
    })

  return related.map(mapProduct)
}

const getCachedRelatedProducts = unstable_cache(
  fetchRelatedProducts,
  ['related-products'],
  { tags: ['products'], revalidate: 60 }
)
export const getRelatedProducts = cache((currentId: string, categoryId: string) =>
  withRetry(
    () => getCachedRelatedProducts(currentId, categoryId),
    { retries: 2, delay: 300 },
    'products.related'
  )
)

async function fetchTopProductSlugs(): Promise<string[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return products.map(({ slug }) => slug)
}

const getCachedTopProductSlugs = unstable_cache(
  () => withRetry(fetchTopProductSlugs, { retries: 2, delay: 300 }, 'products.static_params'),
  ['top-product-slugs'],
  { tags: ['products'], revalidate: 60 }
)
export const getTopProductSlugs = cache(() => getCachedTopProductSlugs())
