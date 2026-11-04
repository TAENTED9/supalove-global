'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Clock, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import type { ProductItem } from '@/lib/data'

interface SeasonalOffersSectionProps {
  products: ProductItem[]
  endDate?: string // ISO string or timestamp, optional
}

export function SeasonalOffersSection({
  products,
  endDate,
}: SeasonalOffersSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
  } | null>(null)

  useEffect(() => {
    if (!endDate) return

    const target = new Date(endDate).getTime()
    if (isNaN(target)) return

    const updateCountdown = () => {
      const now = Date.now()
      const diff = target - now
      if (diff <= 0) {
        setTimeLeft(null)
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [endDate])

  if (!products.length) return null

  return (
    <section className="py-8 sm:py-10 bg-orange-50/50 border-y border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 xl:px-0">
        {/* Header with orange badge and optional countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-black">
              <Sparkles size={13} />
              <span>Seasonal Offers</span>
            </div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight">
              Limited-Time Bulk Deals
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown timer only if endDate exists */}
            {timeLeft && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950 bg-white/80 border border-orange-200 px-3 py-1 rounded-full">
                <Clock size={13} className="text-orange-500" />
                <span>Ends in:</span>
                <span className="font-black text-orange-600 font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            )}

            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors group"
            >
              <span>View all deals</span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
export default SeasonalOffersSection
