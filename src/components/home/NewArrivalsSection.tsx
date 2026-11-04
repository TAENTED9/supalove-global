import { SectionHeader } from '@/components/ui/SectionHeader'
import { ProductCard } from '@/components/products/ProductCard'
import type { ProductItem } from '@/lib/data'

interface NewArrivalsSectionProps {
  products: ProductItem[]
}

export function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
  if (!products.length) return null

  return (
    <section className="py-8 sm:py-10 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        <SectionHeader
          title="New Arrivals"
          href="/products?sort=newest"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
export default NewArrivalsSection
