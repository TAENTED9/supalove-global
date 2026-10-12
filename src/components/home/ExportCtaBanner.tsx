import Link from 'next/link'
import { Ship, PhoneCall, ArrowRight, CheckCircle2 } from 'lucide-react'

export function ExportCtaBanner() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 overflow-hidden p-8 sm:p-14 text-white shadow-2xl border border-emerald-900/30">
          {/* Subtle glow accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange bg-white/10 px-3 py-1 rounded-full mb-4">
                <Ship size={14} /> Commercial B2B &middot; 20ft &amp; 40ft Containers
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Exporting Foodstuffs to the UK, US, Canada or Europe?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-2xl leading-relaxed">
                We handle sourcing, automated de-stoning, vacuum packaging, phyto-sanitary inspection, and customs documentation for international ocean and air freight.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-brand-green" /> Phyto-Sanitary Certificates
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-brand-green" /> Moisture Barrier Packaging
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-brand-green" /> Dedicated Freight Agent
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href="/products?unit=BAG"
                className="inline-flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-hover text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-brand-green/30 text-xs sm:text-sm text-center"
              >
                Browse Wholesale Bags <ArrowRight size={15} />
              </Link>
              <a
                href="tel:+2348007872568"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold px-6 py-3.5 rounded-xl transition-all text-xs sm:text-sm text-center backdrop-blur-md"
              >
                <PhoneCall size={15} className="text-brand-orange" />
                Call Commodity Desk
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default ExportCtaBanner
