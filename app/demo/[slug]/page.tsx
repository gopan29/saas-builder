import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { reservations, customers, dogs, lineCandidates, eparkEntries } from '@/lib/sample-data'
import { beautyReservations, beautyCustomers, beautyLineCandidates } from '@/lib/sample-data-beauty'
import BeautySalonDashboard from '@/components/demo/beauty-salon/DashboardContent'
import DentalDashboard from '@/components/demo/dental-clinic/DashboardContent'
import RestaurantDashboard from '@/components/demo/restaurant/DashboardContent'
import EstheticDashboard from '@/components/demo/esthetic-salon/DashboardContent'
import OsteopathicDashboard from '@/components/demo/osteopathic-clinic/DashboardContent'
import JukuDashboard from '@/components/demo/juku/DashboardContent'
import YogaDashboard from '@/components/demo/yoga-fitness/DashboardContent'

type Props = { params: Promise<{ slug: string }> }

export default async function DemoDashboard({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: demo } = await supabase.from('demos').select('theme_color, industry_template').eq('slug', slug).single()
  if (!demo) notFound()

  const color = demo.theme_color

  if (demo.industry_template === 'beauty_salon') return <BeautySalonDashboard themeColor={color} />
  if (demo.industry_template === 'dental_clinic') return <DentalDashboard themeColor={color} />
  if (demo.industry_template === 'restaurant') return <RestaurantDashboard themeColor={color} />
  if (demo.industry_template === 'esthetic_salon') return <EstheticDashboard themeColor={color} />
  if (demo.industry_template === 'osteopathic_clinic') return <OsteopathicDashboard themeColor={color} />
  if (demo.industry_template === 'juku') return <JukuDashboard themeColor={color} />
  if (demo.industry_template === 'yoga_fitness') return <YogaDashboard themeColor={color} />

  // dog_salon
  const todayReservations = reservations.filter(r => r.date === '2026-04-27')
  const pendingLine = lineCandidates.filter(l => l.status === 'pending').length
  const pendingEpark = eparkEntries.filter(e => !e.is_transferred).length
  const confirmedToday = todayReservations.filter(r => r.status === 'confirmed').length

  const stats = [
    { label: '今日の予約', value: todayReservations.length, unit: '件', sub: `確定 ${confirmedToday}件` },
    { label: '登録顧客数', value: customers.length, unit: '名', sub: '累計' },
    { label: '登録わんちゃん', value: dogs.length, unit: '頭', sub: '累計' },
    { label: 'LINE対応待ち', value: pendingLine, unit: '件', sub: '要確認', alert: pendingLine > 0 },
    { label: 'eパーク未転記', value: pendingEpark, unit: '件', sub: '要転記', alert: pendingEpark > 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">ダッシュボード</h1>
        <p className="text-sm text-gray-400 mt-0.5">本日の業務サマリ</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border p-3 sm:p-4" style={{ borderColor: stat.alert ? '#fca5a5' : '#e5e7eb' }}>
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: stat.alert ? '#ef4444' : color }}>
              {stat.value}<span className="text-sm font-normal text-gray-400 ml-1">{stat.unit}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-sm">今日の予約</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {todayReservations.length === 0 ? (
            <p className="px-4 sm:px-5 py-6 text-sm text-gray-400 text-center">本日の予約はありません</p>
          ) : todayReservations.map(r => (
            <div key={r.id} className="px-3 sm:px-4 py-3 flex items-center gap-3">
              <span className="text-sm font-bold text-gray-500 w-12 flex-shrink-0">{r.time}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800">{r.dog_name}</span>
                  <span className="text-sm text-gray-500">{r.customer_name}様</span>
                </div>
                <p className="text-xs text-gray-400">{r.service_type}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${r.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {r.status === 'confirmed' ? '確定' : '仮予約'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
