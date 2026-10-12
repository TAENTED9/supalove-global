// Simple in-memory sliding window rate limiter
interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  // Clean expired entry
  if (entry && now > entry.resetAt) {
    rateLimitMap.delete(key)
  }

  const current = rateLimitMap.get(key)

  if (!current) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (current.count >= limit) {
    return { success: false, remaining: 0, resetAt: current.resetAt }
  }

  current.count += 1
  return { success: true, remaining: limit - current.count, resetAt: current.resetAt }
}
