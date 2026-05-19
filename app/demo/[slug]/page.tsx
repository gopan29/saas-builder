import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { reservations, customers, dogs, lineCandidates, eparkEntries, medicalRecords, relativeTime } from '@/lib/sample-data'
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

  // ===== dog_salon dashboard =====
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const weekday = ['日', '月', '火', '水', '木', '金', '土'][now.getDay()]
  const todayLabel = `${now.getMonth() + 1}月${now.getDate()}日(${weekday})`

  const todayReservations = reservations.filter(r => r.date === todayStr).sort((a, b) => a.time.localeCompare(b.time))
  const pendingLine = lineCandidates.filter(l => l.status === 'pending').length
  const pendingEpark = eparkEntries.filter(e => !e.is_transferred).length
  const confirmedToday = todayReservations.filter(r => r.status === 'confirmed').length

  // 月別売上 (過去6か月)
  type MonthBucket = { label: string; total: number }
  const months: MonthBucket[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const ym = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`
    const total = medicalRecords
      .filter(r => r.visit_date.startsWith(ym))
      .reduce((s, r) => s + r.price, 0)
    months.push({ label: `${d.getMonth() + 1}月`, total })
  }
  const maxMonth = Math.max(1, ...months.map(m => m.total))
  const currentMonthSales = months[months.length - 1].total
  const prevMonthSales = months[months.length - 2]?.total ?? 0
  const monthGrowth = prevMonthSales > 0 ? Math.round(((currentMonthSales - prevMonthSales) / prevMonthSales) * 100) : 0

  // 人気メニュー
  const menuCount: Record<string, number> = {}
  medicalRecords.forEach(r => { menuCount[r.service_type] = (menuCount[r.service_type] ?? 0) + 1 })
  const popularMenu = Object.entries(menuCount).sort((a, b) => b[1] - a[1]).slice(0, 3)
  const menuTotal = medicalRecords.length

  // リピート率
  const repeatRate = Math.round((customers.filter(c => c.visit_count >= 3).length / customers.length) * 100)

  // 最近のアクティビティ (LINE + eパーク + カルテ をマージして時系列降順)
  type Activity = { ts: string; icon: string; bg: string; text: string; href: string }
  const activities: Activity[] = []
  lineCandidates.forEach(l => activities.push({
    ts: l.received_at,
    icon: '💬', bg: 'bg-green-50',
    text: `LINE: ${l.sender_name}さんから新着メッセージ`,
    href: `/demo/${slug}/line`,
  }))
  eparkEntries.filter(e => !e.is_transferred).forEach(e => activities.push({
    ts: `${e.reservation_date} ${e.reservation_time}`,
    icon: '🔗', bg: 'bg-orange-50',
    text: `eパーク: ${e.customer_name}様 (${e.dog_name}) ${e.service_type}`,
    href: `/demo/${slug}/epark`,
  }))
  medicalRecords.slice(0, 4).forEach(r => activities.push({
    ts: `${r.visit_date} 12:00`,
    icon: '📋', bg: 'bg-blue-50',
    text: `カルテ更新: ${r.dog_name}ちゃん (${r.customer_name}様)`,
    href: `/demo/${slug}/records`,
  }))
  activities.sort((a, b) => b.ts.localeCompare(a.ts))
  const recentActivities = activities.slice(0, 6)

  const stats: { label: string; value: number | string; unit: string; sub: string; alert?: boolean; href?: string }[] = [
    { label: '今日の予約', value: todayReservations.length, unit: '件', sub: `確定 ${confirmedToday}件`, href: `/demo/${slug}/reservations` },
    { label: 'LINE対応待ち', value: pendingLine, unit: '件', sub: '要確認', alert: pendingLine > 0, href: `/demo/${slug}/line` },
    { label: 'eパーク未転記', value: pendingEpark, unit: '件', sub: '要転記', alert: pendingEpark > 0, href: `/demo/${slug}/epark` },
    { label: '登録顧客数', value: customers.length, unit: '名', sub: '累計', href: `/demo/${slug}/customers` },
    { label: '登録わんちゃん', value: dogs.length, unit: '頭', sub: '累計', href: `/demo/${slug}/dogs` },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">ダッシュボード</h1>
        <p className="text-sm text-gray-400 mt-0.5">{todayLabel}の業務サマリ</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href ?? '#'}
            className="bg-white rounded-xl border p-3 sm:p-4 transition-shadow hover:shadow-sm"
            style={{ borderColor: stat.alert ? '#fca5a5' : '#e5e7eb' }}
          >
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: stat.alert ? '#ef4444' : color }}>
              {stat.value}<span className="text-sm font-normal text-gray-400 ml-1">{stat.unit}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </Link>
        ))}
      </div>

      {/* Today's reservations */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800 text-sm">今日の予約</h2>
          <Link href={`/demo/${slug}/reservations`} className="text-xs hover:underline" style={{ color }}>
            すべて見る →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {todayReservations.length === 0 ? (
            <p className="px-4 sm:px-5 py-6 text-sm text-gray-400 text-center">本日の予約はありません</p>
          ) : todayReservations.map(r => (
            <Link
              key={r.id}
              href={`/demo/${slug}/reservations/${r.id}`}
              className="px-3 sm:px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-bold text-gray-500 w-12 flex-shrink-0">{r.time}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800">{r.dog_name}</span>
                  <span className="text-sm text-gray-500">{r.customer_name}様</span>
                </div>
                <p className="text-xs text-gray-400">{r.service_type} ・ 担当: {r.staff}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${r.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {r.status === 'confirmed' ? '確定' : '仮予約'}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Sales + Popular menu + Repeat rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly sales */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-bold text-gray-800">月別売上推移</h2>
              <p className="text-xs text-gray-400 mt-0.5">過去6か月（カルテ登録ベース）</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color }}>¥{currentMonthSales.toLocaleString()}</p>
              <p className={`text-xs font-medium ${monthGrowth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                先月比 {monthGrowth >= 0 ? '+' : ''}{monthGrowth}%
              </p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {months.map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gray-50 rounded-t-md relative flex items-end" style={{ height: '100%' }}>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${(m.total / maxMonth) * 100}%`,
                      backgroundColor: i === months.length - 1 ? color : color + '60',
                    }}
                    title={`${m.label}: ¥${m.total.toLocaleString()}`}
                  />
                </div>
                <span className="text-xs text-gray-400">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular menu + repeat */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3">人気メニュー</h2>
            <div className="space-y-2">
              {popularMenu.map(([menu, count], i) => (
                <div key={menu}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">
                      <span className="inline-block w-4 text-center font-bold mr-1" style={{ color }}>{i + 1}</span>
                      {menu}
                    </span>
                    <span className="text-xs font-bold text-gray-500">{count}件</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(count / menuTotal) * 100}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-2">リピート率</h2>
            <p className="text-3xl font-bold" style={{ color }}>{repeatRate}<span className="text-base font-normal text-gray-400 ml-1">%</span></p>
            <p className="text-xs text-gray-400 mt-1">3回以上来店の顧客比率</p>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-3">最近のアクティビティ</h2>
        <div className="space-y-2.5">
          {recentActivities.map((a, i) => (
            <Link key={i} href={a.href} className={`flex items-start gap-3 ${a.bg} rounded-lg px-3 py-2.5 hover:opacity-80 transition-opacity`}>
              <span className="text-base shrink-0">{a.icon}</span>
              <p className="text-xs text-gray-700 leading-relaxed flex-1 min-w-0 break-words">{a.text}</p>
              <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">{relativeTime(a.ts)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
