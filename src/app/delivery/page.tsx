import { Truck, Globe, ShieldCheck, MapPin, Clock } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
            Logistics &amp; Fulfillment
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Shipping &amp; Delivery Information
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Reliable agricultural produce delivery across Nigeria and worldwide export freight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center">
              <Truck size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Domestic Delivery (Nigeria)</h2>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-green shrink-0 mt-0.5" />
                <span><strong>Lagos Deliveries:</strong> Flat ₦1,500 delivery fee. Orders dispatched within 24 to 48 hours.</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-orange shrink-0 mt-0.5" />
                <span><strong>Nationwide Interstate:</strong> ₦3,500 flat fee covering key logistics hubs across all 36 states.</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock size={14} className="text-brand-green shrink-0 mt-0.5" />
                <span><strong>Transit Timeline:</strong> Major cities: 1-3 business days. Regional areas: 2-5 business days.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
              <Globe size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">International Export Cargo</h2>
            <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} className="text-brand-green shrink-0 mt-0.5" />
                <span><strong>Export Compliance:</strong> Full phyto-sanitary certification, fumigation records, and NAFDAC documentation.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} className="text-brand-orange shrink-0 mt-0.5" />
                <span><strong>Air Freight:</strong> 4-7 business days to UK, US, Canada, Europe, and UAE diaspora grocers.</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} className="text-brand-green shrink-0 mt-0.5" />
                <span><strong>Ocean Freight:</strong> 20ft and 40ft Full Container Load (FCL) shipping via Apapa &amp; Tin Can ports.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-xs text-slate-600 leading-relaxed space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Packaging Standard</h3>
          <p>
            All grains, rice, and legumes are machine de-stoned, optical sorter purified, and packaged in heavy-gauge moisture-barrier sacks. Pure palm oil and liquid commodities are secured in food-grade, leak-proof, induction-sealed jerrycans.
          </p>
          <p>
            For customized freight quotes or dedicated commodity dispatch inquiries, reach out to our logistics desk at <strong>{siteConfig.phoneIntl || siteConfig.phone}</strong> or email <strong>{siteConfig.email}</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
