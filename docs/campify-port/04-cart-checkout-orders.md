# 04-cart-checkout-orders

### Cart drawer / cart page
- Purpose: Keep basket context visible and easy to edit without leaving the store surface.
- Source files: Campify cart patterns are spread across dashboard orders and checkout interactions; actual cart UI is not isolated as a single file in this codebase, but the expected UX pattern is implied by order drawers and quantity inputs.
- Markup + exact classes:

```tsx
<div className="fixed right-0 top-0 z-40 h-full w-full max-w-md bg-white shadow-xl border-l border-gray-200 dark:border-gray-800 dark:bg-gray-900">
  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your cart</h3>
    <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"> <X size={16} /> </button>
  </div>
  <div className="space-y-3 p-4">
    <div className="flex gap-3 rounded-2xl border border-gray-200 p-3 dark:border-gray-800">
      <div className="h-16 w-16 rounded-xl bg-gray-100" />
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-800 dark:text-white">Product name</p>
        <p className="text-xs text-gray-500">₦ 2,500</p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700">
            <button className="h-8 w-8 text-lg">−</button>
            <span className="w-8 text-center text-sm font-semibold">1</span>
            <button className="h-8 w-8 text-lg">+</button>
          </div>
          <button className="text-xs font-semibold text-red-500">Remove</button>
        </div>
      </div>
    </div>
  </div>
  <div className="border-t border-gray-200 p-4 dark:border-gray-800">
    <div className="mb-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300"><span>Subtotal</span><span>₦ 2,500</span></div>
    <button className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white hover:bg-brand-600">Checkout</button>
  </div>
</div>
```

- State/data shape:
  - `items: CartItem[]`
  - `open: boolean`
  - `subtotal: number`
  - `shipping: number`
  - `total: number`
  - `voucher?: string`
- Behavior & edge cases:
  - Quantity stepper should clamp at minimum 1 and max stock count
  - Persist cart in local storage or Zustand store; restore on app reload
  - Remove item should update subtotal immediately and empty-state should appear when cart count is 0
  - Delivery and pickup variations should be surfaced before checkout
- Supalove adaptation notes:
  - Convert seller-based negotiation flows to single-store cart without marketplace messaging
  - Replace unneeded `I'm Interested`/`meetup` semantics with a food-specific checkout flow

### Quantity stepper and persisted state
- Purpose: Fast item editing with minimal friction and state persistence.
- Source files: price-saver-frontend/src/components/ui/QuantityInput.tsx, seller product forms use `QuantityInput`
- Markup + exact classes:

```tsx
<div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
  <button className="h-10 w-10 text-lg text-gray-500 hover:text-gray-800">−</button>
  <span className="w-10 text-center text-sm font-semibold text-gray-800 dark:text-white">{qty}</span>
  <button className="h-10 w-10 text-lg text-gray-500 hover:text-gray-800">+</button>
</div>
```

- State/data shape:
  - `value: number`
  - `min?: number`
  - `max?: number`
  - `onChange: (next: number) => void`
- Behavior & edge cases:
  - Prevent invalid values and disable minus button at min
  - persist item count with stable cart key to support logout and refresh
  - show `Out of stock` visually if item count exceeds inventory limits
- Supalove adaptation notes:
  - For food products, use stock count, freshness windows, and pickup windows to inform quantity selection

### Order list + detail + status badges
- Purpose: Give shoppers a clear purchase history and visibility over current status.
- Source files: price-saver-frontend/src/app/(storefront)/dashboard/orders/page.tsx
- Markup + exact classes:

```tsx
<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
  Pending
</span>
```

- State/data shape:
  - `Order { id, uuid, status, listing_name, listing_price, meetup_location, created_at, seller_name }`
- Behavior & edge cases:
  - Status tabs: `All`, `Pending`, `Met Up`, `Completed`, `Cancelled`
  - Cancel button is shown only for pending orders
  - Empty orders list uses call-to-action to shop
- Supalove adaptation notes:
  - Replace “met up” semantics with “Pickup / Delivered / Completed” depending on store model
  - For single-store operations, status timeline likely reduces to `Order placed`, `Preparing`, `Ready for pickup`, `Completed`

### Tracking UI, payment flow UX, success/failure pages
- Purpose: Reduce uncertainty and reassure the customer during fulfillment and payment.
- Source files: order list patterns + product/checkout interactions in same storefront flow; includes payment support language in store policy pages and `SupportSection`
- Markup + exact classes:

```tsx
<div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
    <CheckCircle2 size={18} />
  </div>
  <div>
    <p className="text-sm font-semibold text-gray-900 dark:text-white">Order confirmed</p>
    <p className="text-xs text-gray-500">Payment approved and store has received your order.</p>
  </div>
</div>
```

- State/data shape:
  - `paymentStatus: 'idle' | 'pending' | 'success' | 'failed'`
  - `orderStatus: string`
  - `trackingSteps: Array<{ label, complete }>`
- Behavior & edge cases:
  - Payment success and failure pages must return to cart/checkout with a clear retry state
  - Non-card flows should clearly say whether they are using wallet, transfer, or card payment
  - If payment fails, keep items in cart and show a non-destructive retry CTA
- Supalove adaptation notes:
  - Use local payment method names, such as `Card`, `Transfer`, `Wallet`, or `Cash on pickup`, not marketplace-style or trust-lending language

### Confirmation emails / templates
- Purpose: External touchpoints for order confirmation and shipping status.
- Source files: app services for email templates and task/email flows in backend; exact frontend references are minimal but email UX should mirror the storefront tone.
- Markup + exact classes:

```html
<div style="font-family: Outfit, sans-serif; background: #F7F8FA; padding: 32px;">
  <div style="background: #ffffff; border-radius: 20px; padding: 24px; box-shadow: 0 10px 15px -3px rgba(47,168,79,0.08);">
    <h1 style="font-size: 28px; color: #2FA84F; margin: 0 0 12px;">Your order is confirmed</h1>
    <p style="color: #475467;">We’ve received your order from Supalovefoods.</p>
  </div>
</div>
```

- State/data shape:
  - `orderNumber`, `customerName`, `items[]`, `total`, `deliveryWindow`, `status`
- Behavior & edge cases:
  - Include order number, total, support link, and pickup/delivery instructions
  - Use plain-text fallback for email clients that block HTML
- Supalove adaptation notes:
  - Replace generic “seller” references with store or company name; emphasize pickup window and freshness
