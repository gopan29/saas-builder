import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { medicalRecords } from '@/lib/sample-data'
import BeautySalonRecords from '@/components/demo/beauty-salon/RecordsContent'
import DentalRecords from '@/components/demo/dental-clinic/RecordsContent'
import RestaurantSales from '@/components/demo/restaurant/SalesContent'
import EstheticRecords from '@/components/demo/esthetic-salon/RecordsContent'
import OsteopathicRecords from '@/components/demo/osteopathic-clinic/RecordsContent'
import JukuAttendance from '@/components/demo/juku/AttendanceContent'
import YogaRevenue from '@/components/demo/yoga-fitness/RevenueContent'

type Props = { params: Promise<{ slug: string }> }

export default async function RecordsPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: demo } = await supabase.from('demos').select('industry_template').eq('slug', slug).single()
  if (!demo) notFound()

  if (demo.industry_template === 'beauty_salon') return <BeautySalonRecords />
  if (demo.industry_template === 'dental_clinic') return <DentalRecords />
  if (demo.industry_template === 'restaurant') return <RestaurantSales />
  if (demo.industry_template === 'esthetic_salon') return <EstheticRecords />
  if (demo.industry_template === 'osteopathic_clinic') return <OsteopathicRecords />
  if (demo.industry_template === 'juku') return <JukuAttendance />
  if (demo.industry_template === 'yoga_fitness') return <YogaRevenue />

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">簡易カルテ</h1>
          <p className="text-sm text-gray-400 mt-0.5">来店 {medicalRecords.length} 件の記録</p>
        </div>
        <button className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg opacity-60 cursor-default whitespace-nowrap">＋ 新規記録（デモ）</button>
      </div>
      <div className="space-y-3">
        {medicalRecords.sort((a, b) => b.visit_date.localeCompare(a.visit_date)).map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-lg">🐶</span>
                  <span className="font-bold text-gray-800">{r.dog_name}</span>
                  <span className="text-sm text-gray-400">｜ {r.customer_name} 様</span>
                  <span className="text-xs bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full">{r.service_type}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-gray-400 mb-1">状態・所見</p>
                    <p className="text-sm text-gray-700">{r.condition}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-blue-400 mb-1">担当者メモ</p>
                    <p className="text-sm text-gray-700">{r.groomer_notes}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <span className="text-xs text-gray-400">🗓 次回: <span className="text-gray-600 font-medium">{new Date(r.next_visit_scheduled).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}</span></span>
                  <span className="text-xs text-gray-400">💴 料金: <span className="text-gray-600 font-medium">¥{r.price.toLocaleString()}</span></span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-gray-500">{new Date(r.visit_date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}</p>
                <p className="text-xs text-gray-300">{new Date(r.visit_date).getFullYear()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
