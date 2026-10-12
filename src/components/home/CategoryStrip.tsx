import Link from 'next/link'
import { Wheat, Droplets, Bean, Sparkles, Flame, Coffee, ArrowRight, type LucideIcon } from 'lucide-react'
import type { CategoryItem } from '@/lib/data'

interface CategoryStripProps {
  categories: CategoryItem[]
}

const CATEGORY_ICONS: Record<string, { icon: LucideIcon; bg: string; text: string; border: string }> = {
  'grains-cereals': {
    icon: Wheat,
    bg: 'bg-amber-50 group-hover:bg-amber-100',
    text: 'text-amber-700',
    border: 'hover:border-amber-300',
  },
  'cooking-oils': {
    icon: Droplets,
    bg: 'bg-orange-50 group-hover:bg-orange-100',
    text: 'text-brand-orange',
    border: 'hover:border-orange-300',
  },
  'legumes-beans': {
    icon: Bean,
    bg: 'bg-emerald-50 group-hover:bg-emerald-100',
    text: 'text-brand-green',
    border: 'hover:border-emerald-300',
  },
  'root-crops': {
    icon: Sparkles,
    bg: 'bg-yellow-50 group-hover:bg-yellow-100',
    text: 'text-yellow-700',
    border: 'hover:border-yellow-300',
  },
  'spices-seasonings': {
    icon: Flame,
    bg: 'bg-red-50 group-hover:bg-red-100',
    text: 'text-red-600',
    border: 'hover:border-red-300',
  },
  beverages: {
    icon: Coffee,
    bg: 'bg-rose-50 group-hover:bg-rose-100',
    text: 'text-rose-600',
    border: 'hover:border-rose-300',
  },
}

export function CategoryStrip({ categories }: CategoryStripProps) {
  return (
    <section className="py-12 sm:py-16 bg-slate-50/70 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
              Explore Our Commodities
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-green hover:text-brand-green-hover transition-colors group"
          >
            <span>View All Categories</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Grid (Campify layout style) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {categories.map((cat) => {
            const visual = CATEGORY_ICONS[cat.slug] || {
              icon: Wheat,
              bg: 'bg-emerald-50',
              text: 'text-brand-green',
              border: 'hover:border-brand-green',
            }
            const Icon = visual.icon

            return (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className={`group flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${visual.border}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${visual.bg} ${visual.text} flex items-center justify-center mb-3 transition-colors shrink-0`}
                >
                  <Icon size={26} />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-green transition-colors leading-snug">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  {cat.description || 'Verified Produce'}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default CategoryStrip
