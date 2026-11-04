import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import { ProductCard } from '@/components/products/ProductCard'
import { getProductBySlug, getRelatedProducts, getProducts, ALL_PRODUCTS } from '@/lib/data'
import { siteConfig } from '@/config/site'

interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({
    slug: p.slug,
  }))
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) {
    return {
      title: 'Product Not Found | Supalovefoods',
    }
  }

  const mainImage = product.images[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'
  const canonicalUrl = new URL(`/products/${product.slug}`, siteConfig.siteUrl).toString()

  return {
    title: `${product.name} | Supalovefoods`,
    description: product.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      title: `${product.name} | Supalovefoods`,
      description: product.description,
      images: [{ url: mainImage, width: 800, height: 800, alt: product.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | Supalovefoods`,
      description: product.description,
      images: [mainImage],
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
  ].slice(0, 4)

  // JSON-LD structured schema for rich Google search cards
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    url: new URL(`/products/${product.slug}`, siteConfig.siteUrl).toString(),
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

  return (
    <div className="bg-slate-50/40 min-h-screen py-6">
      {/* JSON-LD Script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <div className="max-w-5xl mx-auto px-4">
        {/* Main Product Interactive Block */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <ProductDetailClient key={product.id} product={product} />
        </div>

        {/* Similar Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">
              Similar products
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
