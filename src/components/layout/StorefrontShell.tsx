'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'
import { MessageCircle } from 'lucide-react'
import { whatsappHref } from '@/config/site'

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <main className="flex-1">{children}</main>
  }

  return (
    <>
      <Navbar />
      {/*
        On mobile: pb-[70px] clears the BottomNav (h-16 ≈ 64px + env(safe-area-inset-bottom)).
        On md+: BottomNav is hidden, so no extra padding needed.
      */}
      <main className="flex-1 pb-[70px] md:pb-0">{children}</main>
      <Footer />
      <BottomNav />

      {/* Floating WhatsApp button – desktop only */}
      <a
        href={whatsappHref('Hello Supalovefoods, I would like to make an inquiry.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2.5 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-full shadow-xl shadow-green-900/20 hover:scale-105 active:scale-95 transition-all group border border-green-400/30"
      >
        <MessageCircle size={18} className="group-hover:rotate-12 transition-transform" />
        <span>Chat on WhatsApp</span>
      </a>
    </>
  )
}
export default StorefrontShell
