/**
 * ProductCardSkeleton — matches ProductCard's exact aspect ratios and layout
 * to prevent CLS during loading.
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xs h-full flex flex-col animate-pulse">
      {/* Image area: aspect-[4/3] */}
      <div className="relative aspect-[4/3] w-full bg-gray-200 flex-shrink-0" />

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col gap-3">
        {/* Name – 2 lines */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-gray-200 rounded w-full" />
          <div className="h-3.5 bg-gray-200 rounded w-3/4" />
        </div>

        {/* Price line */}
        <div className="mt-auto flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-24" />
          <div className="h-8 bg-gray-200 rounded-xl w-16" />
        </div>
      </div>
    </div>
  )
}

/**
 * Rail/grid of skeletons — renders `count` cards in the same grid used by product rails.
 */
export function ProductCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default ProductCardSkeleton
