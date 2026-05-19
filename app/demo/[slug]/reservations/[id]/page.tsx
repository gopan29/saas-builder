import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { reservations } from '@/lib/sample-data'

type Props = { params: Promise<{ slug: string; id: string }> }

// ------ static mock detail data (matching the screenshot) ------
const DETAIL = {
  reservationId: 'RES-20240601-00123',
  date: '2024年6月1日（土）',
  time: '10:00〜11:30',
  menu: 'シャンプー＆トリミング（全身カット）',
  staff: '佐藤 由美',
  price: '¥7,700（税込）',
  source: 'LINE予約',
  status: '確定',
  dogName: 'モカ',
  dogBreed: 'トイプードル',
  dogGender: '女の子',
  dogBirthday: '2021年3月12日（3歳2ヶ月）',
  dogWeight: '3.4 kg',
  dogPersonality: '人懐っこい、少し怖がり',
  dogAllergy: 'なし',
  customerName: '田中 美咲',
  customerPhone: '090-1234-5678',
  customerLine: '@tanaka_misaki',
  customerEmail: 'misaki.tanaka@example.com',
  customerRank: 'ゴールド',
  lastVisit: '2024/04/27',
  visitCount: 12,
  memo: 'カットはふんわりめが好み。\n耳掃除はやさしく。\n乾燥しやすいので保湿をしっかり。\n次回は歯磨きもおすすめ。',
  memoUpdated: '2024/05/25 佐藤',
  treatmentNotes: '・毛玉は少なめ。もつれあり。\n・右耳の内側が少し赤みあり。様子見。\n・シャンプー後、保湿剤を使用。\n・カットは体8mm、足はハサミでふんわり仕上げ。',
  treatmentUpdated: '2024/06/01 佐藤 由美',
  upcomingAppointments: [
    { date: '6/29（土）10:00', menu: 'シャンプーコース', status: '仮予約' },
    { date: '7/27（土）10:00', menu: 'シャンプー＆トリミング', status: '仮予約' },
  ],
  checklist: [
    { label: 'ご来店・受付', checked: true, staff: '佐藤 由美', time: '10:00' },
    { label: 'カウンセリング', checked: false, staff: '佐藤 由美', time: '--:--' },
    { label: '施術開始', checked: false, staff: '佐藤 由美', time: '--:--' },
    { label: 'お迎え・お会計', checked: false, staff: '佐藤 由美', time: '--:--' },
  ],
}

const SUB_TABS = ['予約情報', 'カルテ', 'LINE履歴', 'お支払い', 'eパーク転記', 'メモ・履歴']

export default async function ReservationDetailPage({ params }: Props) {
  const { slug, id } = await params
  const supabase = await createClient()
  const { data: demo } = await supabase
    .from('demos')
    .select('industry_template, theme_color')
    .eq('slug', slug)
    .single()

  if (!demo || demo.industry_template !== 'dog_salon') notFound()

  const reservation = reservations.find(r => r.id === id)
  if (!reservation) notFound()

  const c = demo.theme_color

  return (
    <div>
      {/* Back link */}
      <Link
        href={`/demo/${slug}/reservations`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        一覧に戻る
      </Link>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-1">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 break-all">
              {DETAIL.dogName} ちゃん　{DETAIL.customerName}様
            </h1>
            <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
              {DETAIL.status}
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">予約ID：{DETAIL.reservationId}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            編集
          </button>
          <button
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ backgroundColor: c, color: '#831843' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            変更・キャンセル
          </button>
          <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex border-b border-gray-200 mb-5 overflow-x-auto">
        {SUB_TABS.map((tab, i) => (
          <button
            key={tab}
            className="relative px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap"
            style={{ color: i === 0 ? c : '#6b7280', borderBottom: i === 0 ? `2px solid ${c}` : '2px solid transparent' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Row 1: 予約詳細 + ワンちゃん情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* 予約詳細 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-4">予約詳細</h2>
              <div className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="flex items-center gap-1.5 text-gray-400 w-24 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    予約日時
                  </span>
                  <span className="text-gray-700 font-medium">{DETAIL.date} {DETAIL.time}</span>
                </div>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1.5 text-gray-400 w-24 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                    </svg>
                    メニュー
                  </span>
                  <span className="text-gray-700">{DETAIL.menu}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-gray-400 w-24 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    スタッフ
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-700">{DETAIL.staff}</span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: c + '30', color: '#831843' }}
                    >
                      指名
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1.5 text-gray-400 w-24 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    料金
                  </span>
                  <span className="text-gray-700">{DETAIL.price}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-gray-400 w-24 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    予約経路
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-700">{DETAIL.source}</span>
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-gray-400 w-24 shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ステータス
                  </span>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    {DETAIL.status}
                  </span>
                </div>
              </div>
            </div>

            {/* ワンちゃん情報 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-4">ワンちゃん情報</h2>
              <div className="flex gap-4">
                {/* Dog avatar */}
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl shrink-0 border-2 border-amber-200">
                  🐩
                </div>
                <div className="flex-1 space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 shrink-0">名前</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-800">{DETAIL.dogName} ちゃん</span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: c + '40', color: '#831843' }}
                      >
                        {DETAIL.dogGender}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 shrink-0">犬種</span>
                    <span className="text-gray-700">{DETAIL.dogBreed}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 shrink-0">誕生日</span>
                    <span className="text-gray-700">{DETAIL.dogBirthday}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 shrink-0">体重</span>
                    <span className="text-gray-700">{DETAIL.dogWeight}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 shrink-0">性格・特徴</span>
                    <span className="text-gray-700">{DETAIL.dogPersonality}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-20 shrink-0">アレルギー</span>
                    <span className="text-gray-700">{DETAIL.dogAllergy}</span>
                  </div>
                </div>
              </div>
              <button className="mt-4 w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <span>ワンちゃんの詳細を見る</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* 当日のスケジュール */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-800">当日のスケジュール</h2>
            </div>
            <div className="relative overflow-x-auto">
              {/* Navigation arrows + time range */}
              <div className="flex items-center gap-2 mb-2 min-w-[320px]">
                <button className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Time labels */}
                <div className="flex-1 relative h-6">
                  {['9:00', '10:00', '11:00', '12:00', '13:0'].map((t, i) => (
                    <span
                      key={t}
                      className="absolute text-xs text-gray-400 -translate-x-1/2"
                      style={{ left: `${(i / 4) * 100}%` }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {/* Timeline bar */}
              <div className="relative h-20 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 min-w-[320px]">
                {/* Vertical grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-gray-200"
                    style={{ left: `${(i / 4) * 100}%` }}
                  />
                ))}
                {/* Reservation block: 10:00-11:30 = 25%~62.5% of 9:00-13:00 range */}
                <div
                  className="absolute top-3 bottom-3 rounded-lg flex flex-col justify-center px-2"
                  style={{
                    left: '25%',
                    width: '37.5%',
                    backgroundColor: c + '40',
                    borderLeft: `3px solid ${c}`,
                  }}
                >
                  <span className="text-xs font-bold leading-tight" style={{ color: '#831843' }}>
                    10:00〜11:30
                  </span>
                  <span className="text-xs text-gray-700 leading-tight">{DETAIL.dogName} ちゃん</span>
                  <span className="text-xs text-gray-500 leading-tight truncate">{DETAIL.menu.split('（')[0]}</span>
                </div>
                {/* Current time indicator at 10:00 */}
                <div
                  className="absolute top-0 bottom-0 w-0.5"
                  style={{ left: '25%', backgroundColor: c }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full -translate-x-1 -translate-y-0"
                    style={{ backgroundColor: c }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: チェックリスト + 施術メモ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* チェックリスト */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
              <h2 className="text-sm font-bold text-gray-800 mb-4">チェックリスト</h2>
              <div className="space-y-3">
                {DETAIL.checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                      style={item.checked
                        ? { backgroundColor: c, border: `2px solid ${c}` }
                        : { border: '2px solid #d1d5db', backgroundColor: 'white' }
                      }
                    >
                      {item.checked && (
                        <svg className="w-3 h-3" fill="none" stroke="#831843" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 text-sm ${item.checked ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {item.staff}
                      </span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 施術メモ */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex flex-col">
              <h2 className="text-sm font-bold text-gray-800 mb-3">施術メモ（スタッフ記録）</h2>
              <div className="flex-1 bg-blue-50 rounded-lg p-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line border border-blue-100">
                {DETAIL.treatmentNotes}
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">更新日：{DETAIL.treatmentUpdated}</span>
                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  記録を編集
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">

          {/* 今後の予定 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">今後の予定</h3>
            <div className="space-y-3">
              {DETAIL.upcomingAppointments.map((apt, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: c + '30' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke={c} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-700">{apt.date}</p>
                    <p className="text-xs text-gray-500 truncate">{apt.menu}</p>
                  </div>
                  <span className="text-xs text-blue-500 shrink-0">{apt.status}</span>
                </div>
              ))}
            </div>
            <button
              className="mt-3 w-full flex items-center justify-center gap-1 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
            >
              予約を追加
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* メモ */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">メモ</h3>
            <div className="bg-yellow-50 rounded-lg p-3 text-xs text-gray-700 leading-relaxed whitespace-pre-line border border-yellow-100">
              {DETAIL.memo}
            </div>
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-xs text-gray-400">更新日：{DETAIL.memoUpdated}</span>
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                メモを編集
              </button>
            </div>
          </div>

          {/* 顧客情報 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3">顧客情報</h3>
            <div className="space-y-2 text-xs">
              <div className="flex gap-2">
                <span className="text-gray-400 w-20 shrink-0">名前</span>
                <span className="text-gray-700 font-medium">{DETAIL.customerName} 様</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-20 shrink-0">電話番号</span>
                <span className="flex items-center gap-1 text-gray-700">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {DETAIL.customerPhone}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-20 shrink-0">LINE</span>
                <span className="flex items-center gap-1 text-gray-700">
                  <span className="w-3.5 h-3.5 rounded-sm bg-green-500 flex items-center justify-center text-white font-bold" style={{ fontSize: '8px' }}>L</span>
                  {DETAIL.customerLine}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-20 shrink-0">メール</span>
                <span className="flex items-center gap-1 text-blue-600 text-xs truncate">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{DETAIL.customerEmail}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-20 shrink-0">会員ランク</span>
                <span className="flex items-center gap-1 text-yellow-600 font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {DETAIL.customerRank}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-20 shrink-0">最終来店日</span>
                <span className="text-gray-700">{DETAIL.lastVisit}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-20 shrink-0">累計来店回数</span>
                <span className="text-gray-700">{DETAIL.visitCount}回</span>
              </div>
            </div>
            <button className="mt-3 w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">
              <span>顧客詳細を見る</span>
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
