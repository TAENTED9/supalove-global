// Simple in-memory sliding window rate limiter
interface RateLimitEntry {
  count: number
  resetAt: number
}

interface IdempotencyEntry {
  reference: string
  paymentUrl: string
  expiresAt: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()
const idempotencyMap = new Map<string, IdempotencyEntry>()

export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

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

export function getIdempotencyRecord(key: string) {
  const entry = idempotencyMap.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    idempotencyMap.delete(key)
    return null
  }
  return entry
}

export function setIdempotencyRecord(key: string, reference: string, paymentUrl: string, ttlMs = 60 * 60 * 1000) {
  idempotencyMap.set(key, { reference, paymentUrl, expiresAt: Date.now() + ttlMs })
}
