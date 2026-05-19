import { yogaClasses } from '@/lib/sample-data-yoga'

export default function YogaClasses() {
  const grouped: Record<string, typeof yogaClasses> = {}
  yogaClasses.forEach(c => { if (!grouped[c.date]) grouped[c.date] = []; grouped[c.date].push(c) })
  const formatDate = (d: string) => new Date(d).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">クラス予約</h1>
          <p className="text-sm text-gray-400 mt-0.5">全 {yogaClasses.length} クラス</p>
        </div>
        <button className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg opacity-60 cursor-default whitespace-nowrap">＋ クラス追加（デモ）</button>
      </div>
      {Object.entries(grouped).sort().map(([date, items]) => (
        <div key={date} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-600">{formatDate(date)}</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {items.sort((a, b) => a.time.localeCompare(b.time)).map(c => {
              const ratio = c.booked / c.capacity
              const full = c.booked >= c.capacity
              const almostFull = !full && ratio >= 0.8
              return (
                <div key={c.id} className="px-3 sm:px-4 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-14 flex-shrink-0 text-center">
                      <p className="text-sm font-bold text-gray-700">{c.time}</p>
                      <p className="text-xs text-gray-400">{c.duration}分</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold text-gray-800">{c.name}</span>
                        {full && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">満席</span>}
                        {almostFull && <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">残りわずか</span>}
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{c.level}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{c.instructor} · {c.room}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(ratio * 100, 100)}%`, backgroundColor: full ? '#ef4444' : almostFull ? '#f97316' : '#8b5cf6' }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 flex-shrink-0">{c.booked}/{c.capacity}名</span>
                      </div>
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
