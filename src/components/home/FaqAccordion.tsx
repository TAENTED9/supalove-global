'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'

const FAQS = [
  {
    q: 'Are your rice, beans, and garri really 100% stone-free?',
    a: 'Yes. All grain and pulse commodities pass through industrial mechanical aspirators and optical color sorters before packing. We guarantee clean, hygienic, and ready-to-cook foodstuffs with no sand, pebbles, or impurities.',
  },
  {
    q: 'How fast is delivery within Lagos and to other states?',
    a: 'Lagos orders placed before 12:00 PM are delivered same-day or next-day. Deliveries to other Nigerian states take 2–4 business days via reliable interstate logistics haulage.',
  },
  {
    q: 'Is your red palm oil pure and unadulterated?',
    a: 'Absolutely. Sourced directly from trusted millers in the South-South region, our palm oil is 100% pure, natural, and never diluted or treated with artificial coloring chemicals such as Sudan dye.',
  },
  {
    q: 'How do wholesale discounts and export container orders work?',
    a: 'We offer tiered pricing per 50kg bag or master carton. For export shipments (air freight or 20ft/40ft ocean containers), we provide phytosanitary certification, vacuum packaging, and customs clearance support.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all Nigerian bank debit cards (Mastercard, Visa, Verve), direct bank transfer, and USSD via our secure Flutterwave payment integration.',
  },
]

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex((cur) => (cur === idx ? null : idx))
  }

  return (
    <section className="py-8 sm:py-10 bg-gray-50/60 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 xl:px-0">
        <SectionHeader title="Frequently Asked Questions" href="/contact" linkLabel="Ask a question" />

        <div className="space-y-2.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-4 text-left gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-sm font-bold text-gray-900 leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/30 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default FaqAccordion
