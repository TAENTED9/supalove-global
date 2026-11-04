import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/data'
import { siteConfig } from '@/config/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl.replace(/\/+$/, '')
  const publicPaths = [
    '/',
    '/products',
    '/contact',
    '/delivery',
    '/privacy',
    '/refunds',
    '/terms',
  ]
  const firstPage = await getProducts({ page: 1, limit: 100 })
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(firstPage.totalPages - 1, 0) }, (_, index) =>
      getProducts({ page: index + 2, limit: 100 })
    )
  )
  const products = [...firstPage.products, ...remainingPages.flatMap((page) => page.products)]

  return [
    ...publicPaths.map((path) => ({
      url: `${baseUrl}${path}`,
      changeFrequency: path === '/' ? 'daily' as const : 'weekly' as const,
      priority: path === '/' ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/products/${encodeURIComponent(product.slug)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
