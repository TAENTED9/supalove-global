import Link from 'next/link'
import { Wheat, Droplets, Bean, Sparkles, Flame, Coffee, type LucideIcon } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { CategoryItem } from '@/lib/data'

interface CategoryStripProps {
  categories: CategoryItem[]
}

const CATEGORY_ICONS: Record<string, { icon: LucideIcon; bg: string; text: string }> = {
  'grains-cereals':     { icon: Wheat,    bg: 'bg-amber-50',    text: 'text-amber-700' },
  'cooking-oils':       { icon: Droplets, bg: 'bg-orange-50',   text: 'text-brand-500' },
  'legumes-beans':      { icon: Bean,     bg: 'bg-brand-50',    text: 'text-brand-600' },
  'root-crops':         { icon: Sparkles, bg: 'bg-yellow-50',   text: 'text-yellow-700' },
  'spices-seasonings':  { icon: Flame,    bg: 'bg-red-50',      text: 'text-red-600' },
  'beverages':          { icon: Coffee,   bg: 'bg-rose-50',     text: 'text-rose-600' },
}

export function CategoryStrip({ categories }: CategoryStripProps) {
  if (!categories.length) return null

  return (
    <section className="py-8 sm:py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        <SectionHeader title="Shop by Category" href="/products" />

        {/*
          Mobile: horizontal scroll chips (no-scrollbar)
          Desktop: grid of icon cards (Campify style)
        */}

        {/* ── Mobile chip strip ───────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar sm:hidden">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-brand-400 hover:text-brand-600 transition-colors whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/products"
            className="shrink-0 inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-brand-200 bg-brand-50 text-sm font-semibold text-brand-600 transition-colors whitespace-nowrap"
          >
            All Products →
          </Link>
        </div>

        {/* ── Desktop icon cards ──────────────────────────────────── */}
        <div className="hidden sm:grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {categories.map((cat) => {
            const visual = CATEGORY_ICONS[cat.slug] ?? {
              icon: Wheat,
              bg: 'bg-brand-50',
              text: 'text-brand-600',
            }
            const Icon = visual.icon

            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 border border-gray-200/80 shadow-xs hover:shadow-sm hover:border-brand-300 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${visual.bg} ${visual.text} flex items-center justify-center mb-2.5 transition-colors shrink-0`}
                >
                  <Icon size={24} />
                </div>
                <h3 className="text-xs font-bold text-gray-900 group-hover:text-brand-600 transition-colors leading-snug">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default CategoryStrip
