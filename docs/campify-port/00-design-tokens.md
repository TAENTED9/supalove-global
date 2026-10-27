# 00-design-tokens

## Tailwind theme essentials

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          25: '#F5FFF7',
          50: '#E9F9EE',
          100: '#D9F3E1',
          200: '#BFEFCB',
          300: '#9DE8B0',
          400: '#62D280',
          500: '#2FA84F',
          600: '#238E40',
          700: '#1C7435',
          800: '#175C2C',
          900: '#124B24',
          950: '#0D3920',
        },
        orange: {
          25: '#FFF9F0',
          50: '#FFF2E0',
          100: '#FEE5B7',
          200: '#FED68B',
          300: '#FECB6A',
          400: '#FDBE4D',
          500: '#FBAE3C',
          600: '#E99823',
          700: '#C47B13',
          800: '#9C6113',
          900: '#7A4D12',
          950: '#4C310D',
        },
        success: {
          50: '#ECFDF5', 500: '#16A34A', 600: '#15803D',
        },
        warning: {
          50: '#FFFBEB', 500: '#F59E0B', 600: '#D97706',
        },
        error: {
          50: '#FEF2F2', 500: '#EF4444', 600: '#DC2626',
        },
        gray: {
          25: '#FCFCFD', 50: '#F7F8FA', 100: '#F2F4F7', 200: '#E4E7EC', 300: '#D0D5DD', 400: '#98A2B3', 500: '#667085', 600: '#475467', 700: '#344054', 800: '#1D2939', 900: '#101828', 950: '#0C111D',
        },
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        sm: '0 1px 3px 0 rgba(16, 24, 40, 0.10), 0 1px 2px 0 rgba(16, 24, 40, 0.06)',
        md: '0 4px 8px -2px rgba(16, 24, 40, 0.10), 0 2px 4px -2px rgba(16, 24, 40, 0.06)',
        lg: '0 12px 16px -4px rgba(16, 24, 40, 0.08), 0 4px 6px -2px rgba(16, 24, 40, 0.03)',
        xl: '0 20px 24px -4px rgba(16, 24, 40, 0.08), 0 8px 8px -4px rgba(16, 24, 40, 0.03)',
        card: '0 10px 15px -3px rgba(47,168,79,0.08), 0 4px 6px -4px rgba(47,168,79,0.05)',
        toast: '0 20px 25px -5px rgba(16, 24, 40, 0.15), 0 8px 10px -6px rgba(16, 24, 40, 0.10)',
      },
      borderRadius: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '1.75rem',
        '3xl': '2rem',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      zIndex: {
        1: '1',
        9: '9',
        99: '99',
        999: '999',
        9999: '9999',
        dropdown: '20',
        modal: '30',
        sticky: '40',
        toast: '9999',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'slide-down': { '0%': { opacity: '0', transform: 'translateY(-8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'pulse-soft': { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.2s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'pulse-soft': 'pulse-soft 1.8s ease-in-out infinite',
      },
    },
  },
};
```

## Globals essentials

```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
@import 'tailwindcss';
@custom-variant dark (&:is(.dark *));

@theme {
  --font-sans: Outfit, sans-serif;
  --breakpoint-2xsm: 375px;
  --breakpoint-xsm: 425px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

@layer base {
  * { box-sizing: border-box; }
  body {
    @apply bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-white;
    font-family: Outfit, sans-serif;
  }
  button:not(:disabled), [role="button"]:not(:disabled) { cursor: pointer; }
  img { display: block; }
}

@layer utilities {
  .no-scrollbar { scrollbar-width: none; }
  .no-scrollbar::-webkit-scrollbar { display: none; }
}
```

## Container widths

- `max-w-7xl` for standard storefront shell: `mx-auto max-w-7xl px-4 sm:px-6 xl:px-0`
- `max-w-[1600px]` for feature rails and full bleed home sections
- `max-w-(--breakpoint-2xl)` for admin dashboards

## Spacing scale

- `p-4` / `px-4` / `gap-4`: base mobile spacing
- `sm:p-6` / `lg:p-8`: section padding
- `rounded-2xl`, `rounded-xl`, `rounded-full`: standard shape set
- `h-10` and `min-h-[44px]`: touch-safe UI controls

## Z-index map

- `z-1` base
- `z-10` sticky/inline surfaces
- `z-20` dropdowns, hover shells
- `z-30` mobile nav / sticky CTA / overlays
- `z-40` global sticky layers
- `z-50` modal root
- `z-[9999]` toast stack

## Icon library and sizes

- Use `lucide-react` with 16/18/20/22 px sizing
- Standard icons: `Search`, `ShoppingCart`, `Heart`, `Menu`, `ChevronDown`, `MapPin`, `Clock`, `Check`, `AlertCircle`, `ShieldCheck`
- Base sizes: `size={14}` for chips and meta, `size={16}` for nav/action icons, `size={18}` for app-level actions, `size={20}` for primary toolbar icons, `size={22}` for header icons if needed

## Toast / modal / sheet primitives

```tsx
<div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end">
  <div className="flex items-center gap-3 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-toast">
    Saved
  </div>
</div>
```

```tsx
<div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm">
  <div className="mx-auto mt-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
    Modal content
  </div>
</div>
```

```tsx
<div className="fixed inset-x-0 bottom-0 z-30 rounded-t-2xl bg-white p-4 shadow-xl dark:bg-gray-900">
  Bottom sheet content
</div>
```

## Dark-mode strategy

- Use `dark:` classes only for surfaces and text; preserve brand saturation in dark mode
- Keep essentials readable: `dark:bg-gray-900`, `dark:text-white`, `dark:border-gray-800`
- Avoid pure black/white contrast traps: use `gray-900` and `gray-100` layering instead of raw `#000`
- Brand green/orange should remain visible in both light and dark themes; never rely on blue-only highlights

## Supalove adaptation notes

- Replace all Campify blue brand tokens with `brand.green #2FA84F` and `brand.orange #FBAE3C`
- Remove marketplace-only “campus” and “seller” language in favor of “food store” and “single storefront” messaging
- Keep the same production-grade shell + card + admin patterns, but remove multi-seller concepts and trust-tier copy
