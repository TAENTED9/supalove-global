import Link from 'next/link'
import { XCircle, ArrowRight, RefreshCw, Phone, Mail } from 'lucide-react'

export default function CheckoutFailedPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Failed Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <XCircle size={40} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Payment Failed
          </h1>
          <p className="text-slate-500">
            We couldn&apos;t process your payment. Don&apos;t worry, your card hasn&apos;t been charged.
          </p>
        </div>

        {/* Error Explanation Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">What might have happened?</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 font-bold text-xs">1</span>
              <span>Your payment was declined by the bank or payment provider.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 font-bold text-xs">2</span>
              <span>There was a temporary network issue during payment processing.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 font-bold text-xs">3</span>
              <span>The payment session timed out. Please try again.</span>
            </li>
          </ul>
        </div>

        {/* What You Can Do */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
            What You Can Do
          </h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <RefreshCw size={16} className="text-brand-green shrink-0 mt-0.5" />
              <span>Try checking out again with a different payment method.</span>
            </li>
            <li className="flex items-start gap-3">
              <RefreshCw size={16} className="text-brand-green shrink-0 mt-0.5" />
              <span>Contact your bank to ensure your card is enabled for online transactions.</span>
            </li>
            <li className="flex items-start gap-3">
              <RefreshCw size={16} className="text-brand-green shrink-0 mt-0.5" />
              <span>If the problem persists, reach out to our support team.</span>
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="bg-slate-100 rounded-2xl p-6 mb-6">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">
            Need Help?
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-brand-green shrink-0" />
              <span className="text-slate-600">Call us: {process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+234 800 123 4567'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-brand-green shrink-0" />
              <span className="text-slate-600">Email: {process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@supalovefoods.com'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/cart"
            className="flex-1 py-4 px-6 rounded-2xl bg-brand-green hover:bg-brand-green-hover text-white font-bold text-sm transition-all shadow-lg shadow-brand-green/30 flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Try Again
          </Link>
          <Link
            href="/"
            className="flex-1 py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            Return to Home <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
