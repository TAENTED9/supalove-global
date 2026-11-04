import { HeroBanner } from '@/components/home/HeroBanner'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { NewArrivalsSection } from '@/components/home/NewArrivalsSection'
import { SeasonalOffersSection } from '@/components/home/SeasonalOffersSection'
import { ShopByUnit } from '@/components/home/ShopByUnit'
import { WholesaleCtaBand } from '@/components/home/WholesaleCtaBand'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { DeliveryPaymentInfo } from '@/components/home/DeliveryPaymentInfo'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { FinalCtaSection } from '@/components/home/FinalCtaSection'
import {
  getCategories,
  getFeaturedProducts,
  getNewArrivals,
  getSeasonalOffers,
} from '@/lib/data'

export const revalidate = 60

export default async function HomePage() {
  const [categories, featuredProducts, newArrivals, seasonalOffers] =
    await Promise.all([
      getCategories(),
      getFeaturedProducts(),
      getNewArrivals(),
      getSeasonalOffers(),
    ])

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero: compact, one CTA + trust chips */}
      <HeroBanner />

      {/* 2. Category chips strip: horizontal scroll on mobile */}
      <CategoryStrip categories={categories} />

      {/* 3. Featured / Best Sellers */}
      <FeaturedSection products={featuredProducts} />

      {/* 4. New Arrivals */}
      <NewArrivalsSection products={newArrivals} />

      {/* 5. Seasonal Offers (orange, optional countdown) */}
      <SeasonalOffersSection products={seasonalOffers} />

      {/* 6. Shop by Unit (Bags / Kg / Litres) */}
      <ShopByUnit />

      {/* 7. Wholesale CTA band */}
      <WholesaleCtaBand />

      {/* 8. Why Choose Us */}
      <WhyChooseUs />

      {/* 9. Delivery & Payment info */}
      <DeliveryPaymentInfo />

      {/* 10. FAQ accordion */}
      <FaqAccordion />

      {/* 11. Final CTA */}
      <FinalCtaSection />
    </div>
  )
}
