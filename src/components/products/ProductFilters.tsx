'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X, RotateCcw } from 'lucide-react'
import type { CategoryItem } from '@/lib/data'

interface ProductFiltersProps {
  categories: CategoryItem[]
}

const UNITS = [
  { label: 'All Units', value: '' },
  { label: 'Bags (25kg - 50kg)', value: 'BAG' },
  { label: 'Kilograms (KG)', value: 'KG' },
  { label: 'Litres (LITRE)', value: 'LITRE' },
  { label: 'Cartons (CARTON)', value: 'CARTON' },
  { label: 'Pieces (PIECE)', value: 'PIECE' },
]

const SORTS = [
  { label: 'Featured & Popular', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest Arrivals', value: 'newest' },
]

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category') || ''
  const currentUnit = searchParams.get('unit') || ''
  const currentInStock = searchParams.get('inStock') === 'true'
  const currentSort = searchParams.get('sort') || 'featured'
  const currentMin = searchParams.get('minPrice') || ''
  const currentMax = searchParams.get('maxPrice') || ''

  const [minPrice, setMinPrice] = useState(currentMin)
  const [maxPrice, setMaxPrice] = useState(currentMax)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMinPrice(currentMin)
    setMaxPrice(currentMax)
  }, [currentMin, currentMax])

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1') // reset to page 1 on filter change
    router.push(`/products?${params.toString()}`)
  }

  const handlePriceFilter = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    const normalizePrice = (value: string) => {
      const parsed = Number(value)
      return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : ''
    }
    const normalizedMin = normalizePrice(minPrice)
    const normalizedMax = normalizePrice(maxPrice)

    if (normalizedMin) params.set('minPrice', normalizedMin)
    else params.delete('minPrice')

    if (normalizedMax) params.set('maxPrice', normalizedMax)
    else params.delete('maxPrice')

    if (normalizedMin && normalizedMax && Number(normalizedMax) < Number(normalizedMin)) {
      params.set('maxPrice', normalizedMin)
      setMaxPrice(normalizedMin)
    }

    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  useEffect(() => {
    if (!mobileDrawerOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    drawerRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileDrawerOpen(false)
        return
      }

      if (event.key !== 'Tab' || !drawerRef.current) return
      const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (!first || !last) {
        event.preventDefault()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [mobileDrawerOpen])

  const clearAllFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    router.push('/products')
  }

  const hasActiveFilters = Boolean(
    currentCategory || currentUnit || currentInStock || currentMin || currentMax || searchParams.get('search')
  )

  const filterContent = (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
          Category
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => updateParam('category', '')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
              !currentCategory
                ? 'bg-brand-green/10 text-brand-green font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>All Categories</span>
            {!currentCategory && <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => updateParam('category', c.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                currentCategory === c.slug
                  ? 'bg-brand-green/10 text-brand-green font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{c.name}</span>
              {currentCategory === c.slug && <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-xs font-semibold text-slate-700">
          <span>In-stock products only</span>
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={(event) => updateParam('inStock', event.target.checked ? 'true' : '')}
            className="h-4 w-4 accent-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
          />
        </label>
      </div>

      {/* Measurement Unit Filter */}
      <div className="pt-5 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
          Measurement Unit
        </h3>
        <div className="space-y-1">
          {UNITS.map((u) => (
            <button
              key={u.value}
              type="button"
              onClick={() => updateParam('unit', u.value)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                currentUnit === u.value
                  ? 'bg-brand-orange/15 text-amber-800 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{u.label}</span>
              {currentUnit === u.value && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter Form */}
      <div className="pt-5 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
          Price Range (₦)
        </h3>
        <form onSubmit={handlePriceFilter} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              aria-label="Minimum price in naira"
              placeholder="Min ₦"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-green"
            />
            <input
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              aria-label="Maximum price in naira"
              placeholder="Max ₦"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-green"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Apply Price
          </button>
        </form>
      </div>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={clearAllFilters}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
          >
            <RotateCcw size={13} /> Clear All Filters
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar (Campify style) */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm h-fit sticky top-24">
        <div className="flex items-center justify-between pb-3.5 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-brand-green" />
            <h2 className="text-sm font-bold text-slate-900">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-[11px] font-semibold text-brand-green hover:underline"
            >
              Reset
            </button>
          )}
        </div>
        {filterContent}
      </aside>

      {/* Mobile Filter Bar & Drawer */}
      <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm lg:hidden">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          aria-expanded={mobileDrawerOpen}
          aria-controls="mobile-product-filters"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-green/40 hover:text-brand-green"
        >
          <Filter size={15} className="text-brand-green" />
          <span>Filters</span>
          {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-brand-orange" aria-label="Active filters" />}
        </button>

        <label className="flex min-h-11 items-center gap-2 text-xs font-medium text-slate-500">
          Sort
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="min-h-10 max-w-40 appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-3 pr-3 text-xs font-semibold text-slate-700 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/15"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mobile Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close product filters"
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <div
            ref={drawerRef}
            id="mobile-product-filters"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-filter-title"
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 z-10 flex max-h-[88dvh] flex-col overflow-y-auto rounded-t-2xl border-t border-slate-200 bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl animate-slide-up"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-brand-green" />
                  <h2 id="mobile-filter-title" className="text-sm font-bold text-slate-900">Filter products</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Close filters"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
            </div>
            <div className="flex-1 py-5">
              {filterContent}
            </div>

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="mt-2 min-h-12 w-full rounded-lg bg-brand-green text-sm font-bold text-white shadow-md shadow-brand-green/20 transition-colors hover:bg-brand-green-hover"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  )
}
export default ProductFilters
