import type { Metadata } from 'next'
import '@fontsource/plus-jakarta-sans'
import './globals.css'
import { StorefrontShell } from '@/components/layout/StorefrontShell'
import { ClientProviders } from '@/components/providers/ClientProviders'

export const metadata: Metadata = {
  title: 'Supalovefoods | Premium Foodstuff Export, Wholesale & Retail',
  description:
    'Authentic Nigerian foodstuffs, bulk grains, pure palm oil, legumes, root crops, and agricultural commodities. Available for retail nationwide delivery and worldwide export containers.',
  keywords: [
    'foodstuffs Nigeria',
    'Nigerian rice 50kg bag',
    'pure red palm oil export',
    'beans oloyin wholesale',
    'Ijebu garri export',
    'foodstuff export wholesale',
    'agricultural commodities Nigeria',
  ],
  authors: [{ name: 'Supalovefoods Limited' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Supalovefoods | Premium Foodstuff Export, Wholesale & Retail',
    description:
      'Buy verified Nigerian foodstuffs in bags, kg, and litres. Retail delivery & international export shipping.',
    siteName: 'Supalovefoods',
    locale: 'en_NG',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-900 antialiased selection:bg-brand-green/20 selection:text-brand-green flex flex-col min-h-screen">
        <ClientProviders>
          <StorefrontShell>{children}</StorefrontShell>
        </ClientProviders>
      </body>
    </html>
  )
}
