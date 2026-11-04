import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Tracking | Supalovefoods',
  description: 'Verify your order email to view Supalovefoods payment and fulfillment status.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
  return children
}
