import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { authConfig } from '@/lib/auth.config'
import { checkRateLimit } from '@/lib/rateLimit'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Rate limiting: 3 attempts per 15 minutes per IP + email
        const ip = req?.headers?.get('x-forwarded-for') || req?.headers?.get('x-real-ip') || 'unknown'
        const emailAttempt = String(credentials?.email || '').trim().toLowerCase()
        const rateLimit = checkRateLimit(`login:${ip}:${emailAttempt}`, 3, 15 * 60 * 1000)
        if (!rateLimit.success) {
          throw new Error('Too many failed login attempts. Please try again in 15 minutes.')
        }

        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
          console.error('ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables')
          return null
        }

        if (parsed.data.email !== adminEmail || parsed.data.password !== adminPassword) {
          return null
        }

        return { id: 'admin', email: adminEmail, role: 'ADMIN' }
      },
    }),
  ],
})
