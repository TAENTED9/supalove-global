import { MapPin, Mail, Phone, MessageCircle, Clock, ShieldCheck } from 'lucide-react'
import { siteConfig, mailHref, telHref, whatsappHref } from '@/config/site'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
            Direct Commodity Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
            Contact {siteConfig.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Speak directly with our commodity sourcing, wholesale aggregation, and international export team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Phone */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center mb-4">
              <Phone size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Phone Call</h3>
            <p className="text-xs text-slate-400 mb-4">Direct customer &amp; trade desk</p>
            <a
              href={telHref(siteConfig.phone)}
              className="text-xs sm:text-sm font-extrabold text-brand-green hover:underline mt-auto"
            >
              {siteConfig.phoneIntl || siteConfig.phone}
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Email Inquiries</h3>
            <p className="text-xs text-slate-400 mb-4">Orders &amp; export tenders</p>
            <a
              href={mailHref(siteConfig.email)}
              className="text-xs sm:text-sm font-extrabold text-brand-orange hover:underline mt-auto"
            >
              {siteConfig.email}
            </a>
          </div>

          {/* WhatsApp */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <MessageCircle size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">WhatsApp Chat</h3>
            <p className="text-xs text-slate-400 mb-4">Instant quotes &amp; inventory</p>
            <a
              href={whatsappHref('Hello Supalovefoods, I would like to inquire about produce.')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-extrabold text-emerald-600 hover:underline mt-auto"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        {/* Address and Hours Block */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
              Physical Location
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Operations &amp; Aggregation Hub
            </h2>
            <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
              <MapPin size={18} className="text-brand-green shrink-0 mt-0.5" />
              <span>{siteConfig.address}</span>
            </div>
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600">
              <Clock size={18} className="text-brand-orange shrink-0" />
              <span>Monday &ndash; Saturday: 8:00 AM &ndash; 6:00 PM WAT</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck size={16} className="text-brand-green" /> Direct Produce Guarantee
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              We welcome diaspora trade representatives and local supermarket procurement teams for on-site quality inspection and container loading verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
