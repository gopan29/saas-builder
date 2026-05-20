import { createClient } from '@/lib/supabase-server'
import type { Demo } from '@/types/demo'
import AdminDashboard from '@/components/AdminDashboard'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: demos } = await supabase
    .from('demos')
    .select('*')
    .order('updated_at', { ascending: false })

  const allDemos: Demo[] = demos ?? []

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const active = allDemos.filter(d => d.is_active).length
  const inactive = allDemos.filter(d => !d.is_active).length
  const thisMonth = allDemos.filter(d => new Date(d.created_at) >= startOfMonth).length
  const lastMonth = allDemos.filter(d => {
    const t = new Date(d.created_at)
    return t >= startOfLastMonth && t <= endOfLastMonth
  }).length

  const avgUpdateDays = allDemos.length > 0
    ? allDemos.reduce((sum, d) => {
        return sum + (now.getTime() - new Date(d.updated_at).getTime()) / 86400000
      }, 0) / allDemos.length
    : 0

  const stats = {
    total: allDemos.length,
    active,
    inactive,
    thisMonth,
    lastMonth,
    avgUpdateDays: Math.round(avgUpdateDays * 10) / 10,
  }

  return <AdminDashboard demos={allDemos} stats={stats} />
}
