import { RotateCcw, Mail, Phone } from 'lucide-react'
import { siteConfig, mailHref, telHref } from '@/config/site'

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mx-auto mb-4">
            <RotateCcw size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Refunds &amp; Returns Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Clear guidelines on product replacements, refunds, and damaged transit claims.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Quality Inspection Guarantee</h2>
            <p>
              At {siteConfig.name}, produce undergoes rigorous de-stoning, screening, and hygiene testing prior to bagging. In the unlikely event that you receive damaged packaging, unsealed oil drums, or produce that does not meet standard specifications, we are committed to promptly making it right.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Eligibility for Claims</h2>
            <p>
              Due to the perishable nature of agricultural produce, issues must be reported within <strong>48 hours</strong> of receipt for domestic orders, or within <strong>7 business days</strong> of customs release for international freight.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Item must be in its original packaging.</li>
              <li>Clear photographic or video evidence of the defect or damage is required.</li>
              <li>Proof of purchase (order reference number) must be provided.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Resolution &amp; Reimbursement</h2>
            <p>
              Upon verification of your claim, we will offer one of the following resolutions:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Immediate replacement of the defective item at zero additional shipping fee.</li>
              <li>Full or partial refund via the original Flutterwave payment method (processed within 3-5 business days).</li>
              <li>Store credit towards your next agricultural commodity order.</li>
            </ul>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900">4. Contacting Support</h2>
            <p>
              To file a claim or discuss a recent delivery, please reach out to our customer care team:
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={mailHref(siteConfig.email)}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-green hover:underline"
              >
                <Mail size={14} /> {siteConfig.email}
              </a>
              <a
                href={telHref(siteConfig.phone)}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange hover:underline"
              >
                <Phone size={14} /> {siteConfig.phoneIntl || siteConfig.phone}
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
