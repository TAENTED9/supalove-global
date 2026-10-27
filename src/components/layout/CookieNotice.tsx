'use client'

import { useEffect, useState } from 'react'

export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = window.localStorage.getItem('supalovefoods-cookie-consent')
    if (!accepted) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    window.localStorage.setItem('supalovefoods-cookie-consent', 'accepted')
    setVisible(false)
  }

  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex sm:items-center sm:justify-between">
        <div className="text-xs text-slate-600 sm:max-w-2xl">
          We use cookies to keep the site secure and improve shopping experience. By continuing, you agree to the use of essential cookies and analytics as described in our privacy policy.
        </div>
        <div className="mt-3 flex items-center gap-2 sm:mt-0">
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-xl bg-brand-green px-3 py-2 text-xs font-bold text-white"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
