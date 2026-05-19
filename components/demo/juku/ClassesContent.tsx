import { jukuClasses } from '@/lib/sample-data-juku'

const levelColor: Record<string, string> = {
  '国語': 'bg-red-50 text-red-600',
  '数学': 'bg-blue-50 text-blue-600',
  '英語': 'bg-green-50 text-green-600',
  '理科': 'bg-teal-50 text-teal-600',
  '社会': 'bg-yellow-50 text-yellow-600',
  '算数': 'bg-orange-50 text-orange-600',
}

export default function JukuClasses() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">クラス管理</h1>
          <p className="text-sm text-gray-400 mt-0.5">開講中 {jukuClasses.length} 講座</p>
        </div>
        <button className="bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-lg opacity-60 cursor-default whitespace-nowrap">＋ 新規クラス（デモ）</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {jukuClasses.map(c => {
          const ratio = c.enrolled / c.capacity
          const full = ratio >= 1
          const subjectColor = levelColor[c.subject] ?? 'bg-gray-50 text-gray-600'
          return (
            <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${subjectColor}`}>{c.subject}</span>
                    {full && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">満席</span>}
                  </div>
                  <p className="font-semibold text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.grade}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-gray-800">{c.enrolled}<span className="text-sm text-gray-400">/{c.capacity}</span></p>
                  <p className="text-xs text-gray-400">名</p>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div className="h-1.5 rounded-full" style={{ width: `${Math.min(ratio * 100, 100)}%`, backgroundColor: full ? '#ef4444' : '#3b82f6' }} />
              </div>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-gray-500">
                <span>📅 {c.day}</span>
                <span>🕐 {c.time}</span>
                <span className="truncate max-w-full">👤 {c.teacher}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">🏫 {c.room}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
