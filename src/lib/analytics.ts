'use client'

export type StoreEventName =
  | 'product_view'
  | 'add_to_cart'
  | 'search'
  | 'checkout_started'
  | 'purchase'

interface StoreEventDetails {
  productId?: string
  productSlug?: string
  queryLength?: number
}

export function trackStoreEvent(event: StoreEventName, details: StoreEventDetails = {}) {
  try {
    if (window.localStorage.getItem('supalovefoods-cookie-consent') !== 'all') return
  } catch (error) {
    console.error('Unable to read analytics consent:', error)
    return
  }

  const payload = JSON.stringify({ event, ...details })
  if (navigator.sendBeacon) {
    const queued = navigator.sendBeacon(
      '/api/analytics/events',
      new Blob([payload], { type: 'application/json' })
    )
    if (!queued) console.warn('Store analytics event could not be queued.')
    return
  }

  void fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).then((response) => {
    if (!response.ok) console.warn(`Store analytics event failed with status ${response.status}.`)
  }).catch((error: unknown) => {
    console.warn('Store analytics event request failed:', error)
  })
}
