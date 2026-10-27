import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function requireAdmin() {
  const session = await auth()
  const role = (session?.user as { role?: string } | undefined)?.role

  if (!session || role !== 'ADMIN') {
    return null
  }

  return session
}

export function unauthorizedResponse() {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
}

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export function scrubPII(value: string) {
  return value
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[email]')
    .replace(/\b\d{10,15}\b/g, '[phone]')
    .replace(/\b[A-Fa-f0-9]{32,}\b/g, '[token]')
}

export function logSecurityEvent(event: string, details: Record<string, unknown>) {
  const payload = {
    ts: new Date().toISOString(),
    event,
    details: Object.fromEntries(
      Object.entries(details).map(([key, value]) => [key, typeof value === 'string' ? scrubPII(value) : value])
    ),
  }

  console.info(JSON.stringify(payload))
}
