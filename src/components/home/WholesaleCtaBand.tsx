import Link from 'next/link'
import { Package, Globe, ArrowRight, MessageCircle } from 'lucide-react'
import { whatsappHref } from '@/config/site'

export function WholesaleCtaBand() {
  return (
    <section className="py-10 bg-brand-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold mb-2">
              <Package size={13} />
              <span>Wholesale &amp; Export Services</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Buying in bulk? Get tier pricing or an export container quote.
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-brand-200 leading-relaxed">
              We supply 50kg bags, master cartons, and 20ft/40ft ocean containers of verified Nigerian agricultural commodities worldwide.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={whatsappHref('Hello Supalovefoods, I would like an export/wholesale quote.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
            >
              <MessageCircle size={16} />
              <span>Chat on WhatsApp</span>
            </a>
            <Link
              href="/products?unit=BAG"
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl transition-colors"
            >
              <Globe size={15} className="text-orange-400" />
              <span>Browse 50kg Bags</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
export default WholesaleCtaBand
