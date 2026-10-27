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
  ShieldCheck,
  User,
  PhoneCall,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { useCartStore } from '@/store/cart'
import { siteConfig, telHref } from '@/config/site'
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
    if (window.matchMedia('(max-width: 1023px)').matches) {
      window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus())
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
    setCatDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileMenuOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const focusFrame = window.requestAnimationFrame(() => {
      mobileMenuRef.current?.querySelector<HTMLElement>('button, a[href]')?.focus()
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false)
        return
      }

      if (event.key !== 'Tab' || !mobileMenuRef.current) return
      const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])'
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
      window.cancelAnimationFrame(focusFrame)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if ((!catDropdownOpen && !mobileMenuOpen) || categories.length > 0) return
    fetch('/api/categories')
      .then((response) => response.json())
      .then((data: { categories?: StoreCategory[] }) => {
        setCategories(Array.isArray(data.categories) ? data.categories : [])
      })
      .catch(() => setCategories([]))
  }, [catDropdownOpen, categories.length, mobileMenuOpen])

  // Close category dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatDropdownOpen(false)
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCatDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
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
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-4">
            {/* Left: Brand Logo */}
            <div className="shrink-0 flex items-center gap-3">
              <Logo size="md" />
            </div>

            {/* Store search and live category menu */}
            <div className="hidden max-w-2xl flex-1 items-center gap-2 lg:flex">
              <div ref={catRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setCatDropdownOpen((open) => !open)}
                  aria-expanded={catDropdownOpen}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:border-brand-green/40 hover:text-brand-green"
                >
                  <Menu size={15} /> Shop categories
                </button>
                {catDropdownOpen && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-xl animate-slide-up">
                    <Link href="/products" className="block px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50" onClick={() => setCatDropdownOpen(false)}>
                      All products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/products?category=${category.slug}`}
                        onClick={() => setCatDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-slate-600 transition-colors hover:bg-brand-green/5 hover:text-brand-green"
                      >
                        {category.name}
                      </Link>
                    ))}
                    {!categories.length && <p className="px-4 py-2 text-xs text-slate-500">Categories unavailable</p>}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 text-left text-sm text-slate-500 transition-colors hover:border-brand-green/40 hover:bg-white"
                aria-label="Search products"
              >
                <Search size={17} className="shrink-0 text-brand-green" />
                <span className="flex-1 truncate">Search foodstuffs, brands, or pantry essentials</span>
                <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 xl:inline">Ctrl K</kbd>
              </button>
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
                ref={mobileMenuButtonRef}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-store-menu"
                className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <div
              ref={mobileMenuRef}
              id="mobile-store-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Store navigation"
              tabIndex={-1}
              className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col overflow-y-auto bg-white px-5 pb-8 pt-5 shadow-2xl animate-slide-up"
            >
              <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-sm font-bold text-slate-900">Shop Supalove</span>
                <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSearchModalOpen(true)
                }}
                className="mb-5 flex min-h-11 items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 text-left text-sm text-slate-500"
              >
                <Search size={17} className="text-brand-green" /> Search products
              </button>

              <nav className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
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
                className="rounded-lg px-3 py-3 hover:bg-slate-50 transition-colors"
              >
                All Products
              </Link>
              <div className="my-2 border-t border-slate-100 pt-3">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase text-slate-400">Categories</p>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products?category=${category.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-brand-green/5 hover:text-brand-green"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
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
              <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-5 text-xs text-slate-500">
              <PhoneCall size={14} className="text-brand-green" />
              <a href={telHref()} className="hover:text-brand-green transition-colors">
                Customer Inquiries: {siteConfig.phoneIntl || siteConfig.phone}
              </a>
            </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={closeSearchModal}
      />
    </>
  )
}
export default Navbar
