'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, TrendingUp, Sparkles, ArrowRight, Clock3, LoaderCircle } from 'lucide-react'

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

const RECENT_SEARCHES_KEY = 'supalovefoods-recent-searches'

interface SearchSuggestion {
  id: string
  name: string
  slug: string
  category: string
}

interface StoreCategory {
  name: string
  slug: string
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [categories, setCategories] = useState<StoreCategory[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    try {
      const savedSearches: unknown = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
      setRecentSearches(
        Array.isArray(savedSearches)
          ? savedSearches.filter((term): term is string => typeof term === 'string').slice(0, 5)
          : []
      )
    } catch {
      setRecentSearches([])
    }

    fetch('/api/categories')
      .then((response) => response.json())
      .then((data: { categories?: StoreCategory[] }) => {
        setCategories(Array.isArray(data.categories) ? data.categories : [])
      })
      .catch(() => setCategories([]))

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), [tabindex]:not([tabindex="-1"])'
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
  }, [isOpen, onClose])

  useEffect(() => {
    const term = query.trim()
    setActiveIndex(-1)
    if (!isOpen || term.length < 2) {
      setSuggestions([])
      setLoading(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/products/suggestions?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
        })
        const data = await response.json()
        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : [])
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setSuggestions([])
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, 150)

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [isOpen, query])

  if (!isOpen) return null

  const rememberSearch = (searchTerm: string) => {
    const next = [searchTerm, ...recentSearches.filter((term) => term !== searchTerm)].slice(0, 5)
    setRecentSearches(next)
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next))
    } catch {
      return
    }
  }

  const handleSearch = (searchTerm: string) => {
    const trimmed = searchTerm.trim()
    if (!trimmed) return
    rememberSearch(trimmed)
    onClose()
    router.push(`/products?search=${encodeURIComponent(trimmed)}`)
  }

  const options = [
    ...suggestions.map((suggestion) => ({
      id: suggestion.id,
      label: suggestion.name,
      detail: suggestion.category,
      href: `/products/${suggestion.slug}`,
      isSearch: false,
    })),
    ...(query.trim()
      ? [{
          id: 'search-query',
          label: `Search for “${query.trim()}”`,
          detail: 'View all matching products',
          href: `/products?search=${encodeURIComponent(query.trim())}`,
          isSearch: true,
        }]
      : []),
  ]

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && options.length > 0) {
      event.preventDefault()
      setActiveIndex((index) => (index + 1) % options.length)
    } else if (event.key === 'ArrowUp' && options.length > 0) {
      event.preventDefault()
      setActiveIndex((index) => (index <= 0 ? options.length - 1 : index - 1))
    } else if (event.key === 'Enter' && activeIndex >= 0 && options[activeIndex]) {
      event.preventDefault()
      const option = options[activeIndex]
      if (option.isSearch) handleSearch(query)
      else {
        rememberSearch(option.label)
        onClose()
        router.push(option.href)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Search Container */}
      <div className="relative z-10 mx-auto mt-3 w-full max-w-3xl px-3 sm:mt-12 sm:px-4 animate-slide-up">
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Search products" tabIndex={-1} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          {/* Input Header */}
          <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5">
            <Search className="w-5 h-5 text-brand-green shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              aria-label="Search products"
              role="combobox"
              aria-expanded={options.length > 0}
              aria-controls="product-search-suggestions"
              aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
              placeholder="Search foodstuffs, brands, or pantry essentials"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="submit"
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg bg-brand-green px-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-green-hover sm:px-4"
            >
              Search <ArrowRight size={13} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </form>

          {/* Quick links & categories body */}
          <div className="max-h-[75vh] space-y-6 overflow-y-auto p-4 sm:p-6">
            {query.trim().length >= 2 ? (
              <div id="product-search-suggestions" role="listbox" aria-label="Product suggestions" className="space-y-1">
                {loading && (
                  <p className="flex items-center gap-2 px-2 py-3 text-sm text-slate-500" role="status">
                    <LoaderCircle size={16} className="animate-spin text-brand-green" /> Searching products
                  </p>
                )}
                {!loading && options.map((option, index) => (
                  <button
                    id={`search-option-${index}`}
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      if (option.isSearch) handleSearch(query)
                      else {
                        rememberSearch(option.label)
                        onClose()
                        router.push(option.href)
                      }
                    }}
                    className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-lg px-3 text-left transition-colors ${activeIndex === index ? 'bg-brand-green/10 text-brand-green' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <Search size={15} className="shrink-0 text-brand-green" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{option.label}</span>
                        <span className="block truncate text-xs text-slate-500">{option.detail}</span>
                      </span>
                    </span>
                    {option.isSearch && <ArrowRight size={15} className="shrink-0" />}
                  </button>
                ))}
              </div>
            ) : (
              <>
            {/* Quick Categories */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <Sparkles size={14} className="text-brand-orange" />
                Browse by Category
              </div>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      onClose()
                      router.push(`/products?category=${cat.slug}`)
                    }}
                    className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition-colors hover:border-brand-green hover:bg-brand-green/5 hover:text-brand-green"
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                <TrendingUp size={14} className="text-brand-orange" />
                {recentSearches.length > 0 ? 'Recent searches' : 'Popular searches'}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(recentSearches.length > 0 ? recentSearches : POPULAR_SEARCHES.slice(0, 6)).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSearch(term)}
                    className="group flex min-h-11 items-center justify-between rounded-lg bg-slate-50 p-2.5 text-left text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    <span className="flex items-center gap-2 truncate">
                      {recentSearches.length > 0 ? <Clock3 size={13} className="text-slate-400" /> : <Search size={13} className="text-slate-400 group-hover:text-brand-green" />}
                      {term}
                    </span>
                    <ArrowRight size={12} className="text-slate-300 group-hover:text-slate-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {!categories.length && <p className="text-xs text-slate-500">Browse all available products while categories load.</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default SearchModal
