import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, ArrowLeft, PackageCheck } from 'lucide-react'
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
    <div className="bg-slate-50/40 min-h-screen py-8 sm:py-12">
      {/* JSON-LD Script tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-slate-800 transition-colors">
              Home
            </Link>
            <ChevronRight size={13} />
            <Link href="/products" className="hover:text-slate-800 transition-colors">
              Products
            </Link>
            <ChevronRight size={13} />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-brand-green transition-colors capitalize"
            >
              {product.category.name}
            </Link>
            <ChevronRight size={13} />
            <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-green transition-colors"
          >
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
        </div>

        {/* Main Product Interactive Block */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
          <ProductDetailClient product={product} />

          {/* Product Specifications & Logistics Grid */}
          <div className="mt-14 pt-10 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PackageCheck size={16} className="text-brand-green" />
                Origin &amp; Farm Aggregation
              </h4>
              <p className="leading-relaxed">
                Directly harvested from certified smallholder farmer cooperatives across Nigeria. Sorted and cleaned to export purity levels.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PackageCheck size={16} className="text-brand-orange" />
                Storage &amp; Shelf Life
              </h4>
              <p className="leading-relaxed">
                Packaged in food-grade, moisture-resistant hermetic sacks or drums. Store in a cool, dry place. Minimum shelf life: 12-24 months.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <PackageCheck size={16} className="text-emerald-600" />
                Export &amp; Regulatory Certs
              </h4>
              <p className="leading-relaxed">
                Full documentation available upon request: Federal Ministry of Agriculture Phyto-Sanitary Certificate, fumigation, and certificate of origin.
              </p>
            </div>
          </div>
        </div>

        {/* Related Foodstuffs Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
                  Complementary Foodstuffs
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  You May Also Need
                </h3>
              </div>
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs font-bold text-brand-green hover:underline"
              >
                View Category &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
