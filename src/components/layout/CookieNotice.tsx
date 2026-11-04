'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function CookieNotice() {
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const accepted = window.localStorage.getItem('supalovefoods-cookie-consent')
      if (accepted !== 'all' && accepted !== 'essential') {
        setVisible(true)
      }
    } catch (error) {
      console.error('Unable to read cookie consent:', error)
      setVisible(true)
      setError('Your storage settings prevent saving a cookie choice.')
    }
  }, [])

  const saveConsent = (consent: 'all' | 'essential') => {
    try {
      window.localStorage.setItem('supalovefoods-cookie-consent', consent)
      setVisible(false)
      setError(null)
    } catch (caughtError) {
      console.error('Unable to save cookie consent:', caughtError)
      setError('Your choice could not be saved in this browser. Please check your storage settings and try again.')
    }
  }

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex sm:items-center sm:justify-between">
        <div className="text-xs text-slate-600 sm:max-w-2xl">
          We use essential storage to keep your cart and preferences working. Privacy-limited shopping analytics are recorded only if you accept. Read our privacy policy for details.
          {error && <p role="alert" className="mt-2 text-red-700">{error}</p>}
          <Link href="/privacy" className="ml-1 font-semibold text-brand-green underline underline-offset-2">
            Privacy policy
          </Link>
        </div>
        <div className="mt-3 flex items-center gap-2 sm:mt-0">
          <button
            type="button"
            onClick={() => saveConsent('essential')}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => saveConsent('all')}
            className="rounded-xl bg-brand-green px-3 py-2 text-xs font-bold text-white"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
