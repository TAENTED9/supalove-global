import Link from 'next/link'
import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react'
import { whatsappHref } from '@/config/site'

export function FinalCtaSection() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-brand-900 to-brand-950 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold mb-4 backdrop-blur-sm">
          <ShieldCheck size={14} className="text-orange-400" />
          <span>Direct Farm Pricing &middot; Guaranteed Purity</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
          Stock Up on Fresh, Verified Nigerian Foodstuffs Today
        </h2>

        <p className="mt-3 text-xs sm:text-sm text-brand-200 max-w-xl mx-auto leading-relaxed">
          Order individual packs for home cooking or bulk 50kg bags for business. Delivered safely to your doorstep in Lagos and nationwide.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-brand-500/30 text-sm active:scale-95"
          >
            <span>Start Shopping</span>
            <ArrowRight size={16} />
          </Link>
          <a
            href={whatsappHref('Hello Supalovefoods, I would like to place an order.')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-xl transition-all text-sm backdrop-blur-md active:scale-95"
          >
            <MessageCircle size={16} className="text-orange-400" />
            <span>Order on WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  )
}
export default FinalCtaSection
