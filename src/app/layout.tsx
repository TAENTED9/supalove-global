import type { Metadata } from 'next'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import './globals.css'
import { StorefrontShell } from '@/components/layout/StorefrontShell'
import { ClientProviders } from '@/components/providers/ClientProviders'
import { CookieNotice } from '@/components/layout/CookieNotice'
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
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Premium Foodstuff Export, Wholesale & Retail`,
    description:
      'Buy verified Nigerian foodstuffs in bags, kg, and litres. Retail delivery & international export shipping.',
    images: ['/opengraph-image'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const socialProfiles = Object.values(siteConfig.socials).filter(Boolean)
  const organizationSchema = {
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
  const websiteSchema = {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.siteUrl}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [organizationSchema, websiteSchema],
            }).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased selection:bg-brand-500/20 selection:text-brand-600 flex flex-col min-h-screen">
        <ClientProviders>
          <StorefrontShell>{children}</StorefrontShell>
        </ClientProviders>
        <CookieNotice />
      </body>
    </html>
  )
}
