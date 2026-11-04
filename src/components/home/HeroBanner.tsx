import Link from 'next/link'
import { ShieldCheck, Package, Globe2, CreditCard, ArrowRight } from 'lucide-react'
import { siteConfig, whatsappHref } from '@/config/site'

const TRUST_CHIPS = [
  { icon: ShieldCheck,  label: 'Secure payment via Flutterwave' },
  { icon: Package,      label: 'Delivery across Lagos & Nigeria' },
  { icon: Globe2,       label: 'Bulk & export orders' },
  { icon: CreditCard,   label: 'Quality-checked stock' },
]

export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-10 sm:py-14 text-white">
      {/* Subtle background glows */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Compact heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            Premium Nigerian Foodstuffs,{' '}
            <span className="text-orange-400">Wholesale &amp; Export Ready.</span>
          </h1>

          <p className="mt-3 text-sm text-brand-200 leading-relaxed max-w-lg">
            {siteConfig.tagline} — stone-free rice, pure palm oil, fresh-packed beans,
            and spices for retail, wholesale, and international container export.
          </p>

          {/* Single primary CTA */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-brand-500/30 text-sm active:scale-95"
            >
              Shop All Foodstuffs
              <ArrowRight size={16} />
            </Link>
            <a
              href={whatsappHref('Hello, I would like to inquire about wholesale pricing.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-5 py-3 rounded-xl transition-all text-sm backdrop-blur-md active:scale-95"
            >
              Wholesale &amp; Export Inquiry
            </a>
          </div>
        </div>

        {/* Trust chips row */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-x-6 gap-y-2">
          {TRUST_CHIPS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-brand-200">
              <Icon size={15} className="text-brand-400 shrink-0" />
              <span className="font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default HeroBanner
