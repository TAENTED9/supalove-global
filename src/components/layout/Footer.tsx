import Link from 'next/link'
import { MapPin, Mail, Phone, ShieldCheck, Truck, Globe, Award, CreditCard } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

const CATEGORY_LINKS = [
  { label: 'Grains & Rice (Rice, Maize, Millet)', href: '/products?category=grains-rice' },
  { label: 'Beans & Legumes (Oloyin, Soya)', href: '/products?category=beans-legumes' },
  { label: 'Flours & Garri (Ijebu Garri, Fufu)', href: '/products?category=flours-garri' },
  { label: 'Oils (Palm & Groundnut)', href: '/products?category=oils' },
  { label: 'Spices & Seasoning (Crayfish, Tatashe)', href: '/products?category=spices-seasoning' },
  { label: 'Tubers & Others (Cocoyam, Yam)', href: '/products?category=tubers-others' },
]

const EXPORT_LINKS = [
  { label: 'Wholesale 50kg Bags & Cartons', href: '/products?unit=BAG' },
  { label: '20ft & 40ft Container Shipments', href: '/products' },
  { label: 'Diaspora African Store Supply', href: '/products' },
  { label: 'Phyto-Sanitary Documentation', href: '/products' },
  { label: 'Bulk Palm Oil (25L Jerrycans)', href: '/products?unit=LITRE' },
  { label: 'Custom B2B Quotations', href: '/products' },
]

const SUPPORT_LINKS = [
  { label: 'Track Order Status', href: '/orders' },
  { label: 'All Products Catalog', href: '/products' },
  { label: 'Shopping Cart', href: '/cart' },
  { label: 'Quality Guarantee & Inspection', href: '/products' },
  { label: 'Terms of Supply & Trade', href: '/terms' },
  { label: 'Admin Management Portal', href: '/admin/login' },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      {/* Trust Highlights Strip */}
      <div className="border-b border-slate-800 bg-slate-950/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 border border-brand-green/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">100% Quality Inspected</h4>
                <p className="text-xs text-slate-400">Stone-free, sorted, and hygienic.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0 border border-brand-orange/20">
                <Globe size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Global Export Ready</h4>
                <p className="text-xs text-slate-400">Air &amp; sea freight packaging for export.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 border border-brand-green/20">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Nationwide Delivery</h4>
                <p className="text-xs text-slate-400">Prompt fulfillment across all 36 states.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0 border border-brand-orange/20">
                <CreditCard size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Secure Payments</h4>
                <p className="text-xs text-slate-400">Flutterwave encrypted checkout.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4">
            <Logo size="md" />

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your trusted partner for agricultural commodity export, wholesale food supplies, and retail domestic delivery. Direct from verified Nigerian farms and processors.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-brand-green shrink-0 mt-0.5" />
                <span>Apapa Port Agro-Hub &amp; Ikeja Logistics Center, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-brand-orange shrink-0" />
                <a
                  href="mailto:contact@supalovefoods.com"
                  className="hover:text-white transition-colors"
                >
                  orders@supalovefoods.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-brand-green shrink-0" />
                <a href="tel:+2348007872568" className="hover:text-white transition-colors">
                  +234 (0) 800-SUPALOVE / +234 812 345 6789
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Foodstuff Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-green pl-2.5">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-green hover:underline hover:underline-offset-4 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Export & Wholesale */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-orange pl-2.5">
              Export &middot; Wholesale &middot; Retail
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {EXPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-orange hover:underline hover:underline-offset-4 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Customer Care & Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-brand-green pl-2.5">
              Help &middot; Tracking &middot; Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:underline hover:underline-offset-4 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter Mini Form */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <p className="text-xs font-semibold text-slate-300 mb-2">Get Commodity Price Updates</p>
              <div className="flex rounded-xl overflow-hidden bg-slate-800/80 border border-slate-700 p-1">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent px-3 py-1 text-xs text-white placeholder:text-slate-500 outline-none w-full"
                />
                <button
                  type="button"
                  className="bg-brand-green hover:bg-brand-green-hover text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors shrink-0"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Supalovefoods Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Award size={14} className="text-brand-orange" />
              Verified Export Grade
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <CreditCard size={14} className="text-brand-green" />
              Powered by Flutterwave
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
