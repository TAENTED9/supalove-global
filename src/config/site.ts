/**
 * Centralized site configuration from environment variables
 * All business contact info and branding come from here
 */

export interface SiteConfig {
  name: string
  tagline: string
  email: string
  phone: string
  phoneIntl: string
  whatsapp: string
  address: string
  siteUrl: string
  socials: {
    instagram: string
    facebook: string
    x: string
  }
}

const getEnvVar = (key: string, fallback: string): string => {
  return process.env[key] || fallback
}

/**
 * Convert phone number with leading 0 to international format (+234)
 * E.g., "08032336789" -> "+2348032336789"
 */
export const formatPhoneIntl = (phone: string): string => {
  if (!phone) return ''
  const trimmed = phone.trim()
  if (trimmed.startsWith('0')) {
    return '+234' + trimmed.slice(1)
  }
  return trimmed
}

const rawPhone = getEnvVar('NEXT_PUBLIC_CONTACT_PHONE', '+2348032336789')
const rawWhatsapp = getEnvVar('NEXT_PUBLIC_WHATSAPP', rawPhone)

export const siteConfig: SiteConfig = {
  name: getEnvVar('NEXT_PUBLIC_SITE_NAME', 'Supalovefoods'),
  tagline: getEnvVar('NEXT_PUBLIC_TAGLINE', 'Export · Wholesale · Retail'),
  email: getEnvVar('NEXT_PUBLIC_CONTACT_EMAIL', 'supaloveglobal@gmail.com'),
  phone: rawPhone,
  phoneIntl: formatPhoneIntl(rawPhone),
  whatsapp: rawWhatsapp,
  address: getEnvVar('NEXT_PUBLIC_ADDRESS', getEnvVar('NEXT_PUBLIC_CONTACT_ADDRESS', 'No 1, Arobaba Street, Pipeline Road, Idimu, Lagos.')),
  siteUrl: getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'),
  socials: {
    instagram: getEnvVar('NEXT_PUBLIC_SOCIAL_INSTAGRAM', getEnvVar('NEXT_PUBLIC_INSTAGRAM', '')),
    facebook: getEnvVar('NEXT_PUBLIC_SOCIAL_FACEBOOK', getEnvVar('NEXT_PUBLIC_FACEBOOK', '')),
    x: getEnvVar('NEXT_PUBLIC_SOCIAL_X', getEnvVar('NEXT_PUBLIC_X', '')),
  },
}

/**
 * Generate tel: href for phone numbers
 */
export const telHref = (phone?: string): string => {
  const target = phone || siteConfig.phoneIntl || siteConfig.phone
  const cleanPhone = target.replace(/[^0-9+]/g, '')
  return `tel:${cleanPhone}`
}

/**
 * Generate mailto: href for email addresses
 */
export const mailHref = (email?: string): string => {
  const target = email || siteConfig.email
  return `mailto:${target}`
}

/**
 * Generate WhatsApp href
 * Supports:
 * - whatsappHref() -> wa.me/<siteConfig.whatsapp>
 * - whatsappHref("Hello") -> wa.me/<siteConfig.whatsapp>?text=Hello
 * - whatsappHref("+234...", "Hello") -> wa.me/<phone>?text=Hello
 */
export const whatsappHref = (messageOrPhone?: string, message?: string): string => {
  let targetPhone = siteConfig.whatsapp || siteConfig.phone
  let text = ''

  if (message !== undefined) {
    targetPhone = messageOrPhone || targetPhone
    text = message
  } else if (messageOrPhone) {
    text = messageOrPhone
  }

  const cleanPhone = targetPhone.replace(/[^0-9]/g, '')
  const encoded = text ? encodeURIComponent(text) : ''
  return `https://wa.me/${cleanPhone}${encoded ? `?text=${encoded}` : ''}`
}

// Backward compatibility helpers
export const getWhatsappHref = (): string => whatsappHref()
export const siteWhatsappHref = (message?: string): string => whatsappHref(message)
export const phoneIntl = formatPhoneIntl

