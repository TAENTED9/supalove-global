import { ShieldCheck, Truck, Factory, Globe2, Sparkles, Award } from 'lucide-react'

const PILLARS = [
  {
    icon: Factory,
    title: 'Direct Farm Aggregation',
    description: 'We source directly from farmer clusters across Benue, Kebbi, Ogun, and Calabar, eliminating middleman markups and guaranteeing fresh harvests.',
    color: 'text-brand-green bg-brand-green/10',
  },
  {
    icon: Sparkles,
    title: 'Precision De-Stoning & Sorting',
    description: 'Every bag of rice, beans, and garri passes through mechanical aspirators and optical sorters. Zero stones, sand, or foreign matter.',
    color: 'text-brand-orange bg-brand-orange/10',
  },
  {
    icon: Globe2,
    title: 'Export Phyto-Sanitary Compliance',
    description: 'Full export documentation, fumigation certificates, and vacuum moisture sealing compliant with UK, US, EU, and Canada customs standards.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: Truck,
    title: 'Doorstep Delivery & Freight Forwarding',
    description: 'Next-day domestic fulfillment across major Nigerian cities, plus air freight (4-7 days) and full 20ft/40ft ocean container clearing.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: ShieldCheck,
    title: 'Guaranteed Unadulterated Oils',
    description: 'Our palm oil and groundnut oils are tested for density, color, and purity. Zero artificial food dye, Sudan IV, or chemical additives.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: Award,
    title: 'Transparent Pricing in Naira',
    description: 'No hidden handling charges. Clear prices per bag, kg, and litre with secure Flutterwave checkout and automated invoice generation.',
    color: 'text-indigo-600 bg-indigo-50',
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
            The Supalovefoods Quality Standard
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Why Food Buyers &amp; Diaspora Buyers Trust Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2.5 leading-relaxed">
            We bridge the gap between rural Nigerian farmland and commercial dining tables worldwide, combining traditional agricultural authenticity with modern hygiene standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PILLARS.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="p-6 sm:p-7 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 hover:shadow-card transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-5 shrink-0`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default WhyChooseUs
