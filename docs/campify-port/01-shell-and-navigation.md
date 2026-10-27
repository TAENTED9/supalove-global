# 01-shell-and-navigation

### Navbar (desktop + mobile)
- Purpose: Global brand shell with search, account, fast category access, and storefront navigation.
- Source files: price-saver-frontend/src/components/layout/Navbar.tsx, price-saver-frontend/src/layout/AppHeader.tsx
- Markup + exact classes:

```tsx
<header className="sticky left-0 top-0 w-full z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
    <div className="flex items-center h-14 gap-2 md:gap-4">
      <Link href="/" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center shadow-md shadow-brand-500/20">
          <GraduationCap size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-black text-lg tracking-tight text-gray-900 dark:text-white hidden sm:block">
          Supalovefoods
        </span>
      </Link>

      <button className="flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
        <Menu size={14} />
        All Categories
        <ChevronDown size={13} className="transition-transform" />
      </button>

      <form className="hidden lg:flex flex-1 max-w-lg mx-4">
        <div className="relative w-full">
          <input
            name="q"
            type="search"
            placeholder="Search products, snacks, pantry…"
            className="w-full h-10 pl-4 pr-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all"
          />
          <button type="submit" className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center bg-brand-500 rounded-r-lg text-white hover:bg-brand-600 transition-colors">
            <Search size={16} />
          </button>
        </div>
      </form>
    </div>
  </div>
</header>
```

- State/data shape:
  - `drawerOpen: boolean`
  - `catOpen: boolean`
  - `avatarOpen: boolean`
  - `categories: Category[]`
  - `isAuthenticated: boolean`
  - `user.role: 'buyer' | 'seller' | null`
  - `pathname: string`
- Behavior & edge cases:
  - Close drawers on route change, outside click, escape behavior via click-outside listeners
  - Search is a form submit; when query is present, route to `/search?q=...`
  - Desktop categories dropdown fetches categories lazily on open
  - On mobile, slide-in drawer with overlay and sticky header; search modal opens from icon and closes on submit
  - Show wishlist/orders/cart only for buyer flows; hide seller-specific surfaces from buyer UI
- Supalove adaptation notes:
  - Replace Campify marketplace relative nav labels with single-shop equivalents: `Shop`, `Deals`, `Orders`, `Profile`, `Cart`
  - Remove seller messaging / community / trust-tier concepts from avatar menu

### BottomNav (tabs, safe-area, touch targets)
- Purpose: Mobile nav with clear primary destinations and touch-safe targets.
- Source files: price-saver-frontend/src/components/layout/BottomNav.tsx
- Markup + exact classes:

```tsx
<nav className="fixed bottom-0 left-0 right-0 z-[30] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden">
  <div className="flex items-center justify-around py-1.5">
    <Link className="relative flex flex-col items-center gap-0.5 py-2 px-3 min-w-[44px] min-h-[44px] justify-center text-brand-500 dark:text-brand-400" href="/">
      <Store size={20} />
      <span className="text-xs font-semibold">Shop</span>
    </Link>
  </div>
</nav>
```

- State/data shape:
  - `pathname`
  - `user.role`
  - `counts.messages` optional badge
- Behavior & edge cases:
  - Active tab is computed via prefix match with deliberate exclusion to prevent false positives
  - Badge count shows `9+` cap
  - Min height 44 ensures accessible touch targets
  - Mobile padding should account for safe area; same pattern as `pb-[70px]` for main content if fixed nav is used
- Supalove adaptation notes:
  - Replace `Market`, `Messages`, `Wishlist`, `Profile` with `Home`, `Menu`, `Cart`, `Orders`, `Account`
  - For single-business store, hide community/inbox nav unless support chat exists

### Footer
- Purpose: Store/brand summary, quick links, support/legal destinations.
- Source files: price-saver-frontend/src/components/storefront/Footer.tsx
- Markup + exact classes:

```tsx
<footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0 py-12">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
      <div>...</div>
    </div>
    <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Supalovefoods</p>
    </div>
  </div>
</footer>
```

- State/data shape:
  - `isAuthenticated`
- Behavior & edge cases:
  - Seller links are conditional; support and legal links stay static
  - Footer intentionally sits below main content with margin-top and no fixed positioning
- Supalove adaptation notes:
  - Replace campus-marketplace copy with grocery/food retail copy
  - Remove multi-seller and report item language; replace with `Delivery`, `FAQs`, `Privacy`, `Terms`

### ConditionalStorefrontWrapper logic
- Purpose: Use storefront shell only outside dashboard or admin surfaces.
- Source files: price-saver-frontend/src/components/layout/ConditionalStorefrontWrapper.tsx
- Markup + exact classes:

```tsx
<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
  <Navbar />
  <main className="pb-[70px] md:pb-0">{children}</main>
  <BottomNav />
  <Footer />
</div>
```

- State/data shape:
  - `pathname`
- Behavior & edge cases:
  - Skip storefront shell when path starts with `/dashboard`
  - Keep dashboard shells self-contained and avoid double navbars
- Supalove adaptation notes:
  - Apply same rule to `/account`, `/checkout`, and admin-panel routes if those are split by role

### Floating support widget
- Purpose: Support/help contact surface that sits above the fold without blocking key actions.
- Source files: price-saver-frontend/src/components/support/SupportSection.tsx
- Markup + exact classes:

```tsx
<div className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-white shadow-lg border border-gray-200 px-3 py-2">
  <MessageCircle size={18} className="text-brand-500" />
  <span className="text-sm font-medium text-gray-800">Need help?</span>
</div>
```

- State/data shape:
  - `variant: 'banner' | 'floating' | 'modal'`
  - `open: boolean`
- Behavior & edge cases:
  - Keep widget off mobile nav overlap by padding bottom spacing
  - Modal should have close button, keyboard-safe focus return, and accessible labels
- Supalove adaptation notes:
  - Replace “report item” and “message seller” flows with `Order help`, `Delivery help`, and `Product question`

### Page transitions and scroll restoration
- Purpose: Keep shell motion smooth while preventing jarring page resets.
- Source files: price-saver-frontend/src/app/(storefront)/page.tsx, src/components/layout/Navbar.tsx
- Markup + exact classes:

```tsx
className="transition-all duration-200 hover:-translate-y-0.5"
className="transition-transform duration-200"
```

- State/data shape:
  - `pathname` for route-change resets
  - `scroll` not stored globally in this implementation; prefer `window.scrollTo({ top: 0, behavior: 'smooth' })` on route change in app shell when needed
- Behavior & edge cases:
  - Nav link hover states and route transitions should feel lightweight but not jumpy
  - On mobile search drawer, avoid body scroll lock unless required; use overlay + fixed panel instead
- Supalove adaptation notes:
  - Keep transitions subtle: `duration-200` and `hover:-translate-y-0.5` with brand green/orange accent
