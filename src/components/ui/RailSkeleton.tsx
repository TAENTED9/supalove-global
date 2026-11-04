import { ProductCardSkeletonGrid } from '@/components/products/ProductCardSkeleton'

interface RailSkeletonProps {
  titleWidth?: string
  cardCount?: number
  className?: string
}

export function RailSkeleton({
  titleWidth = 'w-48',
  cardCount = 5,
  className = '',
}: RailSkeletonProps) {
  return (
    <section className={`py-8 sm:py-10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-5 animate-pulse">
          <div className={`h-5 bg-gray-200 rounded ${titleWidth}`} />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>

        {/* 5-card grid skeleton matching exact layout to prevent CLS */}
        <ProductCardSkeletonGrid count={cardCount} />
      </div>
    </section>
  )
}
export default RailSkeleton
