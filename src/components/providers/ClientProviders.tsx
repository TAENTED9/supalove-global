'use client'

import { Toaster } from 'sonner'
import { CartDrawer } from '@/components/cart/CartDrawer'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: '0.75rem',
            fontFamily: 'var(--font-sans)',
          },
        }}
      />
    </>
  )
}
export default ClientProviders
