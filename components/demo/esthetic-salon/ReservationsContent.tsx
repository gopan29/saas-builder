import { estheticReservations, estheticStatusMap } from '@/lib/sample-data-esthetic'

export default function EstheticReservations() {
  const grouped: Record<string, typeof estheticReservations> = {}
  estheticReservations.forEach(r => {
    if (!grouped[r.date]) grouped[r.date] = []
    grouped[r.date].push(r)
  })
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">予約管理</h1>
          <p className="text-sm text-gray-400 mt-0.5">全 {estheticReservations.length} 件</p>
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
              const s = estheticStatusMap[r.status]
              return (
                <div key={r.id} className="px-3 sm:px-4 py-4 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                  <div className="w-12 flex-shrink-0 text-center">
                    <p className="text-sm font-bold text-gray-700">{r.time}</p>
                    <p className="text-xs text-gray-400">{r.duration}分</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800">{r.customer_name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-sm text-gray-500">{r.service}</p>
                      <p className="text-xs text-gray-400">¥{r.price.toLocaleString()} · {r.staff_name}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
