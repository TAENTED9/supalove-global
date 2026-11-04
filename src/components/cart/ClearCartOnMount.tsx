'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cart'
import { trackStoreEvent } from '@/lib/analytics'

export function ClearCartOnMount({ transactionId }: { transactionId: string }) {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    const key = `supalovefoods-paid-cart-cleared:${transactionId}`
    try {
      if (window.sessionStorage.getItem(key)) return
    } catch (error) {
      console.error('Unable to check whether the paid cart was already cleared:', error)
    }

    clearCart()
    trackStoreEvent('purchase')
    try {
      window.sessionStorage.setItem(key, 'true')
    } catch (error) {
      console.error('Unable to record paid cart cleanup:', error)
    }
  }, [clearCart, transactionId])

  return null
}
