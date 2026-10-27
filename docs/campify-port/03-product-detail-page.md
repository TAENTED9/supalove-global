# 03-product-detail-page

### Product detail page (5-col gallery + sticky buy box)
- Purpose: Conveys product trust, detail, and conversion in a single, premium product page.
- Source files: price-saver-frontend/src/app/(storefront)/listing/[id]/page.tsx
- Markup + exact classes:

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0 py-6 lg:py-8">
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.2fr_1fr]">
    <section className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">...</div>
      </div>
      <div className="grid grid-cols-4 gap-2">...</div>
    </section>

    <aside className="lg:sticky lg:top-20 h-fit">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-500">Best Seller</div>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-gray-900 dark:text-white">{listing.name}</h1>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-black text-brand-600 dark:text-brand-400">{formatPrice(listing.price)}</span>
          <span className="text-sm text-gray-400 line-through">{formatPrice(listing.price)}</span>
        </div>
        <button className="mt-5 w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600 transition-colors">Add to cart</button>
      </div>
    </aside>
  </div>
</div>
```

- State/data shape:
  - `listing: ListingDetail | null`
  - `similar: ListingDetail[]`
  - `currentImageIndex: number`
  - `isGalleryAutoPlaying: boolean`
  - `isVideoPlaying: boolean`
  - `wishlisted: boolean`
  - `followState: FollowStatus | null`
  - `inquiryOpen: boolean`
  - `reportOpen: boolean`
  - `videoViewerUrl: string | null`
- Behavior & edge cases:
  - Gallery uses autoplay with “skip video frames” logic so videos do not auto-rotate inside the same cycle
  - Manual thumbnail selection pauses autoplay and resumes later
  - Lightbox viewer opens for video; product page also supports report and inquiry modals
  - Product page fetches similar items by listing ID and supports slug route handling
  - `recordView` is called once on load; safe to retry with `catch(() => {})`
- Supalove adaptation notes:
  - Replace `seller` and `follow` copy with `brand` and `daily staple` / `delivery coverage` visual cues
  - Remove marketplace trust-tier and “I’m Interested” CTA if not needed; use `Add to basket`, `Buy now`, `Ask about delivery`

### Gallery (thumbnails, autoplay, lightbox)
- Purpose: Present product photography/video with premium preview behavior.
- Source files: price-saver-frontend/src/app/(storefront)/listing/[id]/page.tsx
- Markup + exact classes:

```tsx
<div className="flex gap-2 overflow-x-auto">
  {galleryMediaUrls.map((item, idx) => (
    <button className={`relative h-20 w-20 overflow-hidden rounded-xl border ${idx === currentImageIndex ? 'border-brand-500' : 'border-gray-200'}`}>
      {isVideoUrl(item) ? <Play className="absolute inset-0 m-auto" /> : null}
    </button>
  ))}
</div>
```

- State/data shape:
  - `galleryMediaUrls: string[]`
  - `isVideoUrl(url)` helper
- Behavior & edge cases:
  - Video URLs are recognized by extension and converted to `.jpg` thumbnails when necessary
  - `tryAutoplayWithFallback` handles muted autoplay restrictions on mobile
  - Lightbox viewer uses `z-50` overlay and closes on outside click or close button
- Supalove adaptation notes:
  - Food product galleries benefit from high-contrast hero shots and thumbnail strip; avoid too many media items if the product is simple

### Buy box and sticky CTA behavior
- Purpose: Create immediate conversion intent while preserving layout stability.
- Source files: same as above
- Markup + exact classes:

```tsx
<aside className="lg:sticky lg:top-20 h-fit">
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-brand-500">Fresh today</span>
    </div>
    <button className="mt-5 w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600 transition-colors">Add to cart</button>
    <button className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Buy now</button>
  </div>
</aside>
```

- State/data shape:
  - `listing.stock`, `listing.availability`, `listing.delivery`, `listing.price`
- Behavior & edge cases:
  - Sticky aside should not cover content on small mobile; the CTA may move to a bottom sticky bar on very small screens
  - Buttons should remain accessible and keyboard reachable with visible focus ring
- Supalove adaptation notes:
  - Single-business flow may unify `Add to cart` + `Buy now` into a single conversion CTA, with `Save for later` if desired

### Description card and similar products
- Purpose: Provide reassurance and product context while increasing downstream conversion.
- Source files: same page 
- Markup + exact classes:

```tsx
<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Description</h3>
  <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">{listing.description}</p>
</div>
```

- State/data shape:
  - `listing.description`
  - `listing.location`, `listing.condition`, `listing.added_at`
  - `similar: ListingDetail[]`
- Behavior & edge cases:
  - Similar products should show at least 3 cards in a rail or grid
  - If product has no description, show empty state with “No product details yet”
- Supalove adaptation notes:
  - Avoid seller “profile” obsession; emphasize product freshness, ingredients, delivery windows, and storage info

### Back button, SEO metadata, JSON-LD
- Purpose: Good navigation and crawlability for product pages.
- Source files: `src/app/(storefront)/listing/[id]/page.tsx` plus Next metadata patterns in homepage and app route metadata
- Markup + exact classes:

```tsx
<button className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
  <ArrowLeft size={14} /> Back to shopping
</button>
```

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Organic Dried Mango",
  "brand": { "@type": "Brand", "name": "Supalovefoods" },
  "offers": { "@type": "Offer", "priceCurrency": "NGN", "price": "3500" }
}
```

- State/data shape:
  - dynamic metadata for title, description, image, canonical URL
- Behavior & edge cases:
  - Use server metadata when available; ensure OG image and canonical URL are set for search and social previews
  - JSON-LD should be product-scoped and valid
- Supalove adaptation notes:
  - Update schema to grocery/food product metadata rather than marketplace resell item metadata
