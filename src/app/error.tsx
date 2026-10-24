'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={36} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Something went wrong
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mb-8 leading-relaxed">
          An unexpected system error occurred while processing your request. Please try again or return to our catalog.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white text-xs font-bold transition-all shadow-md shadow-brand-green/20"
          >
            <RefreshCw size={15} /> Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
          >
            <Home size={15} /> Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
