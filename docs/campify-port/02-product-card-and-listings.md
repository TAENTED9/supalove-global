# 02-product-card-and-listings

### ProductCard
- Purpose: Primary storefront product tile with media, price, condition, seller, action affordances, and compact meta.
- Source files: price-saver-frontend/src/components/marketplace/ListingCard.tsx
- Markup + exact classes:

```tsx
<div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-950/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group h-full flex flex-col">
  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
    <Image src={thumb} alt={title} fill sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover object-center group-hover:scale-105 transition-transform duration-300" />
    <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${badge.className}`}>{badge.label}</span>
    <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
      <Zap size={9} className="fill-white" />
      {flashSaleLabel || `-${discountPct}%`}
    </span>
    <button className="absolute top-2 right-2 w-11 h-11 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center hover:scale-110 transition-all">
      <Heart size={14} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
    </button>
  </div>

  <div className="p-4 flex-1 flex flex-col">
    <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 leading-snug min-h-[2.6em] mb-1.5">{title}</h3>
    <div className="flex items-baseline gap-1.5 flex-wrap">
      <p className="text-lg font-black text-blue-600 dark:text-blue-400">{formatPrice(salePrice ?? price)}</p>
      {onSale && <span className="text-xs text-gray-400 line-through">{formatPrice(price)}</span>}
    </div>
    <div className="flex items-center gap-1.5 mt-2">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-[11px] font-black shrink-0">
        {initial}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">{sellerName}</span>
      {sellerVerified && <ShieldCheck size={12} className="text-blue-500" />}
    </div>
    <div className="flex items-center justify-between mt-auto pt-2">
      <span className="text-[11px] text-gray-400">{timeAgo(createdAt)}</span>
      <span className="flex items-center gap-1 text-[11px] text-gray-400"><Eye size={11} />{viewsCount}</span>
    </div>
  </div>
</div>
```

- State/data shape:
  - `id: string | number`
  - `title: string`
  - `price: number`
  - `condition: 'new' | 'fairly_used' | 'used'`
  - `imageUrl: string`
  - `sellerName: string`
  - `sellerVerified: boolean`
  - `createdAt: string`
  - `viewsCount?: number`
  - `isWishlisted?: boolean`
  - `flashSale?: boolean`
  - `salePrice?: number | null`
  - `isNegotiable?: boolean`
  - `showInterestButton?: boolean`
- Behavior & edge cases:
  - Single card is `Link` root; wishlist click must stop propagation; heart toggles optimistically
  - `salePrice < price` is the only condition that turns into a real discount; otherwise card shows single-price layout
  - Empty image falls back to `ShoppingBag` placeholder
  - clamp to 2 lines for title and 1-line seller name by truncation
- Supalove adaptation notes:
  - Swap `blue` CSS tokens for `brand.green` and `brand.orange`
  - Remove marketplace language such as `campus`, `seller`, `trust-tier`, `I'm Interested` if not needed; map to product + brand communication

### Listings grid and section headers
- Purpose: Consistent collection layout across homepage and search results.
- Source files: price-saver-frontend/src/components/marketplace/ListingsGrid.tsx, price-saver-frontend/src/components/storefront/TrendingSection.tsx, price-saver-frontend/src/components/storefront/FlashSalesSection.tsx
- Markup + exact classes:

```tsx
<section className="py-12 xl:py-15">
  <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 xl:px-8 2xl:px-0">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white xl:text-2xl">Trending on Campus</h2>
      <Link href="/search?sort=trending" className="text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">View all →</Link>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">...</div>
  </div>
</section>
```

- State/data shape:
  - `items: Price[]`
  - `loading: boolean`
  - `empty: boolean`
- Behavior & edge cases:
  - On empty state, render friendly empty section with icon and CTA
  - Use `ListingCardSkeleton` placeholders during load
  - Grid should not deform cards: give fixed 4:3 media area and `flex` card body
- Supalove adaptation notes:
  - Use `View all` with product category collection or deals page rather than generic marketplace filter

### Category strip / chips
- Purpose: Quick product browsing by category.
- Source files: price-saver-frontend/src/components/storefront/CategoriesSection.tsx
- Markup + exact classes:

```tsx
<div className="flex gap-2 overflow-x-auto pb-2">
  <button className="rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-colors">
    Snacks
  </button>
</div>
```

- State/data shape:
  - `categories: Category[]`
  - `activeCategoryId?: number`
- Behavior & edge cases:
  - Horizontal scroll on mobile; pill-style chips for low friction browsing
  - Keep selected state contrast with green/orange accent; show empty fallback if categories unavailable
- Supalove adaptation notes:
  - Replace campus categories with grocery / pantry / beverages / snacks / household / bakery

### Filters + sort (drawer on mobile)
- Purpose: Search refinement and ordering without overwhelming mobile screens.
- Source files: price-saver-frontend/src/app/(storefront)/search/page.tsx
- Markup + exact classes:

```tsx
<div className="flex items-center justify-between gap-2">
  <button className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700">
    <SlidersHorizontal size={14} /> Filters
  </button>
  <select className="appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white">
    <option value="newest">Newest</option>
    <option value="price_asc">Price: Low–High</option>
  </select>
</div>
```

- State/data shape:
  - `categoryId?: number`
  - `conditions: Condition[]`
  - `minPrice: string`
  - `maxPrice: string`
  - `locations: string[]`
  - `sort: 'newest' | 'price_asc' | 'price_desc' | 'most_viewed'`
- Behavior & edge cases:
  - Filter drawer uses slide-up panel on mobile; sidebar on desktop
  - Reset all clears state and resurfaces toggles
  - Price filters should ignore non-numeric or empty values; clamp min/max to > 0 expectations
- Supalove adaptation notes:
  - Replace seller location and trust-specific filters with delivery radius and product category, availability, and stock status

### Search (debounce, suggestions, empty results)
- Purpose: Fast, low-friction product discovery.
- Source files: price-saver-frontend/src/components/storefront/SearchBar.tsx, price-saver-frontend/src/hooks/useSearch.ts
- Markup + exact classes:

```tsx
<div className="relative w-full" ref={containerRef}>
  <input
    className="w-full h-10 pl-4 pr-11 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
  />
  <button className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center bg-brand-500 rounded-r-lg text-white">
    <Search size={16} />
  </button>
</div>
```

- State/data shape:
  - `params.q`
  - `suggestions: SearchSuggestion[]`
  - `suggesting: boolean`
  - `open: boolean`
  - `activeIndex: number`
  - `recents: RecentSearch[]`
- Behavior & edge cases:
  - Debounced suggestion fetch with `suggestDebounceMs: 150`
  - On keyboard nav, `ArrowUp`, `ArrowDown`, `Enter`, `Escape` are handled
  - Empty query shows recent searches; query with no matches still shows `Search for "..."` suggestion row
  - Search submit always available even with 0 suggestions
- Supalove adaptation notes:
  - Replace marketplace product names and seller names with food items and brand products; keep local favourites and recent searches

### Pagination vs infinite scroll
- Purpose: Browse results without overwhelming the user or overloading server responses.
- Source files: price-saver-frontend/src/app/(storefront)/search/page.tsx
- Markup + exact classes:

```tsx
<button className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-colors">Next</button>
```

- State/data shape:
  - `page: number`
  - `limit: number`
  - `hasMore: boolean`
  - `total: number`
- Behavior & edge cases:
  - In Campify search page, a classic paged list is used instead of infinite scroll for clarity
  - `total`, `skip`, and `limit` are tracked on server response
  - Empty results should preserve filter state while showing a zero-state block
- Supalove adaptation notes:
  - A paged list works well for grocery catalogs; infinite scroll is optional if the catalog is very large

### Skeletons, flash-sale countdown, image optimization
- Purpose: Improve perceived speed and maintain a premium shopping feel while loading.
- Source files: price-saver-frontend/src/components/marketplace/ListingCardSkeleton.tsx, price-saver-frontend/src/components/marketplace/FlashSaleTimer.tsx, price-saver-frontend/src/components/storefront/FlashSalesSection.tsx, price-saver-frontend/src/lib/cloudinary.ts
- Markup + exact classes:

```tsx
<div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden h-full flex flex-col">
  <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-800 animate-pulse" />
</div>
```

```tsx
<span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
  <Zap size={9} className="fill-white" /> 00:45:12
</span>
```

- State/data shape:
  - `remaining: { total, hours, minutes, seconds }`
  - `cover_media`, `cover_media_kind`, `discount_pct`
- Behavior & edge cases:
  - Countdown updates every second; expired items disappear from active list
  - video thumbnails use `cover_media_kind === 'video_thumb'` before the main image is loaded
  - `Image` uses `sizes` and `thumbnailImage`/`optimizeImage` to keep responsive performance
- Supalove adaptation notes:
  - Flash-sale styling should be brand-orange accents in a retail tone, not emergency red-only patterns
  - Product image strategy should prioritize food photography with center-crop behavior and 4:3 media framing
