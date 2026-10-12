'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

interface AdminLayoutClientProps {
  children: React.ReactNode
}

const NAV_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Layers },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
]

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // If on login page, don't wrap with admin chrome
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col justify-between bg-white border-r border-slate-200/80 p-5 shrink-0 fixed inset-y-0 left-0 z-30">
        <div className="space-y-6">
          {/* Brand */}
          <div className="pb-4 border-b border-slate-100">
            <Logo size="sm" />
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full mt-2">
              <ShieldCheck size={11} /> Admin Control
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-brand-green text-white shadow-md shadow-brand-green/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-brand-green hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} /> View Live Store
            </span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">New Tab</span>
          </Link>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <Logo size="sm" />
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 text-slate-700"
          aria-label="Toggle admin menu"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Dropdown */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-white h-full shadow-2xl p-6 z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <Logo size="sm" />
                <button
                  type="button"
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-brand-green text-white shadow-md shadow-brand-green/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon size={17} />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileSidebarOpen(false)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 p-2"
              >
                <ExternalLink size={14} /> View Live Store
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="w-full flex items-center gap-2 text-xs font-bold text-red-600 p-2"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Content Container */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-8 lg:p-10 min-w-0">
        {children}
      </div>
    </div>
  )
}
export default AdminLayoutClient
