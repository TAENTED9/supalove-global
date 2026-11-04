import Link from 'next/link'
import {
  ShieldCheck,
  Package,
  Globe2,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 py-16 sm:py-24 lg:py-28 text-white">
      {/* Subtle background radial glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#2FA84F_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-emerald-300 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span>Verified Direct Farm Sourcing &middot; Export Quality Standard</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] max-w-4xl mx-auto drop-shadow-sm">
          Premium Nigerian Foodstuffs,{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-brand-green to-brand-orange">
            Wholesale &amp; Export Ready.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From 50kg bags of stone-free rice and pure South-South palm oil to Calabar smoked crayfish.
          Order for domestic delivery or schedule 20ft/40ft export containers worldwide.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-brand-green/30 text-sm active:scale-95"
          >
            Explore All Foodstuffs <ArrowRight size={16} />
          </Link>
          <Link
            href="/products?unit=BAG"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold px-7 py-3.5 rounded-xl transition-all text-sm backdrop-blur-md active:scale-95"
          >
            <TrendingUp size={16} className="text-brand-orange" />
            Wholesale &amp; Bulk Bags
          </Link>
        </div>

        {/* Trust Badges Strip (Campify style) */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
          <div className="flex items-center justify-center gap-2">
            <ShieldCheck size={18} className="text-brand-green shrink-0" />
            <span className="font-medium">100% Stone-Free Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 size={18} className="text-brand-orange shrink-0" />
            <span className="font-medium">Pure &amp; Unadulterated Oils</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Globe2 size={18} className="text-brand-green shrink-0" />
            <span className="font-medium">Global Phyto-Certified Export</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Package size={18} className="text-brand-orange shrink-0" />
            <span className="font-medium">Bags, KG, Litres &amp; Cartons</span>
          </div>
        </div>
      </div>
    </section>
  )
}
export default HeroBanner
