import sharp from 'sharp'
import { siteConfig } from '@/config/site'

export const runtime = 'nodejs'
export const dynamic = 'force-static'

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
    }
    return entities[character]
  })
}

export async function GET() {
  const name = escapeXml(siteConfig.name)
  const image = await sharp(Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#176b32"/>
          <stop offset="68%" stop-color="#2FA84F"/>
          <stop offset="100%" stop-color="#FBAE3C"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#background)"/>
      <circle cx="1090" cy="90" r="220" fill="#ffffff" opacity=".08"/>
      <circle cx="1050" cy="620" r="300" fill="#ffffff" opacity=".06"/>
      <text x="84" y="152" fill="#ffffff" font-family="Arial, sans-serif" font-size="30" font-weight="700" letter-spacing="5">${name}</text>
      <text x="84" y="285" fill="#ffffff" font-family="Arial, sans-serif" font-size="66" font-weight="800">Nigerian pantry staples,</text>
      <text x="84" y="365" fill="#ffffff" font-family="Arial, sans-serif" font-size="66" font-weight="800">delivered with care.</text>
      <text x="84" y="455" fill="#ffffff" font-family="Arial, sans-serif" font-size="29">Quality foodstuff for everyday homes and wholesale buyers</text>
    </svg>
  `)).png().toBuffer()

  return new Response(new Uint8Array(image), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  })
}
