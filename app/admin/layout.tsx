import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AdminLayoutClient from '@/components/AdminLayoutClient'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const { count: monthlyCount } = await supabase
    .from('demos')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', startOfMonth)

  return (
    <AdminLayoutClient monthlyCount={monthlyCount ?? 0} userEmail={user.email ?? ''}>
      {children}
    </AdminLayoutClient>
  )
}
