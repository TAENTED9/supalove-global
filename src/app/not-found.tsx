import Link from 'next/link'
import { Home, ShoppingBag } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        <div className="w-20 h-20 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto mb-6 text-3xl font-black">
          404
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
          The agricultural commodity or page you are looking for does not exist or may have been relocated.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-green/20"
          >
            <Home size={15} /> Return Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
          >
            <ShoppingBag size={15} /> Browse Commodities
          </Link>
        </div>
      </div>
    </div>
  )
}
