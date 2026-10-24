import { siteConfig } from '@/config/site'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-green">
            Data Protection
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            How we protect customer and commercial data &middot; {siteConfig.name}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              We collect information necessary to fulfill your orders, provide dispatch tracking, and process payments securely. This includes your name, email address, contact phone number, delivery street address, and purchase preferences.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Payment Security</h2>
            <p>
              All online financial transactions are securely handled through Flutterwave&apos;s PCI-DSS Level 1 certified gateway. {siteConfig.name} does not capture, store, or have access to your full debit/credit card numbers or bank account PINs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Usage of Information</h2>
            <p>
              Your contact details are strictly utilized to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Coordinate doorstep delivery or ocean freight dispatch.</li>
              <li>Provide SMS and email order confirmation and shipment tracking notifications.</li>
              <li>Share relevant agricultural harvest and seasonal commodity price updates (which you can opt out of at any time).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Third-Party Sharing</h2>
            <p>
              We do not sell, rent, or trade your personal data. Information is only shared with verified delivery couriers, freight clearing partners, and regulatory export documentation authorities solely for fulfillment.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900">5. Contact Data Privacy Officer</h2>
            <p>
              For any questions regarding your data or to request record deletion, email <strong>{siteConfig.email}</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
