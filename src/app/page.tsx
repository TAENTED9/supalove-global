import { HeroBanner } from '@/components/home/HeroBanner'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { FeaturedSection } from '@/components/home/FeaturedSection'
import { ShopByUnit } from '@/components/home/ShopByUnit'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { ExportCtaBanner } from '@/components/home/ExportCtaBanner'
import { Testimonials } from '@/components/home/Testimonials'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { getCategories, getFeaturedProducts } from '@/lib/data'

export const revalidate = 60

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ])

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Banner with CTA & Inline Search */}
      <HeroBanner />

      {/* 2. Category Strip (Grains, Oils, Beans, Roots, Spices, Beverages) */}
      <CategoryStrip categories={categories} />

      {/* 3. Featured Products Grid */}
      <FeaturedSection products={featuredProducts} />

      {/* 4. Shop by Unit (Bags, Kilograms, Litres, Cartons) */}
      <ShopByUnit />

      {/* 5. Why Choose Us (Quality, Export, Delivery) */}
      <WhyChooseUs />

      {/* 6. B2B / Export Commercial Container Banner */}
      <ExportCtaBanner />

      {/* 7. Customer Testimonials */}
      <Testimonials />

      {/* 8. Newsletter Subscription */}
      <NewsletterSection />
    </div>
  )
}
