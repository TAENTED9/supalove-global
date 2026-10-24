import { Star, Quote, CheckCircle2 } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Mrs. Folake Adeyemi',
    role: 'Catering Director, The Palms Banquet (Lagos)',
    content: 'We order twenty 50kg bags of parboiled rice and Ijebu garri monthly. The rice is genuinely 100% stone-free, which saves our prep cooks hours. Delivery is always right on time.',
    rating: 5,
    location: 'Lagos, Nigeria',
  },
  {
    name: 'Chinedu Eze',
    role: 'Diaspora Grocery Buyer (Peckham, London)',
    content: 'Exporting food items to the UK used to be a nightmare with customs inspection. Supalovefoods handles the phyto-sanitary documentation and moisture packaging flawlessly. The smoked crayfish arrives fragrant and dry.',
    rating: 5,
    location: 'London, United Kingdom',
  },
  {
    name: 'Hadiza Bello',
    role: 'Household Buyer (Abuja)',
    content: 'The 25L red palm oil is the cleanest I have ever bought online in Nigeria. It does not curdle or smell burnt. Truly unadulterated South-South palm oil. Ordering online with Flutterwave was super easy.',
    rating: 5,
    location: 'Abuja, FCT',
  },
]

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Customer Feedback &amp; Diaspora Trust
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            What Our Food Buyers Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Trusted by over 1,500 commercial caterers, grocery distributors, and diaspora families across Nigeria, the UK, Canada, and the US.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review) => (
            <div
              key={review.name}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={20} className="text-slate-200" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{review.content}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {review.name}
                    <CheckCircle2 size={13} className="text-brand-green" />
                  </h4>
                  <p className="text-[11px] text-slate-400">{review.role}</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {review.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default Testimonials
