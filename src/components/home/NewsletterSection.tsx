'use client'

import { useState } from 'react'
import { Mail, Check, BellRing } from 'lucide-react'
import { toast } from 'sonner'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setSubscribed(true)
    toast.success('Subscribed! You will receive weekly commodity price updates.')
    setEmail('')
  }

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mx-auto mb-4">
          <BellRing size={24} />
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Stay Updated with Weekly Foodstuff Price Indices
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-lg mx-auto leading-relaxed">
          Get notified when seasonal harvests arrive, rice bag prices decrease, or new export shipping schedules open.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={subscribed}
            className="bg-brand-green hover:bg-brand-green-hover text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-brand-green/20 text-xs sm:text-sm shrink-0 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
          >
            {subscribed ? (
              <>
                <Check size={16} /> Subscribed
              </>
            ) : (
              'Subscribe Free'
            )}
          </button>
        </form>

        <p className="text-[11px] text-slate-400 mt-3">
          Zero spam. Unsubscribe anytime with 1-click.
        </p>
      </div>
    </section>
  )
}
export default NewsletterSection
