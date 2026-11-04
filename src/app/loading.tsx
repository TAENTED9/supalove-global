import { ProductCardSkeletonGrid } from '@/components/products/ProductCardSkeleton'

/**
 * Homepage loading skeleton — shown while page data is streaming.
 * Matches the homepage layout: hero area + category strip placeholder + product rails.
 */
export default function HomeLoading() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero skeleton */}
      <div className="bg-brand-900 py-10 sm:py-14 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl space-y-4">
            <div className="h-8 bg-brand-700/60 rounded-lg w-3/4" />
            <div className="h-8 bg-brand-700/60 rounded-lg w-1/2" />
            <div className="h-4 bg-brand-700/40 rounded w-full" />
            <div className="h-4 bg-brand-700/40 rounded w-4/5" />
            <div className="flex gap-3 mt-4">
              <div className="h-12 bg-brand-600/60 rounded-xl w-40" />
              <div className="h-12 bg-white/10 rounded-xl w-48" />
            </div>
          </div>
        </div>
      </div>

      {/* Category strip skeleton */}
      <div className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-5 bg-gray-200 rounded w-36 mb-5 animate-pulse" />
          <div className="hidden sm:grid grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="flex gap-2 sm:hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-9 w-24 bg-gray-100 rounded-full animate-pulse shrink-0" />
            ))}
          </div>
        </div>
      </div>

      {/* Featured products skeleton */}
      <div className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="h-5 bg-gray-200 rounded w-48 mb-5 animate-pulse" />
          <ProductCardSkeletonGrid count={5} />
        </div>
      </div>
    </div>
  )
}
