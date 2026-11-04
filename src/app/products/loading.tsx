import { ProductCardSkeletonGrid } from '@/components/products/ProductCardSkeleton'

/**
 * /products loading skeleton — matches the two-col sidebar + grid layout.
 */
export default function ProductsLoading() {
  return (
    <div className="bg-gray-50/40 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="h-4 bg-gray-200 rounded w-48 mb-6 animate-pulse" />

        {/* Title */}
        <div className="mb-8 space-y-2">
          <div className="h-8 bg-gray-200 rounded w-72 animate-pulse" />
          <div className="h-4 bg-gray-100 rounded w-96 animate-pulse" />
        </div>

        {/* Two-col layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton – desktop only */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="h-14 bg-white rounded-2xl border border-gray-200 mb-6 animate-pulse" />
            <ProductCardSkeletonGrid count={9} />
          </div>
        </div>
      </div>
    </div>
  )
}
