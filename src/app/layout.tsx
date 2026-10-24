import type { Metadata } from 'next'
import '@fontsource/plus-jakarta-sans'
import './globals.css'
import { StorefrontShell } from '@/components/layout/StorefrontShell'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `${siteConfig.name} | Premium Foodstuff Export, Wholesale & Retail`,
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
  authors: [{ name: siteConfig.name }],
  metadataBase: new URL(siteConfig.siteUrl),
  icons: {
    icon: '/logo-mark.png',
    apple: '/logo-mark.png',
  },
  openGraph: {
    title: `${siteConfig.name} | Premium Foodstuff Export, Wholesale & Retail`,
    description:
      'Buy verified Nigerian foodstuffs in bags, kg, and litres. Retail delivery & international export shipping.',
    siteName: siteConfig.name,
    locale: 'en_NG',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const socialProfiles = Object.values(siteConfig.socials).filter(Boolean)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/logo-mark.png`,
    description: siteConfig.tagline,
    email: siteConfig.email,
    telephone: siteConfig.phoneIntl || siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressCountry: 'NG',
    },
    ...(socialProfiles.length > 0 && {
      sameAs: socialProfiles,
    }),
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-white text-slate-900 antialiased selection:bg-brand-green/20 selection:text-brand-green flex flex-col min-h-screen">
        <ClientProviders>
          <StorefrontShell>{children}</StorefrontShell>
        </ClientProviders>
      </body>
    </html>
  )
}
