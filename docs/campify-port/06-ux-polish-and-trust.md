# 06-ux-polish-and-trust

### Toasts, confirmations, modals, bottom sheets
- Purpose: Small feedback moments that make the app feel trustworthy and high-quality.
- Source files: price-saver-frontend/src/components/ui/Toast.tsx, price-saver-frontend/src/components/ui/Modal.tsx, price-saver-frontend/src/components/ui/ConfirmModal.tsx, price-saver-frontend/src/app/(storefront)/dashboard/orders/page.tsx
- Markup + exact classes:

```tsx
<div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end">
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-semibold bg-green-500 animate-in slide-in-from-right-8 duration-200">
    Saved successfully
  </div>
</div>
```

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6">...</div>
</div>
```

- State/data shape:
  - `toasts: ToastItem[]`
  - `open: boolean`
  - `confirmAction?: () => void`
- Behavior & edge cases:
  - Toasts auto-dismiss after 4s; destructive actions should require confirmation
  - Bottom sheets should be full-width mobile-first with large touch targets
  - Modal close buttons and focus return need to be accessible and predictable
- Supalove adaptation notes:
  - Swap “report item” flows for `Remove item`, `Clear cart`, `Cancel order`, `Confirm delivery`

### Empty states, loading skeletons, error boundaries
- Purpose: Keep the app from feeling broken when data is absent or delayed.
- Source files: price-saver-frontend/src/components/marketplace/ListingCardSkeleton.tsx, price-saver-frontend/src/app/(storefront)/dashboard/wishlist/page.tsx, price-saver-frontend/src/app/(storefront)/search/page.tsx
- Markup + exact classes:

```tsx
<div className="rounded-2xl border border-gray-200 bg-white p-16 text-center dark:border-gray-800 dark:bg-white/[0.03]">
  <Heart size={32} className="mx-auto mb-4 text-gray-400" />
  <p className="font-bold text-lg text-gray-800 dark:text-white">Your wishlist is empty</p>
</div>
```

- State/data shape:
  - `loading: boolean`
  - `error: Error | null`
  - `empty: boolean`
- Behavior & edge cases:
  - Show dedicated skeletons for list cards, stats, and data tables
  - Error states should be actionable: retry, back, or clear filters
  - Use repeating placeholders with consistent card sizes to prevent layout jumps
- Supalove adaptation notes:
  - For a food store, empty-state copy should focus on “No products yet”, “No deals available”, “No orders yet” rather than peer-marketplace copy

### 404, onboarding, tooltips, support widget
- Purpose: Reduce friction and provide guidance when users don’t know what to do next.
- Source files: support pages, help center, homepage guest blocks, support widget patterns
- Markup + exact classes:

```tsx
<div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
  <h1 className="text-4xl font-black text-gray-900 dark:text-white">404</h1>
  <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">This page cannot be found.</p>
</div>
```

- State/data shape:
  - `tourStep`, `showTooltip`, `dismissed` booleans
- Behavior & edge cases:
  - Onboarding should be optional and dismissible
  - Tooltips should not block essential checkout actions; prefer inline hints or static labels
  - Support widget should remain accessible via keyboard and not trap focus
- Supalove adaptation notes:
  - Use a “Need help with delivery?” or “Need allergy info?” support flow rather than seller/dispute help language

### Accessibility and form validation patterns
- Purpose: Ensure interactions are accessible and reduce user errors.
- Source files: seller form patterns and input components
- Markup + exact classes:

```tsx
<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Price</label>
<input className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10" />
<p className="mt-1 text-xs text-red-500">Price must be greater than zero.</p>
```

- State/data shape:
  - `dirty`, `touched`, `errors`, `submitted`
- Behavior & edge cases:
  - Use keyboard accessible buttons and visible `focus-visible:ring-2 focus-visible:ring-brand-500`
  - Validation should appear inline and in a consistent color hierarchy
  - Avoid hiding focus ring on custom controls
- Supalove adaptation notes:
  - Validation should emphasize price, stock, dietary labels, and ingredients fields for food products

### Micro-interactions, animations, PWA, notifications
- Purpose: Create a premium feel without using heavy motion or janky transitions.
- Source files: design tokens, homepage sections, floating widgets, service worker config if present in project
- Markup + exact classes:

```tsx
className="transition-all duration-200 hover:-translate-y-0.5"
className="animate-pulse-soft"
```

- State/data shape:
  - `prefersReducedMotion` if implemented
- Behavior & edge cases:
  - Use 200ms to 300ms transitions; keep linear motion small and clean
  - Respect reduced motion preferences in PWA and motion-heavy surfaces
  - Notification badges should be subtle and not overwhelming
- Supalove adaptation notes:
  - For food retail, use warm orange highlight cues and green success accents; avoid aggressive blue-heavy branding

### Cookie consent and policies
- Purpose: Explain privacy, data handling, and consent to maintain trust and compliance.
- Source files: support/legal pages plus `Footer` links, site config patterns
- Markup + exact classes:

```tsx
<div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 shadow-xl dark:bg-gray-900">
  <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
    <p className="text-sm text-gray-600 dark:text-gray-300">We use cookies to remember your preferences.</p>
    <div className="flex gap-2">
      <button className="btn-ghost">Manage</button>
      <button className="btn-primary">Accept</button>
    </div>
  </div>
</div>
```

- Behavior & edge cases:
  - Consent should be dismissible and low-friction
  - Policy pages should be easy to scan, with sectioned headers and plain-English language
- Supalove adaptation notes:
  - Replace generic campus marketplace language with food safety, allergy, and delivery-data wording
