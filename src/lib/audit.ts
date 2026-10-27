import { prisma } from '@/lib/prisma'

export async function auditAdminAction(action: string, target: string, details: Record<string, unknown>, actor = 'admin') {
  try {
    await prisma.auditLog.create({
      data: {
        actor,
        action,
        target,
        metadata: JSON.stringify({
          ...details,
          createdAt: new Date().toISOString(),
        }),
      },
    })
  } catch (error) {
    console.warn('Audit log failed:', error)
  }
}
