import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { parseProductSpecs, productSpecsSettingKey, type ProductSpecs } from '@/lib/product-specs'

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

async function fetchCategories(): Promise<CategoryItem[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      image: c.image,
    }))
  } catch (error) {
    console.error('Failed to load categories from the database.', error)
    return []
  }
}

export const getCategories = unstable_cache(
  fetchCategories,
  ['categories'],
  { tags: ['categories'], revalidate: 60 }
)

async function fetchFeaturedProducts(): Promise<ProductItem[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
        variants: { some: {} },
      },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
          include: {
            priceTiers: {
              orderBy: { minQty: 'asc' },
            },
          },
        },
      },
      take: 8,
    })
    return products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        category: p.category,
        images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        variants: p.variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          minOrderQty: v.minOrderQty,
          sku: v.sku,
          priceTiers: v.priceTiers?.map((t) => ({
            id: t.id,
            minQty: t.minQty,
            price: t.price,
          })),
        })),
      }))
  } catch (error) {
    console.error('Failed to load featured products from the database.', error)
    return []
  }
}

export const getFeaturedProducts = unstable_cache(
  fetchFeaturedProducts,
  ['featured-products'],
  { tags: ['products'], revalidate: 60 }
)

async function fetchNewArrivals(): Promise<ProductItem[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        variants: { some: {} },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
          include: {
            priceTiers: {
              orderBy: { minQty: 'asc' },
            },
          },
        },
      },
      take: 5,
    })
    return products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        category: p.category,
        images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        variants: p.variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          minOrderQty: v.minOrderQty,
          sku: v.sku,
          priceTiers: v.priceTiers?.map((t) => ({
            id: t.id,
            minQty: t.minQty,
            price: t.price,
          })),
        })),
      }))
  } catch (error) {
    console.error('Failed to load new arrivals from the database.', error)
    return []
  }
}

export const getNewArrivals = unstable_cache(
  fetchNewArrivals,
  ['new-arrivals'],
  { tags: ['products'], revalidate: 60 }
)

async function fetchSeasonalOffers(): Promise<ProductItem[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        variants: {
          some: {
            compareAtPrice: { not: null },
          },
        },
      },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
          include: {
            priceTiers: {
              orderBy: { minQty: 'asc' },
            },
          },
        },
      },
      take: 5,
    })
    return products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        category: p.category,
        images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        variants: p.variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          minOrderQty: v.minOrderQty,
          sku: v.sku,
          priceTiers: v.priceTiers?.map((t) => ({
            id: t.id,
            minQty: t.minQty,
            price: t.price,
          })),
        })),
      }))
  } catch (error) {
    console.error('Failed to load seasonal offers from the database.', error)
    return []
  }
}

export const getSeasonalOffers = unstable_cache(
  fetchSeasonalOffers,
  ['seasonal-offers'],
  { tags: ['products'], revalidate: 60 }
)

export async function getProducts(params: ProductFilterParams = {}): Promise<{
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
        include: {
          category: true,
          variants: {
            orderBy: { price: 'asc' },
            include: {
              priceTiers: {
                orderBy: { minQty: 'asc' },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ])

    const mapped = products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        category: p.category,
        images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        variants: p.variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          minOrderQty: v.minOrderQty,
          sku: v.sku,
          priceTiers: v.priceTiers?.map((t) => ({
            id: t.id,
            minQty: t.minQty,
            price: t.price,
          })),
        })),
    }))

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
    console.error('Failed to load products from the database.', error)
    return {
      products: [],
      total: 0,
      totalPages: 1,
      currentPage: page,
    }
  }
}

async function fetchProductBySlug(slug: string): Promise<ProductItem | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
          include: {
            priceTiers: {
              orderBy: { minQty: 'asc' },
            },
          },
        },
      },
    })

    if (product) {
      if (product.variants.length === 0) return null

      const specificationRecord = await prisma.setting.findUnique({
        where: { key: productSpecsSettingKey(product.id) },
        select: { value: true },
      })

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        categoryId: product.categoryId,
        category: product.category,
        images: product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        specifications: parseProductSpecs(specificationRecord?.value),
        variants: product.variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          minOrderQty: v.minOrderQty,
          sku: v.sku,
          priceTiers: v.priceTiers?.map((t) => ({
            id: t.id,
            minQty: t.minQty,
            price: t.price,
          })),
        })),
      }
    }
  } catch (error) {
    console.error(`Failed to load product "${slug}" from the database.`, error)
    return null
  }
  return null
}

export async function getProductBySlug(slug: string): Promise<ProductItem | null> {
  const getCached = unstable_cache(
    () => fetchProductBySlug(slug),
    ['product-detail', slug],
    { tags: ['products', `product:${slug}`], revalidate: 60 }
  )
  return getCached()
}

export async function getRelatedProducts(currentId: string, categoryId: string): Promise<ProductItem[]> {
  try {
    const related = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: currentId },
        isActive: true,
        variants: { some: {} },
      },
      include: {
        category: true,
        variants: {
          orderBy: { price: 'asc' },
          include: {
            priceTiers: {
              orderBy: { minQty: 'asc' },
            },
          },
        },
      },
      take: 4,
    })

    return related.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        category: p.category,
        images: p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'],
        isActive: p.isActive,
        isFeatured: p.isFeatured,
        variants: p.variants.map((v) => ({
          id: v.id,
          label: v.label,
          unit: v.unit as 'BAG' | 'KG' | 'LITRE' | 'CARTON' | 'PIECE',
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          minOrderQty: v.minOrderQty,
          sku: v.sku,
          priceTiers: v.priceTiers?.map((t) => ({
            id: t.id,
            minQty: t.minQty,
            price: t.price,
          })),
        })),
    }))
  } catch (error) {
    console.error('Failed to load related products from the database.', error)
    return []
  }
  return []
}
