export function getAppUrl(request?: Request): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (configuredUrl) return new URL(configuredUrl).origin

  if (request) return new URL(request.url).origin

  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl}`

  return 'http://localhost:3000'
}
