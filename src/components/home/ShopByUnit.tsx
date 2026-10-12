import Link from 'next/link'
import { Package, Scale, Droplet, Box, ArrowRight } from 'lucide-react'

const UNITS = [
  {
    unit: 'BAG',
    title: 'Bulk Bags (25kg - 50kg)',
    badge: 'Wholesale & Export',
    badgeColor: 'bg-brand-orange text-white',
    description: 'Direct agricultural sacks for commercial caterers, wholesalers, and export container loads.',
    popularItems: 'Rice 50kg, Garri 25kg, Beans 50kg',
    icon: Package,
    href: '/products?unit=BAG',
    accent: 'border-brand-orange/30 hover:border-brand-orange',
    iconBg: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    unit: 'KG',
    title: 'Kilograms (1kg - 10kg)',
    badge: 'Retail Packs',
    badgeColor: 'bg-brand-green text-white',
    description: 'Precision-measured, sorted, and cleanly packaged portions for home cooking and local distribution.',
    popularItems: 'Ofada Rice 5kg, Honey Beans 5kg, Tatashe 1kg',
    icon: Scale,
    href: '/products?unit=KG',
    accent: 'border-brand-green/30 hover:border-brand-green',
    iconBg: 'bg-brand-green/10 text-brand-green',
  },
  {
    unit: 'LITRE',
    title: 'Litres (1L - 25L)',
    badge: 'Pure Oils',
    badgeColor: 'bg-amber-500 text-white',
    description: 'Cold-pressed golden groundnut oil and pure South-South unadulterated red palm oil.',
    popularItems: 'Palm Oil 5L & 25L, Groundnut Oil 5L',
    icon: Droplet,
    href: '/products?unit=LITRE',
    accent: 'border-amber-300 hover:border-amber-500',
    iconBg: 'bg-amber-50 text-amber-600',
  },
  {
    unit: 'CARTON',
    title: 'Cartons & Master Packs',
    badge: 'Commercial',
    badgeColor: 'bg-blue-600 text-white',
    description: 'Sturdy, moisture-sealed cartons designed for air-freight transport and diaspora grocery shelves.',
    popularItems: 'Calabar Smoked Crayfish 1kg Carton, Spices',
    icon: Box,
    href: '/products?unit=CARTON',
    accent: 'border-blue-200 hover:border-blue-500',
    iconBg: 'bg-blue-50 text-blue-600',
  },
]

export function ShopByUnit() {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
            Flexible Purchasing Options
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Shop by Measurement Unit
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Whether you need a 1-litre bottle for family stew or 40ft container loads of 50kg grain bags, we provide tailored pricing and packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UNITS.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.unit}
                href={item.href}
                className={`group flex flex-col justify-between p-6 rounded-2xl bg-slate-50/60 border ${item.accent} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}
                    >
                      <Icon size={24} />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-green transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60">
                  <div className="text-[11px] text-slate-400 font-medium truncate mb-2">
                    Popular: <span className="text-slate-700">{item.popularItems}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-green group-hover:text-brand-green-hover transition-colors">
                    <span>Filter Products</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default ShopByUnit
