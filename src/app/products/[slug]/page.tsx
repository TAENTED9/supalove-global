import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CreditCard, ShieldCheck } from 'lucide-react'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import { ProductCard } from '@/components/products/ProductCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getProductBySlug, getRelatedProducts, getProducts, ALL_PRODUCTS } from '@/lib/data'
import { siteConfig } from '@/config/site'

interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 60

export async function generateStaticParams() {
  return ALL_PRODUCTS.slice(0, 20).map((p) => ({
    slug: p.slug,
  }))
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) {
    return {
      title: `Product Not Found | ${siteConfig.name}`,
    }
  }

  const mainImage = product.images[0]
  const canonicalUrl = new URL(`/products/${product.slug}`, siteConfig.siteUrl).toString()
  const description = product.description || `${product.name} | ${siteConfig.name}`

  return {
    title: `${product.name} | ${siteConfig.name}`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      title: `${product.name} | ${siteConfig.name}`,
      description,
      url: canonicalUrl,
      ...(mainImage && { images: [{ url: mainImage, width: 800, height: 800, alt: product.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${siteConfig.name}`,
      description,
      ...(mainImage && { images: [mainImage] }),
    },
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) {
    notFound()
  }

  const [categoryMatches, catalog] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId),
    getProducts({ page: 1, limit: 8 }),
  ])
  const categoryMatchIds = new Set(categoryMatches.map((item) => item.id))
  const relatedProducts = [
    ...categoryMatches,
    ...catalog.products.filter(
      (item) => item.id !== product.id && !categoryMatchIds.has(item.id)
    ),
  ].slice(0, 5)

  // JSON-LD structured schemas: Product + BreadcrumbList
  const jsonLdProduct = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    url: `${siteConfig.siteUrl}/products/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    category: product.category.name,
    offers: product.variants.map((v) => ({
      '@type': 'Offer',
      price: (v.price / 100).toFixed(2),
      priceCurrency: 'NGN',
      availability: v.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      sku: v.sku,
      itemCondition: 'https://schema.org/NewCondition',
    })),
  }

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${siteConfig.siteUrl}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category.name,
        item: `${siteConfig.siteUrl}/products?category=${product.category.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${siteConfig.siteUrl}/products/${product.slug}`,
      },
    ],
  }

  return (
    <div className="bg-gray-50/50 min-h-screen py-6 lg:py-8">
      {/* JSON-LD Script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [jsonLdProduct, jsonLdBreadcrumb],
          }).replace(/</g, '\\u003c'),
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Main Product Component: Gallery (3) / Buy Box (2) */}
        <ProductDetailClient key={product.id} product={product} />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl bg-white p-4 text-xs font-semibold text-gray-600 shadow-xs">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={18} className="text-brand-green" />
            Secure payment via Flutterwave
          </span>
          <span className="inline-flex items-center gap-2">
            <CreditCard size={18} className="text-brand-green" />
            Card details are handled by the payment provider, not stored by {siteConfig.name}
          </span>
        </div>

        {/* Similar Products Rail */}
        {relatedProducts.length > 0 && (
          <div className="mt-10">
            <SectionHeader
              title="Similar Commodities You May Like"
              href={`/products?category=${product.category.slug}`}
              linkLabel="View category"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
