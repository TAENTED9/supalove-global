import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import { ProductCard } from '@/components/products/ProductCard'
import { getProductBySlug, getRelatedProducts, ALL_PRODUCTS } from '@/lib/data'

interface ProductDetailPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return ALL_PRODUCTS.map((p) => ({
    slug: p.slug,
  }))
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return {
      title: 'Product Not Found | Supalovefoods',
    }
  }

  const mainImage = product.images[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80'

  return {
    title: `${product.name} | Supalovefoods`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Supalovefoods`,
      description: product.description,
      images: [{ url: mainImage, width: 800, height: 800, alt: product.name }],
    },
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductBySlug(params.slug)
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId)

  // JSON-LD structured schema for rich Google search cards
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-4">
        {/* Main Product Interactive Block */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
          <ProductDetailClient product={product} />
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
