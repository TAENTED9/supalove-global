import { Truck, ShieldCheck, CreditCard, Clock } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const CARDS = [
  {
    icon: Truck,
    title: 'Fast Doorstep Delivery',
    description: 'Same-day and next-day delivery across Lagos; 2–4 days to major state capitals nationwide via trusted logistics partners.',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Inspected Guarantee',
    description: '100% stone-free grains and unadulterated oils. If there is any defect or damage upon arrival, we replace or refund.',
  },
  {
    icon: CreditCard,
    title: 'Secure Flutterwave Payments',
    description: 'Pay safely with Nigerian debit cards, direct bank transfer, or USSD. Card details are never stored on our servers.',
  },
  {
    icon: Clock,
    title: 'Order Tracking & Support',
    description: 'Live order status tracking from checkout to dispatch. Instant WhatsApp customer care for order updates.',
  },
]

export function DeliveryPaymentInfo() {
  return (
    <section className="py-8 sm:py-10 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        <SectionHeader title="Delivery &amp; Payment Information" href="/delivery" linkLabel="Read policies" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default DeliveryPaymentInfo
