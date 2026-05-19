import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { reservations, statusMap } from '@/lib/sample-data'
import BeautySalonReservations from '@/components/demo/beauty-salon/ReservationsContent'
import DentalReservations from '@/components/demo/dental-clinic/ReservationsContent'
import RestaurantReservations from '@/components/demo/restaurant/ReservationsContent'
import EstheticReservations from '@/components/demo/esthetic-salon/ReservationsContent'
import OsteopathicReservations from '@/components/demo/osteopathic-clinic/ReservationsContent'
import JukuClasses from '@/components/demo/juku/ClassesContent'
import YogaClasses from '@/components/demo/yoga-fitness/ClassesContent'

type Props = { params: Promise<{ slug: string }> }

export default async function ReservationsPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: demo } = await supabase.from('demos').select('industry_template').eq('slug', slug).single()
  if (!demo) notFound()

  if (demo.industry_template === 'beauty_salon') return <BeautySalonReservations />
  if (demo.industry_template === 'dental_clinic') return <DentalReservations />
  if (demo.industry_template === 'restaurant') return <RestaurantReservations />
  if (demo.industry_template === 'esthetic_salon') return <EstheticReservations />
  if (demo.industry_template === 'osteopathic_clinic') return <OsteopathicReservations />
  if (demo.industry_template === 'juku') return <JukuClasses />
  if (demo.industry_template === 'yoga_fitness') return <YogaClasses />

  const grouped: Record<string, typeof reservations> = {}
  reservations.forEach(r => {
    if (!grouped[r.date]) grouped[r.date] = []
    grouped[r.date].push(r)
  })

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })

  const sourceIcon: Record<string, string> = { '電話': '📞', 'LINE': '💬', 'eパーク': '🔗', '窓口': '🏠' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">予約管理</h1>
          <p className="text-sm text-gray-400 mt-0.5">全 {reservations.length} 件</p>
        </div>
        <button className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg opacity-60 cursor-default whitespace-nowrap">＋ 新規予約（デモ）</button>
      </div>
      {Object.entries(grouped).sort().map(([date, items]) => (
        <div key={date} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-600">{formatDate(date)}</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {items.sort((a, b) => a.time.localeCompare(b.time)).map(r => {
              const s = statusMap[r.status]
              return (
                <Link
                  key={r.id}
                  href={`/demo/${slug}/reservations/${r.id}`}
                  className="px-3 sm:px-4 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-12 flex-shrink-0 text-center">
                    <p className="text-sm font-bold text-gray-700">{r.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800">{r.dog_name}</span>
                      <span className="text-sm text-gray-500">{r.customer_name} 様</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-sm text-gray-500">{r.service_type}</p>
                      <p className="text-xs text-gray-400">{sourceIcon[r.source] ?? ''} {r.source}</p>
                    </div>
                    {r.notes && <p className="text-xs text-gray-400 mt-0.5">📝 {r.notes}</p>}
                  </div>
                  <svg className="w-4 h-4 text-gray-300 self-center shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
