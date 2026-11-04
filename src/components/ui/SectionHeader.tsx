import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  /** Optional "View all" link URL */
  href?: string
  /** Optional link label (defaults to "View all") */
  linkLabel?: string
  className?: string
}

/**
 * Compact section header matching Campify spec:
 * small-bold title left, optional "View all →" link right.
 * Replaces the old eyebrow + text-5xl + paragraph hero-style headings.
 */
export function SectionHeader({
  title,
  href,
  linkLabel = 'View all',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-5', className)}>
      <h2 className="text-lg font-black text-gray-900 tracking-tight">{title}</h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors group"
        >
          <span>{linkLabel}</span>
          <ArrowRight
            size={14}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      )}
    </div>
  )
}

export default SectionHeader
