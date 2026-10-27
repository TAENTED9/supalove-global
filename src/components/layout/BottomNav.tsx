'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, ShoppingCart, Truck, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { whatsappHref } from '@/config/site'

export function BottomNav() {
  const pathname = usePathname()
  const { totalItems, openDrawer } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const count = mounted ? totalItems() : 0

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Shop',
      href: '/products',
      icon: ShoppingBag,
      isActive: pathname.startsWith('/products'),
    },
    {
      label: 'Cart',
      onClick: openDrawer,
      icon: ShoppingCart,
      badge: count,
      isActive: pathname === '/cart',
    },
    {
      label: 'Track Order',
      href: '/track-order',
      icon: Truck,
      isActive: pathname === '/track-order' || pathname.startsWith('/orders'),
    },
    {
      label: 'WhatsApp',
      href: whatsappHref('Hello Supalovefoods, I would like to make an inquiry.'),
      external: true,
      icon: MessageCircle,
      isActive: false,
    },
  ]

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md md:hidden"
      aria-label="Mobile Navigation"
    >
      <div className="mx-auto grid h-16 max-w-lg grid-cols-5 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const content = (
            <div className="relative flex flex-col items-center justify-center min-h-[44px] min-w-[44px] w-full py-1 text-center select-none">
              <div className="relative">
                <Icon
                  size={20}
                  className={`transition-colors ${
                    item.isActive ? 'text-brand-green' : 'text-slate-500'
                  }`}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 bg-brand-orange text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none shadow-sm">
                      {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-bold leading-none tracking-tight ${
                  item.isActive ? 'text-brand-green' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
            </div>
          )

          if (item.onClick) {
            return (
              <button
                key={item.label}
                type="button"
                onClick={item.onClick}
                className="w-full flex items-center justify-center min-h-[44px] min-w-[44px]"
                aria-label={item.label}
              >
                {content}
              </button>
            )
          }

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center min-h-[44px] min-w-[44px]"
                aria-label={item.label}
              >
                {content}
              </a>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className="w-full flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label={item.label}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
export default BottomNav
