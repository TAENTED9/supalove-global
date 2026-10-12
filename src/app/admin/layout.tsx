import { Metadata } from 'next'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Supalovefoods',
  description: 'Manage foodstuffs, inventory, commodities, and customer orders.',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
