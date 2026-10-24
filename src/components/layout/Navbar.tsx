'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Globe,
  Truck,
  ShieldCheck,
  User,
  PhoneCall,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { useCartStore } from '@/store/cart'
import { siteConfig, telHref } from '@/config/site'
import { SearchModal } from '@/components/layout/SearchModal'

const CATEGORIES = [
  { name: 'All Categories', slug: '' },
  { name: 'Grains & Rice', slug: 'grains-rice' },
  { name: 'Beans & Legumes', slug: 'beans-legumes' },
  { name: 'Flours & Garri', slug: 'flours-garri' },
  { name: 'Oils', slug: 'oils' },
  { name: 'Spices & Seasoning', slug: 'spices-seasoning' },
  { name: 'Tubers & Others', slug: 'tubers-others' },
]

export function Navbar() {
  const router = useRouter()
  const { totalItems, openDrawer } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [catDropdownOpen, setCatDropdownOpen] = useState(false)
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close category dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchModalOpen(true)
      return
    }
    const params = new URLSearchParams()
    params.set('search', searchQuery.trim())
    if (selectedCat.slug) {
      params.set('category', selectedCat.slug)
    }
    router.push(`/products?${params.toString()}`)
  }

  const itemCount = mounted ? totalItems() : 0

  return (
    <>
      {/* Top Banner: Export Quality & Fast Delivery announcement strip */}
      <div className="bg-slate-900 text-white text-[11px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Globe size={13} className="text-brand-orange" />
              Worldwide Foodstuff Export &amp; Nationwide Nigeria Delivery
            </span>
            <span className="hidden md:inline-block text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <ShieldCheck size={13} className="text-brand-green" />
              100% Quality Inspected Agricultural Produce
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/orders"
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Truck size={12} className="text-brand-orange" />
              Track Order
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/admin/login"
              className="text-slate-400 hover:text-brand-orange transition-colors flex items-center gap-1"
            >
              <User size={12} />
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-4">
            {/* Left: Brand Logo */}
            <div className="shrink-0 flex items-center gap-3">
              <Logo size="md" />
            </div>

            {/* Center: Search Bar with Category Dropdown Pill (Campify style) */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-2">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="flex items-center w-full h-11 bg-slate-50 border border-slate-200 hover:border-slate-300 focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/10 rounded-full transition-all overflow-hidden p-1">
                  {/* Category Pill Dropdown */}
                  <div ref={catRef} className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setCatDropdownOpen(!catDropdownOpen)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition-colors select-none"
                    >
                      <span className="max-w-[110px] truncate">{selectedCat.name}</span>
                      <ChevronDown size={13} className="text-slate-400" />
                    </button>

                    {catDropdownOpen && (
                      <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-slide-up">
                        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Categories
                        </div>
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.slug}
                            type="button"
                            onClick={() => {
                              setSelectedCat(cat)
                              setCatDropdownOpen(false)
                            }}
                            className={`w-full text-left px-3.5 py-2 text-xs transition-colors flex items-center justify-between ${
                              selectedCat.slug === cat.slug
                                ? 'bg-brand-green/10 text-brand-green font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span>{cat.name}</span>
                            {selectedCat.slug === cat.slug && (
                              <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchModalOpen(true)}
                    placeholder="Search premium rice, beans, pure palm oil, spices..."
                    className="flex-1 bg-transparent px-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                  />

                  {/* Keyboard shortcut hint */}
                  <span className="hidden xl:inline-block text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md mr-2">
                    ⌘K
                  </span>

                  {/* Search Button */}
                  <button
                    type="submit"
                    aria-label="Search"
                    className="w-9 h-9 rounded-full bg-brand-green hover:bg-brand-green-hover text-white flex items-center justify-center shrink-0 transition-all shadow-sm"
                  >
                    <Search size={15} />
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Navigation Links & Cart Button */}
            <div className="flex items-center gap-2 sm:gap-4">
              <nav className="hidden md:flex items-center gap-5 mr-1 text-xs font-semibold text-slate-700">
                <Link
                  href="/"
                  className="hover:text-brand-green transition-colors py-1"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="hover:text-brand-green transition-colors py-1"
                >
                  Products
                </Link>
                <Link
                  href="/products?unit=BAG"
                  className="hover:text-brand-green transition-colors py-1 flex items-center gap-1"
                >
                  Bulk Bags
                  <span className="bg-brand-orange text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    Wholesale
                  </span>
                </Link>
                <Link
                  href="/orders"
                  className="hover:text-brand-green transition-colors py-1"
                >
                  Orders
                </Link>
              </nav>

              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Open search"
              >
                <Search size={20} />
              </button>

              {/* Cart Drawer Trigger Button */}
              <button
                type="button"
                onClick={openDrawer}
                className="relative flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all group"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag
                    size={19}
                    className="text-slate-700 group-hover:text-brand-green transition-colors"
                  />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 bg-brand-orange text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm animate-scale-in">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold text-slate-700 group-hover:text-brand-green transition-colors">
                  Cart
                </span>
              </button>

              {/* Mobile Hamburger Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-4 animate-slide-up shadow-lg">
            <form onSubmit={handleSearchSubmit} className="pt-1">
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 gap-2">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search foodstuffs, grains, oils..."
                  className="bg-transparent text-xs text-slate-800 outline-none w-full"
                />
                <button
                  type="submit"
                  className="bg-brand-green text-white text-[10px] font-bold px-2.5 py-1 rounded-lg"
                >
                  Go
                </button>
              </div>
            </form>

            <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/products?unit=BAG"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Bulk Bags &amp; Export</span>
                <span className="bg-brand-orange text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Wholesale
                </span>
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Shopping Cart</span>
                <span className="font-bold text-brand-green">{itemCount} items</span>
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Track Your Order
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                Admin Portal
              </Link>
            </nav>

            {/* Quick Contact In Mobile Menu */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500">
              <PhoneCall size={14} className="text-brand-green" />
              <a href={telHref()} className="hover:text-brand-green transition-colors">
                Customer Inquiries: {siteConfig.phoneIntl || siteConfig.phone}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  )
}
export default Navbar
