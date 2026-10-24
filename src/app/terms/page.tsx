import { siteConfig } from '@/config/site'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
            Legal &amp; Compliance
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Terms of Supply &amp; Trade
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Last updated: {new Date().getFullYear()} &middot; {siteConfig.name}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing our online storefront or placing an order with {siteConfig.name}, you agree to be bound by these Terms of Trade. These terms apply to all transactions including retail orders, wholesale bag allocations, and container export contracts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Pricing &amp; Currency</h2>
            <p>
              All prices displayed on the storefront are quoted in Nigerian Naira (NGN). We reserve the right to revise agricultural commodity prices due to farmgate seasonality, exchange rate variations, or transportation fuel fluctuations prior to order confirmation. Once paid, the price is guaranteed.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Orders &amp; Fulfillment</h2>
            <p>
              An order is deemed accepted once Flutterwave confirms successful payment authorization. In situations where warehouse stock becomes exhausted before real-time adjustment, we will notify the customer immediately to arrange priority restock dispatch or a complete refund.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Phyto-Sanitary &amp; Export Compliance</h2>
            <p>
              For international export shipments, {siteConfig.name} warrants that produce meets international fumigation, moisture threshold, and phytosanitary requirements at port of loading. Demurrage caused by foreign customs delay outside document deficiency remains the importer&apos;s responsibility.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, with jurisdiction centered in Lagos State.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
