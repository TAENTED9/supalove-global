'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, TrendingUp, Sparkles, PackageCheck, ArrowRight } from 'lucide-react'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const POPULAR_SEARCHES = [
  '50kg Nigerian Rice',
  'Ijebu Garri',
  'Pure Red Palm Oil',
  'Black-Eyed Beans (Oloyin)',
  'Smoked Crayfish Calabar',
  'Ofada Rice',
  'Ground Tatashe Pepper',
  'Raw Natural Honey',
]

const QUICK_CATEGORIES = [
  { name: 'Grains & Cereals', slug: 'grains-cereals' },
  { name: 'Cooking Oils', slug: 'cooking-oils' },
  { name: 'Legumes & Beans', slug: 'legumes-beans' },
  { name: 'Root Crops', slug: 'root-crops' },
  { name: 'Spices & Seasonings', slug: 'spices-seasonings' },
  { name: 'Beverages', slug: 'beverages' },
]

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim()
    if (!trimmed) return
    onClose()
    router.push(`/products?search=${encodeURIComponent(trimmed)}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative w-full max-w-3xl mx-auto mt-6 sm:mt-16 px-4 z-10 animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
          {/* Input Header */}
          <form onSubmit={handleSubmit} className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
            <Search className="w-5 h-5 text-brand-green shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search foodstuffs, bulk grains, oils, bags, or spices..."
              className="w-full text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="shrink-0 bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              Search <ArrowRight size={13} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <X size={18} />
            </button>
          </form>

          {/* Quick links & categories body */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Quick Categories */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <Sparkles size={14} className="text-brand-orange" />
                Browse by Category
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      onClose()
                      router.push(`/products?category=${cat.slug}`)
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 hover:border-brand-green hover:text-brand-green hover:bg-brand-green/5 transition-all"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <TrendingUp size={14} className="text-brand-green" />
                Popular Commodities & Searches
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSearch(term)}
                    className="flex items-center justify-between text-left text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-xl transition-colors group"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Search size={13} className="text-slate-400 group-hover:text-brand-green" />
                      {term}
                    </span>
                    <ArrowRight size={12} className="text-slate-300 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bulk / Wholesale Notice */}
            <div className="bg-brand-orange/10 border border-brand-orange/20 rounded-xl p-3.5 flex items-start gap-3">
              <PackageCheck className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-slate-800">Need Bulk Export or Container Orders?</p>
                <p className="text-slate-600 mt-0.5">
                  We supply 20ft & 40ft containers with phyto-sanitary inspection documents. Call or request custom invoice on our products page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SearchModal
