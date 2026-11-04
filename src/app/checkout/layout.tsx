import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | Supalovefoods',
  description: 'Complete your Supalovefoods order using secure Flutterwave checkout.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
