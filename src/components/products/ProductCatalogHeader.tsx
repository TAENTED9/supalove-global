'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { X, ChevronDown } from 'lucide-react'

interface ProductCatalogHeaderProps {
  totalCount: number
}

const SORTS = [
  { label: 'Featured & Popular', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest Arrivals', value: 'newest' },
]

export function ProductCatalogHeader({ totalCount }: ProductCatalogHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || 'featured'
  const currentCategory = searchParams.get('category')
  const currentUnit = searchParams.get('unit')
  const currentSearch = searchParams.get('search')
  const currentMin = searchParams.get('minPrice')
  const currentMax = searchParams.get('maxPrice')

  const removeFilter = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  const handleSortChange = (sortVal: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortVal)
    router.push(`/products?${params.toString()}`)
  }

  const hasAnyFilter = Boolean(
    currentCategory || currentUnit || currentSearch || currentMin || currentMax
  )

  return (
    <div className="space-y-4 mb-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs font-bold text-slate-900">
            {totalCount} {totalCount === 1 ? 'Product' : 'Products'} Found
          </span>
          {currentSearch && (
            <p className="text-xs text-slate-500 mt-0.5">
              Results matching &ldquo;{currentSearch}&rdquo;
            </p>
          )}
        </div>

        {/* Desktop Sort Dropdown */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl outline-none focus:border-brand-green cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasAnyFilter && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Active Filters:</span>

          {currentCategory && (
            <button
              type="button"
              onClick={() => removeFilter('category')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-green/10 text-brand-green text-xs font-bold rounded-full hover:bg-brand-green/20 transition-colors"
            >
              <span>Category: {currentCategory}</span>
              <X size={12} />
            </button>
          )}

          {currentUnit && (
            <button
              type="button"
              onClick={() => removeFilter('unit')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-orange/15 text-amber-800 text-xs font-bold rounded-full hover:bg-brand-orange/25 transition-colors"
            >
              <span>Unit: {currentUnit}</span>
              <X size={12} />
            </button>
          )}

          {currentSearch && (
            <button
              type="button"
              onClick={() => removeFilter('search')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-200 transition-colors"
            >
              <span>Search: &quot;{currentSearch}&quot;</span>
              <X size={12} />
            </button>
          )}

          {(currentMin || currentMax) && (
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('minPrice')
                params.delete('maxPrice')
                router.push(`/products?${params.toString()}`)
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full hover:bg-slate-200 transition-colors"
            >
              <span>Price: ₦{currentMin || '0'} - ₦{currentMax || 'Any'}</span>
              <X size={12} />
            </button>
          )}

          <button
            type="button"
            onClick={() => router.push('/products')}
            className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline ml-1"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}
export default ProductCatalogHeader
