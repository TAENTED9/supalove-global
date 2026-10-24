import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

export function Logo({ className = '', iconOnly = false, size = 'md', showTagline = false }: LogoProps) {
  const iconDimensions = {
    sm: { width: 32, height: 32, className: 'w-8 h-8' },
    md: { width: 40, height: 40, className: 'w-10 h-10' },
    lg: { width: 48, height: 48, className: 'w-12 h-12' },
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const currentIcon = iconDimensions[size]
  const tagline = process.env.NEXT_PUBLIC_TAGLINE || 'Export · Wholesale · Retail'

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Brand Icon using logo-mark.png (icon only) */}
      <div className={`relative ${currentIcon.className} shrink-0 group-hover:scale-105 transition-transform duration-200 flex items-center justify-center`}>
        <Image
          src="/logo-mark.png"
          alt="Supalovefoods Logo"
          width={currentIcon.width}
          height={currentIcon.height}
          priority
          className="object-contain w-full h-full"
        />
      </div>

      {/* Brand Typography: green orange green */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center leading-none tracking-tight">
            <span className={`font-extrabold text-brand-green ${textSizes[size]}`}>
              Supa
            </span>
            <span className={`font-extrabold text-brand-orange ${textSizes[size]}`}>
              love
            </span>
            <span className={`font-extrabold text-brand-green ${textSizes[size]}`}>
              foods
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-0.5 leading-none">
              {tagline}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
export default Logo
