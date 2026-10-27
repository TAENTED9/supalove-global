# 05-admin-dashboard

### AppSidebar and AppHeader
- Purpose: Centralized admin navigation and mobile control shell.
- Source files: price-saver-frontend/src/layout/AppSidebar.tsx, price-saver-frontend/src/layout/AppHeader.tsx, price-saver-frontend/src/app/admin/(dashboard)/layout.tsx
- Markup + exact classes:

```tsx
<aside className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen z-50 transition-[width,transform] duration-300 ease-in-out ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
  <nav className="flex-1 overflow-y-auto no-scrollbar px-3">
    <Link className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${active ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`} href="/admin/users">
      <Users size={20} />
      <span className="flex-1 text-sm font-medium">Users</span>
    </Link>
  </nav>
</aside>
```

- State/data shape:
  - `isExpanded: boolean`
  - `isHovered: boolean`
  - `isMobileOpen: boolean`
  - `badges: { pendingVerifs: number, openReports: number }`
  - `pathname: string`
- Behavior & edge cases:
  - Sidebar collapses on desktop with hover/focus reveal; mobile uses slide-over drawer
  - Active nav links are path-prefix aware in admin surface
  - Badge counts should not force layout shift; keep min width fixed
- Supalove adaptation notes:
  - Replace marketplace-specific admin tabs with store- and inventory-centric structures: `Orders`, `Inventory`, `Customers`, `Content`, `Promotions`

### Overview stat cards and charts
- Purpose: Quick health checks and trend monitoring.
- Source files: price-saver-frontend/src/app/admin/(dashboard)/page.tsx
- Markup + exact classes:

```tsx
<div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3 xl:grid-cols-5">
  <Link className="group rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:border-brand-300 transition-colors" href="/admin/users">
    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-blue-600 bg-blue-50 dark:bg-blue-900/20">
      <Users className="h-5 w-5" />
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">Registered Students</p>
    <h4 className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">{value}</h4>
  </Link>
</div>
```

- State/data shape:
  - `stats.data: { registeredStudents, pendingVerifications, activeListings, openReports, newUsersToday }`
  - `monthly.data.months: Array<{ month, submissions, revenue }>`
- Behavior & edge cases:
  - Polling refreshes stats on a fixed cadence to reduce stale data
  - Chart bars show the max normalized height and have hover tooltips via `title`
  - Loading and error states are explicit, never blank
- Supalove adaptation notes:
  - Use store metrics: `customers`, `orders`, `live products`, `low stock`, `revenue`, `promo CTR`

### Data tables: filters, search, pagination, bulk actions, row actions
- Purpose: Operational admin tables for users, listings, reports, and verification queues.
- Source files: admin list pages under price-saver-frontend/src/app/admin/(dashboard)/**
- Markup + exact classes:

```tsx
<div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
    <input className="h-10 w-full max-w-xs rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
    <button className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white">Bulk action</button>
  </div>
</div>
```

- State/data shape:
  - `search: string`
  - `page: number`
  - `selectedRows: number[]`
  - `sortBy?: string`
  - `filters: Record<string, string>`
- Behavior & edge cases:
  - Show no-table placeholder and paging controls when there are zero rows
  - Row actions should be visually grouped and not overloaded with too many icons
  - Keep mobile responsive by converting table rows to stacked card layouts under smaller breakpoints
- Supalove adaptation notes:
  - Fit the store model: product list, order queue, customer support queue, inventory alerts

### Product create/edit form (image/video upload, drag-drop, reorder, validation, drafts)
- Purpose: A premium merchant workflow for product management.
- Source files: price-saver-frontend/src/app/seller/(dashboard)/listings/new/page.tsx, price-saver-frontend/src/components/seller/ListingVideoUploader.tsx
- Markup + exact classes:

```tsx
<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
  <input className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10" />
  <button className="mt-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-5 text-sm text-gray-500">Drop photos here</button>
</div>
```

- State/data shape:
  - `name`, `categoryId`, `description`, `price`, `quantity`, `location`, `photos`, `videos`, `draft`, `step`
  - `draftKey: string | null`
- Behavior & edge cases:
  - Autosave to localStorage with user-scoped draft key and 600ms debounce
  - Prevent publish without required fields and location or delivery info
  - Photo upload is file-type checked and limited to maximum count
  - Reorder cards or thumbnails in a lightweight way when there are multiple images
  - Loading and error states should be explicit; invalid state resets should be non-destructive
- Supalove adaptation notes:
  - Replace marketplace item semantics with food variants, ingredients, size, pack, and dietary flag fields
  - Keep drafts and autosave even for single-store operations where the merchant is high-volume

### Orders management and settings
- Purpose: Run store operations without leaking buyer flows into the admin shell.
- Source files: seller dashboard pages and admin settings pages under price-saver-frontend/src/app/seller/(dashboard)/** and price-saver-frontend/src/app/admin/(dashboard)/settings/**
- Markup + exact classes:

```tsx
<div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
  <h2 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">Store settings</h2>
</div>
```

- State/data shape:
  - `paymentPolicy`, `pickupPolicy`, `returnPolicy`, `availability`, `defaultDeliveryFee`, `notification preferences`
- Behavior & edge cases:
  - Save actions should optimistically display success and keep unsaved drafts separated from publish states
  - Settings forms should validate and surface block-level errors without abandoning typed data
- Supalove adaptation notes:
  - For a single-store business, settings should emphasize delivery windows, pickup instructions, and food safety policy rather than marketplace seller onboarding

### Auth guard pattern and what was wrong with it
- Purpose: Protect admin routes and set a safer access model.
- Source files: price-saver-frontend/src/app/admin/(dashboard)/layout.tsx, price-saver-frontend/src/context/AdminAuthContext.tsx
- State/data shape:
  - `isAuthenticated: boolean`
  - `isLoading: boolean`
  - `token: string | null`
- Behavior & edge cases:
  - Correct pattern: server-side or protected-layout gate with token verification before route render
  - Weak client-only gating is insufficient because users can bypass by tampering or direct route access
  - The right model is: token present + server verified + route-level permission enforcement + logout if invalid
- Supalove adaptation notes:
  - Use the same rule for admin and merchant dashboard access; never rely on client-only hide logic alone
