# 07-seo-perf-security

### Metadata patterns, OG images, JSON-LD
- Purpose: Better discoverability, social previews, and structured commerce data.
- Source files: price-saver-frontend/src/app/(storefront)/page.tsx, product detail page metadata patterns, site config metadata
- Markup + exact classes:

```ts
export const metadata: Metadata = {
  title: 'Supalovefoods | Fresh groceries from your neighbourhood',
  description: 'Shop fresh food staples, drinks, and pantry essentials.',
  openGraph: { title: 'Supalovefoods', description: 'Fresh groceries and essentials.', images: [{ url: '/og-image.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'Supalovefoods', images: ['/og-image.png'] },
  alternates: { canonical: 'https://www.supalovefoods.com' },
};
```

- State/data shape:
  - `metadata.title`, `description`, `keywords`, `openGraph`, `twitter`, `robots`
- Behavior & edge cases:
  - Keep page titles unique and product-specific
  - Add canonical URLs and image alt text to every product page
  - Use `Product` JSON-LD for product pages, `WebSite`/`Organization` for home
- Supalove adaptation notes:
  - Use food and brand language instead of campus marketplace terminology

### Sitemap, robots, canonical strategy
- Purpose: Control indexing and improve SEO discoverability.
- Source files: Next.js route metadata conventions; project uses `next-sitemap.config.js` in `price-saver-frontend/`
- Markup + exact classes:

```js
module.exports = {
  siteUrl: 'https://www.supalovefoods.com',
  generateRobotsTxt: true,
  exclude: ['/admin/*', '/dashboard/*'],
};
```

- Behavior & edge cases:
  - Block private or admin routes
  - Keep `robots.txt` and sitemap deployment automated in CI/CD or hosting webhook
- Supalove adaptation notes:
  - Exclude account, checkout, and admin routes; only keep public storefront pages

### Caching, revalidate, CDN, image configuration
- Purpose: Reduce TTFB and improve visual performance.
- Source files: `src/app/(storefront)/page.tsx` uses `revalidate = 60`, Cloudinary optimization helpers, `next.config.ts`
- State/data shape:
  - `revalidate` value in page modules
  - `Image` `sizes` and `quality` values
- Behavior & edge cases:
  - Revalidate shopping pages at a short cadence; lower for static or home pages
  - Use CDN-optimized image transformations and lazy-load non-critical media
  - Keep product imagery center-cropped to a stable 4:3 aspect ratio
- Supalove adaptation notes:
  - Food photography benefits from CDN quality tuning and tight compression rules

### Bundle performance tricks and critical rendering
- Purpose: Keep product pages and storefront fast on mid-range devices.
- Source files: storefront section components and product detail page patterns
- Behavior & edge cases:
  - Use `Image` component, not unoptimized background images; keep heavy media off initial viewport
  - Lazy-load non-critical component sections; defer heavy widgets like reviews or search suggestions
  - Keep skeletons consistent with final card structure so layout shift is minimal
  - Combine route-level code splitting with small utility modules
- Supalove adaptation notes:
  - For a smaller single-business app, performance is easier to maintain than for a marketplace; keep product catalog compact and polished

### Security headers, CSP, rate limiting, input validation, CORS
- Purpose: Prevent abuse and keep front-end and API interactions safe.
- Source files: backend config and security patterns, not visible in frontend only
- Behavior & edge cases:
  - Use strict CSP with `default-src 'self'`, allowed image/CDN hosts, and script sources
  - Add X-Frame-Options and Referrer-Policy headers
  - Validate request payloads on server; reject invalid price, email, and file uploaded content
  - Add rate limiting around login, search, and public APIs
  - CORS should be restricted to known origins and never wildcard for authenticated flows
- Supalove adaptation notes:
  - Keep the same rules; single business still needs security posture, but less permission complexity than a marketplace

### Logging, monitoring, analytics events
- Purpose: Make failures visible and store performance metrics.
- Source files: app-level patterns, analytics hooks, admin dashboard event feed
- State/data shape:
  - `event_type`, `created_at`, `user_email`, `metadata`
- Behavior & edge cases:
  - Log cart events, search queries, checkout progress, and product view events
  - Keep both product analytics and operational alerts separate
  - Add Sentry or equivalent error boundary for client exceptions and server monitor alerts for 500s
- Supalove adaptation notes:
  - For single-brand retail, analytics should focus on conversion funnel: view → add to cart → checkout → purchase

### Security and privacy bubble
- Purpose: Shopping site trust requires strong privacy and safety standards.
- Behavior & edge cases:
  - Hide sensitive user details in logs
  - Never expose full auth tokens or secrets in client code or public markup
  - Keep API keys in `.env` or secure secret manager, never in repo or compiled bundle
  - Add clear policy links and privacy language in footer and cookie banner
- Supalove adaptation notes:
  - This is even more important for food retail because allergy, freshness, and order data are time-sensitive and customer-sensitive
