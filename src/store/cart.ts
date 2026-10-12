'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  productId: string
  variantId: string
  qty: number
  // Snapshot for display (refreshed from server on cart/checkout load)
  name?: string
  label?: string
  price?: number // in kobo
  image?: string
  stock?: number
  sku?: string
  unit?: string
  slug?: string
}

type CartState = {
  items: CartItem[]
  isDrawerOpen: boolean
  isSyncing: boolean
  lastValidatedAt: number | null
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void
  removeItem: (variantId: string) => void
  updateQty: (variantId: string, qty: number) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  totalItems: () => number
  subtotal: () => number
  validateCart: () => Promise<{ success: boolean; hasStockIssues?: boolean }>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      isSyncing: false,
      lastValidatedAt: null,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.variantId === item.variantId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, qty: i.qty + (item.qty ?? 1) }
                  : i
              ),
              isDrawerOpen: true,
            }
          }
          return {
            items: [...state.items, { ...item, qty: item.qty ?? 1 }],
            isDrawerOpen: true,
          }
        })
      },

      removeItem: (variantId) =>
        set((state) => ({ items: state.items.filter((i) => i.variantId !== variantId) })),

      updateQty: (variantId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) => (i.variantId === variantId ? { ...i, qty } : i)),
        })),

      clearCart: () => set({ items: [] }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0),

      validateCart: async () => {
        const currentItems = get().items
        if (currentItems.length === 0) return { success: true }

        set({ isSyncing: true })
        try {
          const res = await fetch('/api/cart/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: currentItems.map((i) => ({
                productId: i.productId,
                variantId: i.variantId,
                qty: i.qty,
              })),
            }),
          })

          if (!res.ok) throw new Error('Validation failed')
          const data = await res.json()

          if (data.success && Array.isArray(data.items)) {
            set({
              items: data.items.map((item: CartItem & { lineTotal?: number }) => ({
                productId: item.productId,
                variantId: item.variantId,
                name: item.name,
                label: item.label,
                price: item.price,
                stock: item.stock,
                sku: item.sku,
                unit: item.unit,
                slug: item.slug,
                image: item.image || undefined,
                qty: item.qty,
              })),
              lastValidatedAt: Date.now(),
              isSyncing: false,
            })
            return { success: true, hasStockIssues: data.hasStockIssues }
          }
        } catch (err) {
          console.warn('Unable to sync live cart prices:', err)
        } finally {
          set({ isSyncing: false })
        }
        return { success: false }
      },
    }),
    {
      name: 'supalovefoods-cart',
      // Persist only variant keys and quantity; live prices are re-validated on load
      partialize: (state) => ({
        items: state.items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          qty: i.qty,
          name: i.name,
          label: i.label,
          price: i.price,
          unit: i.unit,
          sku: i.sku,
          image: i.image,
          slug: i.slug,
        })),
      }),
    }
  )
)
