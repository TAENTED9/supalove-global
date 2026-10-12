import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import type { ProductItem } from '@/lib/data'

interface FeaturedSectionProps {
  products: ProductItem[]
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  return (
    <section className="py-14 sm:py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Campify layout style) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange mb-1">
              <Sparkles size={14} />
              Featured Commodities
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Best Sellers &amp; Staple Foodstuffs
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Freshly harvested, cleaned, and stone-free. Select your preferred bag size, kg portion, or oil volume.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-green hover:text-brand-green-hover transition-colors group shrink-0"
          >
            <span>View All Products</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-8 py-3.5 rounded-xl transition-all shadow-sm text-sm"
          >
            Browse Complete Foodstuff Catalog ({products.length * 2}+ items) &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
export default FeaturedSection
