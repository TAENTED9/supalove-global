'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Globe,
  Truck,
  User,
  MessageCircle,
  ChevronDown,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { useCartStore } from '@/store/cart'
import { siteConfig, whatsappHref } from '@/config/site'
import { SearchModal } from '@/components/layout/SearchModal'

interface StoreCategory {
  name: string
  slug: string
}

export function Navbar() {
  const pathname = usePathname()
  const { totalItems, openDrawer } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [catDropdownOpen, setCatDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<StoreCategory[]>([])
  const catRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null)

  const closeSearchModal = useCallback(() => {
    setSearchModalOpen(false)
  }, [])

  useEffect(() => { setMounted(true) }, [])

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setCatDropdownOpen(false)
  }, [pathname])

  // Mobile menu focus trap + scroll lock
  useEffect(() => {
    if (!mobileMenuOpen) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const raf = window.requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus()
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileMenuOpen(false); return }
      if (e.key !== 'Tab' || !mobileMenuRef.current) return
      const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) { e.preventDefault(); return }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(raf)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [mobileMenuOpen])

  // Lazy-fetch categories on dropdown/menu open
  useEffect(() => {
    if ((!catDropdownOpen && !mobileMenuOpen) || categories.length > 0) return
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d: { categories?: StoreCategory[] }) => {
        setCategories(Array.isArray(d.categories) ? d.categories : [])
      })
      .catch(() => setCategories([]))
  }, [catDropdownOpen, mobileMenuOpen, categories.length])

  // Category dropdown outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatDropdownOpen(false)
    }
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setCatDropdownOpen(false) }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchModalOpen(true) }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const itemCount = mounted ? totalItems() : 0

  return (
    <>
      {/* ── Announcement strip ────────────────────────────────────────── */}
      <div className="bg-slate-900 text-white text-[11px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center gap-1.5 text-slate-300 min-w-0">
              <Globe size={13} className="text-brand-orange shrink-0" />
              <span className="truncate">Worldwide Export &amp; Nationwide Delivery</span>
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-300 shrink-0">
              <Truck size={12} className="text-brand-green" />
              100% Quality Inspected Produce
            </span>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link
              href="/track-order"
              className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Truck size={12} className="text-brand-orange" />
              <span>Track Order</span>
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/admin/login"
              className="text-slate-400 hover:text-brand-orange transition-colors flex items-center gap-1"
            >
              <User size={12} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main navbar h-14 sticky ───────────────────────────────────── */}
      <header className="sticky top-0 left-0 w-full z-40 bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
          <div className="flex items-center h-14 gap-2 md:gap-4">

            {/* Logo */}
            <Logo size="sm" className="shrink-0" />

            {/* Categories dropdown – desktop only */}
            <div ref={catRef} className="hidden md:block relative">
              <button
                type="button"
                aria-expanded={catDropdownOpen}
                aria-haspopup="true"
                onClick={() => setCatDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Menu size={14} />
                All Categories
                <ChevronDown
                  size={13}
                  className={`transition-transform ${catDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {catDropdownOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white shadow-lg border border-gray-200 py-2 z-dropdown animate-fade-in">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setCatDropdownOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search bar – desktop only (same shape with old appearance) */}
            <div className="hidden lg:flex flex-1 max-w-lg mx-4">
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="flex h-10 w-full items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 text-left text-sm text-slate-500 transition-colors hover:border-brand-green/40 hover:bg-white"
                aria-label="Search products"
              >
                <Search size={16} className="shrink-0 text-brand-green" />
                <span className="flex-1 truncate text-xs sm:text-sm text-slate-400">
                  Search rice, palm oil, beans, or foodstuffs…
                </span>
                <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 xl:inline">
                  Ctrl K
                </kbd>
              </button>
            </div>

            {/* Right-side actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Search icon – mobile/tablet */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                aria-label="Open search"
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Cart button – icon with badge on top */}
              <button
                type="button"
                onClick={openDrawer}
                aria-label={`Shopping cart with ${itemCount} items`}
                className="relative flex items-center justify-center w-10 h-10 rounded-full text-slate-700 hover:text-brand-green hover:bg-slate-100 transition-colors"
              >
                <ShoppingBag size={21} />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-brand-orange text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none shadow-xs">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Hamburger – mobile/tablet */}
              <button
                ref={mobileMenuButtonRef}
                type="button"
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-store-menu"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile slide-in drawer ────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-modal md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileMenuOpen(false)}
            className="absolute inset-0 bg-gray-950/40 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <div
            ref={mobileMenuRef}
            id="mobile-store-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Store navigation"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto bg-white px-5 pb-8 pt-5 shadow-2xl animate-slide-up"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
              <Logo size="sm" />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search shortcut */}
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); setSearchModalOpen(true) }}
              className="mb-5 flex min-h-11 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 text-left text-sm text-slate-500 hover:border-brand-green/40 hover:bg-white transition-colors"
            >
              <Search size={16} className="text-brand-green" />
              <span className="text-slate-400">Search rice, palm oil, beans…</span>
            </button>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                All Products
              </Link>

              {/* Categories sub-section */}
              <div className="my-2 border-t border-gray-100 pt-3">
                <p className="px-3 pb-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  Categories
                </p>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-600"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/products?unit=BAG"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between"
              >
                <span>Bulk Bags &amp; Export</span>
                <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Wholesale
                </span>
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Track Your Order
              </Link>
              <Link
                href="/delivery"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Delivery &amp; Returns
              </Link>
            </nav>

            {/* WhatsApp CTA */}
            <div className="mt-auto pt-5 border-t border-gray-100">
              <a
                href={whatsappHref('Hello Supalovefoods, I would like to place an order.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-4 py-3 rounded-xl transition-colors"
              >
                <MessageCircle size={16} />
                Order on WhatsApp
              </a>
              <p className="mt-3 text-center text-xs text-gray-400">
                {siteConfig.phone}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchModalOpen} onClose={closeSearchModal} />
    </>
  )
}
export default Navbar
