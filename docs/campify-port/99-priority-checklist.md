# 99-priority-checklist

| Feature name | Exists in Campify (file paths) | Applies to Supalove? (Yes/No/Adapt) | Effort S/M/L | Impact on perceived quality H/M/L | Dependencies |
|---|---|---:|---:|---:|---|
| Product detail page gallery + sticky buy box | price-saver-frontend/src/app/(storefront)/listing/[id]/page.tsx | Adapt | M | H | Product model, image pipeline, cart state |
| ProductCard + grid system | price-saver-frontend/src/components/marketplace/ListingCard.tsx, price-saver-frontend/src/components/marketplace/ListingsGrid.tsx | Yes | S | H | Product data, image CDN |
| Navbar + mobile shell | price-saver-frontend/src/components/layout/Navbar.tsx, price-saver-frontend/src/layout/AppHeader.tsx | Yes | S | H | Routing, auth state |
| Search suggestions + results page | price-saver-frontend/src/components/storefront/SearchBar.tsx, price-saver-frontend/src/app/(storefront)/search/page.tsx | Yes | M | H | Search API, filters |
| Design tokens and color system | price-saver-frontend/src/app/globals.css | Adapt | S | H | Tailwind config |
| BottomNav mobile nav | price-saver-frontend/src/components/layout/BottomNav.tsx | Yes | S | H | Auth + route policy |
| Filter + sort drawer | price-saver-frontend/src/app/(storefront)/search/page.tsx | Yes | M | H | Filter API, mobile shell |
| Empty/loading/error states | price-saver-frontend/src/components/marketplace/ListingCardSkeleton.tsx, price-saver-frontend/src/app/(storefront)/dashboard/wishlist/page.tsx | Yes | S | H | Content/data APIs |
| Toast + modal primitives | price-saver-frontend/src/components/ui/Toast.tsx, price-saver-frontend/src/components/ui/Modal.tsx | Yes | S | H | State provider |
| Flash sales + countdown | price-saver-frontend/src/components/storefront/FlashSalesSection.tsx | Adapt | M | H | Sales data, countdown utility |
| Footer + legal/support links | price-saver-frontend/src/components/storefront/Footer.tsx | Adapt | S | M | Support pages |
| Product create/edit form with drafts | price-saver-frontend/src/app/seller/(dashboard)/listings/new/page.tsx | Adapt | M | H | Upload API, validation |
| Admin overview dashboard | price-saver-frontend/src/app/admin/(dashboard)/page.tsx | Adapt | M | H | Admin auth, polling |
| Sidebar + mobile admin header | price-saver-frontend/src/layout/AppSidebar.tsx, price-saver-frontend/src/layout/AppHeader.tsx | Adapt | S | H | Sidebar context |
| Orders list + status tabs | price-saver-frontend/src/app/(storefront)/dashboard/orders/page.tsx | Yes | M | H | Order API, status model |
| Product image optimization strategy | price-saver-frontend/src/lib/cloudinary.ts, price-saver-frontend/src/components/marketplace/ListingCard.tsx | Yes | S | H | CDN, image pipeline |
| SEO metadata + OG images | price-saver-frontend/src/app/(storefront)/page.tsx | Yes | S | H | Next metadata, asset pipeline |
| Support widget + help surfaces | price-saver-frontend/src/components/support/SupportSection.tsx | Adapt | S | M | Contact/support routes |
| Cart drawer + quantity stepper | price-saver-frontend/src/components/ui/QuantityInput.tsx, cart patterns in storefront shell | Adapt | M | H | Cart state store |
| Consent + policy pages | price-saver-frontend/src/app/(storefront)/terms/page.tsx, privacy pages | Yes | S | M | Legal copy |
| Admin data tables + filters | price-saver-frontend/src/app/admin/(dashboard)/users/page.tsx, reports pages | Adapt | M | H | API list endpoints |
| App auth guard pattern | price-saver-frontend/src/app/admin/(dashboard)/layout.tsx | Yes | S | H | Auth provider, server validation |
| Category chips and browsing | price-saver-frontend/src/components/storefront/CategoriesSection.tsx | Yes | S | H | Category taxonomy |
| Page transition polish | price-saver-frontend/src/components/layout/ConditionalStorefrontWrapper.tsx | Yes | S | M | Routing shell |
| Scroll restoration and mobile search overlay | price-saver-frontend/src/layout/AppHeader.tsx | Yes | S | M | Search route, nav |
| Similar products rail | price-saver-frontend/src/app/(storefront)/listing/[id]/page.tsx | Yes | S | M | Product recommendations |
| Admin settings screens | price-saver-frontend/src/app/seller/(dashboard)/settings/page.tsx, admin settings pages | Adapt | M | M | Settings API |
| Security headers / CSP / rate limiting | backend config not shown here | Yes | M | H | API gateway, server config |
| Analytics events and dashboards | price-saver-frontend/src/app/admin/(dashboard)/page.tsx | Yes | M | H | event schema |
| Checkout / payment UX | store policy + order flow patterns | Adapt | L | H | payment gateway, gateway integration |
| Wishlist feature | price-saver-frontend/src/app/(storefront)/dashboard/wishlist/page.tsx | Adapt | S | M | user auth |
| Follow / storefront profile concept | price-saver-frontend/src/app/(storefront)/listing/[id]/page.tsx | Skip | S | L | Marketplace-only concept |
| Seller verification and trust tier system | Campify seller verification flows | Skip | M | L | Marketplace-only concept |
| Messages / inbox | price-saver-frontend/src/app/seller/(dashboard)/inbox/page.tsx | Skip | M | M | Marketplace social feature |
| Reports / moderation screens | price-saver-frontend/src/app/admin/(dashboard)/reports/page.tsx | Skip | M | L | Single-brand store does not need marketplace reports |
| Reports on listings / trust complaints | item report flows | Adapt | S | M | Support flow |
| Nearby sellers / geo discovery | price-saver-frontend/src/components/storefront/FindNearbySellersSection.tsx | Skip | M | L | Marketplace concept |
| Featured sellers / brands section | price-saver-frontend/src/components/storefront/FeaturedSellersSection.tsx | Skip | S | L | Marketplace only |
| Buyer/seller dual role structure | price-saver-frontend/src/components/layout/Navbar.tsx | Adapt | M | M | Single business model |
| Community / posts / announcements | price-saver-frontend/src/components/storefront/HomepageAnnouncements.tsx | Adapt | M | L | Store content blog |
| Chat + DM flows | price-saver-frontend/src/components/chat/** | Skip | M | M | Marketplace social feature |
| Review system | price-saver-frontend/src/components/reviews/ReviewsSection.tsx | Adapt | M | H | Rating / trust model |
| Seller settings: payment policy / pickup policy | price-saver-frontend/src/app/seller/(dashboard)/settings/page.tsx | Adapt | M | H | Store policies |
| Draft autosave | price-saver-frontend/src/app/seller/(dashboard)/listings/new/page.tsx | Yes | S | H | Local draft state |
| Bulk actions in admin tables | admin list pages | Adapt | M | H | permissions model |
| Notification center | price-saver-frontend/src/components/header/NotificationDropdown.tsx | Yes | M | H | event feed |
| Revalidate strategy and content freshness | price-saver-frontend/src/app/(storefront)/page.tsx | Yes | S | H | caching layer |
| Performance skeletons and semantic image sizes | ListingCard, SearchBar, Home sections | Yes | S | H | CDN and Next.js |
| Cookie banner | not fully isolated; support/legal pages show consent patterns | Yes | S | M | legal/compliance |
| Accessibility focus rings | global CSS + multiple form components | Yes | S | H | design system |
| Reduced-motion handling | implied in design patterns | Yes | S | M | motion tokens |
| PWA shell and manifest | not obviously present in Campify visible frontend | Adapt | M | M | service worker setup |
| Input validation and inline error messaging | seller form and settings pages | Yes | S | H | form library |
| Logging and monitoring pipeline | admin event feed + backend tasks | Yes | M | H | Sentry / observability |
| Structured data (Product) | detail page patterns | Yes | S | H | schema generator |
| Sitemap/robots generation | next-sitemap config in frontend | Yes | S | H | build pipeline |
| Social proof: count of orders, reviews, trust badges | store review/trust patterns | Adapt | S | H | review pipeline |
| Support/help centre | price-saver-frontend/src/app/(storefront)/help/page.tsx | Yes | S | M | FAQ content |
| Admin moderation and user suspension | admin users pages | Adapt | M | H | RBAC |
| Deal/flash sales landing page | price-saver-frontend/src/app/(storefront)/deals/page.tsx | Yes | M | H | promotional model |
| New arrivals / trending rails | price-saver-frontend/src/components/storefront/NewArrivalsSection.tsx, TrendingSection.tsx | Yes | S | H | catalog API |
| Category selection with dropdown | Navbar category menu | Yes | S | M | category model |
| Dashboard order cancel flow | price-saver-frontend/src/app/(storefront)/dashboard/orders/page.tsx | Yes | S | H | order state |
| Lightbox video viewer | price-saver-frontend/src/app/(storefront)/listing/[id]/page.tsx | Adapt | M | H | media pipeline |
| Shipping/delivery info card | listing detail and seller policy pages | Adapt | S | H | fulfillment model |
| Contact/support email and legal links | Footer + support pages | Yes | S | M | brand/legal content |
| Single-page product rail sections | homepage component sections | Yes | S | H | layout components |
| Admin auth + role scoping | admin auth context and routes | Yes | S | H | auth service |
| Badge counts and notifications | notification dropdown and side menu badges | Yes | M | H | event aggregation |
| Mobile search overlay | AppHeader | Yes | S | H | search UX |
| Storefront wrapper logic | ConditionalStorefrontWrapper.tsx | Yes | S | H | route config |
| Floating support badge | support section patterns | Yes | S | M | support channel |
| Recommendation engine and similar products | listing detail | Yes | M | M | product graph |
| Bulk stock / product moderation tools | seller admin pages | Adapt | M | H | product ops |
| Local storage persistence patterns | draft autosave + recent search | Yes | S | H | browser storage |
| Role-specific nav rules | buyer/seller/admin shell differences | Adapt | S | H | auth roles |
| Backup / failure fallbacks | empty states and error handlers | Yes | S | H | app resilience |
