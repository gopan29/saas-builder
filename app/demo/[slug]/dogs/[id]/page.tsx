import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { customers, dogs, reservations, medicalRecords, statusMap, relativeTime } from '@/lib/sample-data'

type Props = { params: Promise<{ slug: string; id: string }> }

function getAgeText(birthDate: string): string {
  const birth = new Date(birthDate)
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  if (months < 0) { years -= 1; months += 12 }
  return `${years}歳${months}ヶ月`
}

export default async function DogDetailPage({ params }: Props) {
  const { slug, id } = await params
  const supabase = await createClient()
  const { data: demo } = await supabase
    .from('demos')
    .select('industry_template, theme_color')
    .eq('slug', slug)
    .single()

  if (!demo || demo.industry_template !== 'dog_salon') notFound()

  const dog = dogs.find(d => d.id === id)
  if (!dog) notFound()
  const owner = customers.find(c => c.id === dog.customer_id)

  const c = demo.theme_color
  const myRecords = medicalRecords.filter(r => r.dog_id === dog.id).sort((a, b) => b.visit_date.localeCompare(a.visit_date))
  const myReservations = reservations.filter(r => r.dog_id === dog.id).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const totalSpent = myRecords.reduce((s, r) => s + r.price, 0)
  const lastVisit = myRecords[0]?.visit_date

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link href={`/demo/${slug}/dogs`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        ワンちゃん一覧に戻る
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">🐶</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">{dog.name} ちゃん</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dog.gender === '女の子' ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'}`}>{dog.gender}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{dog.breed}</p>
            <p className="text-xs text-gray-400 mt-1">{getAgeText(dog.birth_date)} ／ {dog.weight}kg ／ {dog.color}</p>
            {dog.notes && (
              <p className="mt-2 text-xs text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1.5 rounded-lg">⚠️ {dog.notes}</p>
            )}
          </div>
        </div>
      </div>

      {/* Owner */}
      {owner && (
        <Link href={`/demo/${slug}/customers/${owner.id}`} className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: c }}>
              {owner.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">飼い主</p>
              <p className="text-sm font-bold text-gray-800">{owner.name} 様</p>
              <p className="text-xs text-gray-400">{owner.phone}</p>
            </div>
            <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-400">来店回数</p>
          <p className="text-lg sm:text-2xl font-bold" style={{ color: c }}>{myRecords.length}<span className="text-xs font-normal text-gray-400 ml-1">回</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-400">累計利用額</p>
          <p className="text-lg sm:text-2xl font-bold text-gray-800">¥{totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
          <p className="text-xs text-gray-400">最終来店</p>
          <p className="text-xs sm:text-sm font-bold text-gray-800 mt-1">{lastVisit ? relativeTime(lastVisit) : '—'}</p>
        </div>
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
                      <span className="text-sm font-semibold text-gray-800">{r.service_type}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>
                    </div>
                    <p className="text-xs text-gray-400">担当: {r.staff}</p>
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
          <h2 className="text-sm font-bold text-gray-700">来店履歴・カルテ</h2>
          <span className="text-xs text-gray-400">{myRecords.length}件</span>
        </div>
        {myRecords.length === 0 ? (
          <p className="px-4 sm:px-5 py-6 text-sm text-gray-400 text-center">来店履歴がありません</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {myRecords.map(r => (
              <div key={r.id} className="px-3 sm:px-5 py-3">
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-gray-800">{r.service_type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{relativeTime(r.visit_date)}</span>
                    <span className="text-xs font-bold text-gray-700">¥{r.price.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600">{r.condition}</p>
                <p className="text-xs text-gray-500 mt-0.5">📝 {r.groomer_notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
