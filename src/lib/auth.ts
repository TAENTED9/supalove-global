import crypto from 'crypto'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { authConfig } from '@/lib/auth.config'
import { checkRateLimit } from '@/lib/rateLimit'

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
})

function secureCompare(input: string, expected: string) {
  const inputBuf = Buffer.from(input)
  const expectedBuf = Buffer.from(expected)

  if (inputBuf.length !== expectedBuf.length) {
    return false
  }

  try {
    return crypto.timingSafeEqual(inputBuf, expectedBuf)
  } catch {
    return false
  }
}

async function verifyAdminPassword(inputPassword: string, storedValue: string) {
  if (storedValue.startsWith('$2a$') || storedValue.startsWith('$2b$') || storedValue.startsWith('$2y$')) {
    return compare(inputPassword, storedValue)
  }

  return secureCompare(inputPassword, storedValue)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const ip = req?.headers?.get('x-forwarded-for') || req?.headers?.get('x-real-ip') || 'unknown'
        const emailAttempt = String(credentials?.email || '').trim().toLowerCase()
        const rateLimit = checkRateLimit(`login:${ip}:${emailAttempt}`, 3, 15 * 60 * 1000)

        if (!rateLimit.success) {
          return null
        }

        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPasswordHash) {
          console.error('ADMIN_EMAIL or ADMIN_PASSWORD_HASH not configured')
          return null
        }

        const emailMatches = parsed.data.email.trim().toLowerCase() === adminEmail
        const passwordMatches = await verifyAdminPassword(parsed.data.password, adminPasswordHash)

        if (!emailMatches || !passwordMatches) {
          return null
        }

        return { id: 'admin', email: adminEmail, role: 'ADMIN' }
      },
    }),
  ],
})

export async function requireAdmin() {
  const session = await auth()
  const role = (session?.user as { role?: string } | undefined)?.role

  if (!session || role !== 'ADMIN') {
    return null
  }

  return session
}
