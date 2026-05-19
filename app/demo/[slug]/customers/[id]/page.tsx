import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { customers, dogs, reservations, medicalRecords, statusMap, relativeTime } from '@/lib/sample-data'

type Props = { params: Promise<{ slug: string; id: string }> }

export default async function CustomerDetailPage({ params }: Props) {
  const { slug, id } = await params
  const supabase = await createClient()
  const { data: demo } = await supabase
    .from('demos')
    .select('industry_template, theme_color')
    .eq('slug', slug)
    .single()

  if (!demo || demo.industry_template !== 'dog_salon') notFound()

  const customer = customers.find(c => c.id === id)
  if (!customer) notFound()

  const c = demo.theme_color
  const myDogs = dogs.filter(d => d.customer_id === customer.id)
  const myRecords = medicalRecords.filter(r => r.customer_name === customer.name).sort((a, b) => b.visit_date.localeCompare(a.visit_date))
  const myReservations = reservations.filter(r => r.customer_id === customer.id).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const totalSpent = myRecords.reduce((s, r) => s + r.price, 0)
  const lastVisit = myRecords[0]?.visit_date

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link href={`/demo/${slug}/customers`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        顧客一覧に戻る
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ backgroundColor: c }}>
            {customer.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">{customer.name} 様</h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: c + '20', color: '#831843' }}>
                来店 {customer.visit_count} 回
              </span>
            </div>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1.5"><span className="text-gray-400">📞</span>{customer.phone}</div>
              <div className="flex items-center gap-1.5 truncate"><span className="text-gray-400">✉️</span><span className="truncate">{customer.email}</span></div>
              <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2"><span className="text-gray-400">📍</span>{customer.address}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-400">累計利用額</p>
          <p className="text-lg sm:text-2xl font-bold" style={{ color: c }}>¥{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-400">登録ワンちゃん</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-800">{myDogs.length}<span className="text-xs font-normal text-gray-400 ml-1">頭</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-400">最終来店</p>
          <p className="text-xs sm:text-sm font-bold text-gray-800 mt-1">{lastVisit ? relativeTime(lastVisit) : '—'}</p>
        </div>
      </div>

      {/* Dogs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700">登録ワンちゃん</h2>
          <span className="text-xs text-gray-400">{myDogs.length}頭</span>
        </div>
        {myDogs.length === 0 ? (
          <p className="px-4 sm:px-5 py-6 text-sm text-gray-400 text-center">登録なし</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {myDogs.map(d => (
              <Link
                key={d.id}
                href={`/demo/${slug}/dogs/${d.id}`}
                className="px-3 sm:px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🐶</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-800">{d.name}</span>
                    <span className="text-xs text-gray-500">{d.breed}</span>
                  </div>
                  <p className="text-xs text-gray-400">{d.gender} ・ {d.weight}kg</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming reservations */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700">今後の予約</h2>
          <span className="text-xs text-gray-400">{myReservations.length}件</span>
        </div>
        {myReservations.length === 0 ? (
          <p className="px-4 sm:px-5 py-6 text-sm text-gray-400 text-center">今後の予約はありません</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {myReservations.map(r => {
              const s = statusMap[r.status]
              return (
                <Link
                  key={r.id}
                  href={`/demo/${slug}/reservations/${r.id}`}
                  className="px-3 sm:px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center w-14 shrink-0">
                    <p className="text-xs text-gray-400">{r.date.slice(5).replace('-', '/')}</p>
                    <p className="text-sm font-bold text-gray-700">{r.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-gray-800">{r.dog_name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>
                    </div>
                    <p className="text-xs text-gray-400">{r.service_type} ・ {r.staff}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Past records */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-700">過去のカルテ</h2>
          <span className="text-xs text-gray-400">{myRecords.length}件</span>
        </div>
        {myRecords.length === 0 ? (
          <p className="px-4 sm:px-5 py-6 text-sm text-gray-400 text-center">カルテはありません</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {myRecords.slice(0, 5).map(r => (
              <div key={r.id} className="px-3 sm:px-5 py-3">
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{r.dog_name}</span>
                    <span className="text-xs text-gray-500">{r.service_type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{relativeTime(r.visit_date)}</span>
                    <span className="text-xs font-bold text-gray-700">¥{r.price.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{r.groomer_notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
