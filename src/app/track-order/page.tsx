'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Truck, Search, ShieldCheck, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function TrackOrderPage() {
  const router = useRouter()
  const [reference, setReference] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanRef = reference.trim().toUpperCase()
    if (!cleanRef) {
      toast.error('Please enter an order reference')
      return
    }

    setLoading(true)
    router.push(`/orders/${cleanRef}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto mb-4">
            <Truck size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Track Your Foodstuff Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter your order reference code (e.g. SLF-123456) to check realtime processing and dispatch status.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Order Reference Code *
              </label>
              <input
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. SLF-1712345678-ABC"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-white font-bold text-sm transition-all shadow-lg shadow-brand-green/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search size={16} />
              <span>{loading ? 'Finding Order...' : 'Track Order Status'}</span>
            </button>
          </form>

          {/* Tips */}
          <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
            <div className="flex items-start gap-2.5">
              <Clock size={16} className="text-brand-orange shrink-0 mt-0.5" />
              <span>Orders are processed within 24 hours of payment verification.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-brand-green shrink-0 mt-0.5" />
              <span>All packages are sealed with tamper-evident inspection tape.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
