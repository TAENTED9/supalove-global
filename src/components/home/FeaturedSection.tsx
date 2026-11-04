import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProductCard } from '@/components/products/ProductCard'
import type { ProductItem } from '@/lib/data'

interface FeaturedSectionProps {
  products: ProductItem[]
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  if (!products.length) return null

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        <SectionHeader
          title="Featured &amp; Best Sellers"
          href="/products?sort=featured"
        />

        {/* Grid: 2 → 3 → 4 → 5 cols */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={i < 2} /* LCP priority for first 2 cards */
            />
          ))}
        </div>
      </div>
    </section>
  )
}
export default FeaturedSection
