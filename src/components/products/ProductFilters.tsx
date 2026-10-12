'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, X, RotateCcw, ChevronDown } from 'lucide-react'
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
  const currentSort = searchParams.get('sort') || 'featured'
  const currentMin = searchParams.get('minPrice') || ''
  const currentMax = searchParams.get('maxPrice') || ''

  const [minPrice, setMinPrice] = useState(currentMin)
  const [maxPrice, setMaxPrice] = useState(currentMax)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

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
    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')

    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')

    params.set('page', '1')
    router.push(`/products?${params.toString()}`)
  }

  const clearAllFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    router.push('/products')
  }

  const hasActiveFilters = Boolean(
    currentCategory || currentUnit || currentMin || currentMax || searchParams.get('search')
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
              placeholder="Min ₦"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-brand-green"
            />
            <input
              type="number"
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
      <div className="lg:hidden flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
        >
          <Filter size={15} className="text-brand-green" />
          <span>Filters {hasActiveFilters && '• Active'}</span>
        </button>

        {/* Sort Select */}
        <div className="relative">
          <select
            value={currentSort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl outline-none focus:border-brand-green cursor-pointer"
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

      {/* Mobile Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-brand-green" />
                  <h2 className="text-sm font-bold text-slate-900">Filter Products</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>
              {filterContent}
            </div>

            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              className="mt-6 w-full py-3 bg-brand-green text-white font-bold text-xs rounded-xl shadow-md shadow-brand-green/20"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </>
  )
}
export default ProductFilters
