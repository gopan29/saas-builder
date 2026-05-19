// ドッグサロン デモ用サンプルデータ（日付は「今日」基準で動的生成）

const pad = (n: number) => String(n).padStart(2, '0')
const dateOffset = (days: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
const dateTimeOffset = (days: number, hour: number, min = 0): string => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(hour)}:${pad(min)}`
}

export const customers = [
  { id: 'c1', name: '田中 美咲', phone: '090-1234-5678', email: 'misaki@example.com', address: '大阪府高槻市城西町1-1', visit_count: 12, registered_at: '2023-04-10' },
  { id: 'c2', name: '山本 健太', phone: '090-2345-6789', email: 'kenta@example.com', address: '大阪府高槻市栄町2-3', visit_count: 8, registered_at: '2023-07-22' },
  { id: 'c3', name: '佐藤 由美', phone: '080-3456-7890', email: 'yumi@example.com', address: '大阪府高槻市富田町3-5', visit_count: 24, registered_at: '2022-11-05' },
  { id: 'c4', name: '鈴木 拓也', phone: '070-4567-8901', email: 'takuya@example.com', address: '大阪府高槻市古曽部町4-2', visit_count: 5, registered_at: '2024-01-18' },
  { id: 'c5', name: '中村 春香', phone: '090-5678-9012', email: 'haruka@example.com', address: '大阪府高槻市南平台5-8', visit_count: 16, registered_at: '2023-02-14' },
  { id: 'c6', name: '小林 誠', phone: '080-6789-0123', email: 'makoto@example.com', address: '大阪府高槻市松川町6-1', visit_count: 3, registered_at: '2024-03-01' },
  { id: 'c7', name: '加藤 里奈', phone: '090-7890-1234', email: 'rina@example.com', address: '大阪府高槻市氷室町7-4', visit_count: 19, registered_at: '2022-08-30' },
]

export const dogs = [
  { id: 'd1', customer_id: 'c1', name: 'モカ', breed: 'トイプードル', gender: '女の子', birth_date: '2020-05-15', weight: 3.2, color: 'アプリコット', notes: 'シャンプー後に耳掃除必須' },
  { id: 'd2', customer_id: 'c2', name: 'ハル', breed: 'ミニチュアダックスフント', gender: '男の子', birth_date: '2019-08-20', weight: 5.1, color: 'ブラック＆タン', notes: '耳が敏感なため優しく扱う' },
  { id: 'd3', customer_id: 'c3', name: 'ルナ', breed: 'チワワ', gender: '女の子', birth_date: '2021-02-10', weight: 1.8, color: 'クリーム', notes: 'アレルギーあり（小麦系シャンプー不可）' },
  { id: 'd4', customer_id: 'c3', name: 'ソラ', breed: 'ポメラニアン', gender: '男の子', birth_date: '2018-11-30', weight: 2.5, color: 'オレンジ', notes: '' },
  { id: 'd5', customer_id: 'c4', name: 'レオ', breed: 'ゴールデンレトリバー', gender: '男の子', birth_date: '2022-03-08', weight: 28.0, color: 'ゴールデン', notes: '大型犬用台使用' },
  { id: 'd6', customer_id: 'c5', name: 'ここ', breed: 'マルチーズ', gender: '女の子', birth_date: '2020-09-25', weight: 2.9, color: 'ホワイト', notes: '' },
  { id: 'd7', customer_id: 'c6', name: 'チョコ', breed: 'シーズー', gender: '男の子', birth_date: '2021-06-12', weight: 6.3, color: 'ブラウン＆ホワイト', notes: '目元のカットを丁寧に' },
  { id: 'd8', customer_id: 'c7', name: 'ラテ', breed: 'トイプードル', gender: '女の子', birth_date: '2019-12-01', weight: 3.8, color: 'シルバー', notes: '前回カット: テディベアカット' },
]

// 予約: 今日 / 明日 / 明後日 / 3日後 で分散
export const reservations = [
  { id: 'r1', date: dateOffset(0),  time: '10:00', customer_id: 'c1', dog_id: 'd1', customer_name: '田中 美咲', dog_name: 'モカ',   service_type: 'シャンプー＆トリミング', staff: '佐藤 由美',  price: 7500, status: 'confirmed', source: '電話',    notes: '' },
  { id: 'r2', date: dateOffset(0),  time: '13:00', customer_id: 'c3', dog_id: 'd3', customer_name: '佐藤 由美', dog_name: 'ルナ',   service_type: 'シャンプーのみ',           staff: '田中 翔太',  price: 4000, status: 'confirmed', source: 'LINE',   notes: 'アレルギー対応シャンプー使用' },
  { id: 'r3', date: dateOffset(0),  time: '15:00', customer_id: 'c5', dog_id: 'd6', customer_name: '中村 春香', dog_name: 'ここ',   service_type: 'フルコース',                staff: '佐藤 由美',  price: 9800, status: 'pending',   source: 'eパーク', notes: '' },
  { id: 'r4', date: dateOffset(1),  time: '10:00', customer_id: 'c2', dog_id: 'd2', customer_name: '山本 健太', dog_name: 'ハル',   service_type: 'シャンプー＆トリミング', staff: '田中 翔太',  price: 6500, status: 'confirmed', source: '窓口',   notes: '' },
  { id: 'r5', date: dateOffset(1),  time: '11:30', customer_id: 'c4', dog_id: 'd5', customer_name: '鈴木 拓也', dog_name: 'レオ',   service_type: 'シャンプーのみ',           staff: '佐藤 由美',  price: 5500, status: 'confirmed', source: 'LINE',   notes: '大型犬' },
  { id: 'r6', date: dateOffset(1),  time: '14:00', customer_id: 'c3', dog_id: 'd4', customer_name: '佐藤 由美', dog_name: 'ソラ',   service_type: 'トリミングのみ',           staff: '田中 翔太',  price: 4500, status: 'confirmed', source: '電話',   notes: '' },
  { id: 'r7', date: dateOffset(2),  time: '09:30', customer_id: 'c7', dog_id: 'd8', customer_name: '加藤 里奈', dog_name: 'ラテ',   service_type: 'フルコース',                staff: '佐藤 由美',  price: 9800, status: 'confirmed', source: '電話',   notes: 'テディベアカット希望' },
  { id: 'r8', date: dateOffset(2),  time: '13:00', customer_id: 'c6', dog_id: 'd7', customer_name: '小林 誠',   dog_name: 'チョコ', service_type: 'シャンプー＆トリミング', staff: '田中 翔太',  price: 6800, status: 'pending',   source: 'eパーク', notes: '' },
  { id: 'r9', date: dateOffset(3),  time: '10:00', customer_id: 'c1', dog_id: 'd1', customer_name: '田中 美咲', dog_name: 'モカ',   service_type: 'フルコース',                staff: '佐藤 由美',  price: 9800, status: 'confirmed', source: 'LINE',   notes: '' },
  { id: 'r10',date: dateOffset(3),  time: '14:30', customer_id: 'c5', dog_id: 'd6', customer_name: '中村 春香', dog_name: 'ここ',   service_type: 'シャンプーのみ',           staff: '田中 翔太',  price: 4500, status: 'confirmed', source: '電話',   notes: '' },
]

// LINE: 直近の時刻
export const lineCandidates = [
  { id: 'l1', received_at: dateTimeOffset(0, 9, 12),  sender_name: '田中 美咲',     message: 'こんにちは！モカのシャンプーをお願いしたいのですが、来週水曜の午後は空いていますか？', requested_date: dateOffset(3), status: 'pending' },
  { id: 'l2', received_at: dateTimeOffset(0, 11, 45), sender_name: '新規のお客様',  message: 'はじめまして。トイプードル（2歳・女の子）のトリミングをお願いしたいです。来週あたりで空いている日はありますか？', requested_date: null, status: 'pending' },
  { id: 'l3', received_at: dateTimeOffset(-1, 16, 30),sender_name: '山本 健太',     message: 'ハルの次回予約を来月上旬でお願いしたいです。いつが空いていますか？', requested_date: null, status: 'pending' },
  { id: 'l4', received_at: dateTimeOffset(-1, 10, 0), sender_name: '加藤 里奈',     message: 'ラテのカット、明後日の午後にお願いできますか？', requested_date: dateOffset(2), status: 'registered' },
]

// eパーク: 今日 / 明日 / 明後日 (未転記) と 過去 (転記済)
const eparkBaseDate = dateOffset(-2).replace(/-/g, '')
export const eparkEntries = [
  { id: 'e1', epark_id: `EP-${eparkBaseDate}-001`, reservation_date: dateOffset(0), reservation_time: '15:00', customer_name: '中村 春香', dog_name: 'ここ', service_type: 'フルコース',                is_transferred: false },
  { id: 'e2', epark_id: `EP-${eparkBaseDate}-002`, reservation_date: dateOffset(2), reservation_time: '13:00', customer_name: '小林 誠',   dog_name: 'チョコ', service_type: 'シャンプー＆トリミング', is_transferred: false },
  { id: 'e3', epark_id: `EP-${dateOffset(-3).replace(/-/g,'')}-003`, reservation_date: dateOffset(1),  reservation_time: '10:00', customer_name: '山本 健太', dog_name: 'ハル', service_type: 'シャンプー＆トリミング', is_transferred: true },
  { id: 'e4', epark_id: `EP-${dateOffset(-4).replace(/-/g,'')}-004`, reservation_date: dateOffset(-1), reservation_time: '11:00', customer_name: '田中 美咲', dog_name: 'モカ', service_type: 'シャンプーのみ',           is_transferred: true },
]

// カルテ: 過去 (今月分を多めに配置して売上推移グラフが映えるように)
export const medicalRecords = [
  // 今月分（直近2週間）
  { id: 'm1', dog_id: 'd1', dog_name: 'モカ',  customer_name: '田中 美咲', visit_date: dateOffset(-2),  service_type: 'フルコース',                condition: '毛並み良好。少し絡まり有り。',         groomer_notes: 'テディベアカット。耳掃除実施。',           next_visit_scheduled: dateOffset(28), price: 9800 },
  { id: 'm2', dog_id: 'd8', dog_name: 'ラテ',  customer_name: '加藤 里奈', visit_date: dateOffset(-4),  service_type: 'シャンプー＆トリミング', condition: '皮膚乾燥気味。保湿シャンプー使用。', groomer_notes: 'サマーカット。次回は保湿トリートメント推奨。', next_visit_scheduled: dateOffset(26), price: 6800 },
  { id: 'm3', dog_id: 'd3', dog_name: 'ルナ',  customer_name: '佐藤 由美', visit_date: dateOffset(-6),  service_type: 'シャンプーのみ',           condition: '皮膚問題なし。アレルギー対応済み。',   groomer_notes: 'アレルギー対応シャンプー使用。異常なし。',      next_visit_scheduled: dateOffset(24), price: 4000 },
  { id: 'm4', dog_id: 'd5', dog_name: 'レオ',  customer_name: '鈴木 拓也', visit_date: dateOffset(-7),  service_type: 'シャンプー＆トリミング', condition: '大型犬。毛量多め。',                      groomer_notes: '大型犬用台使用。',                              next_visit_scheduled: dateOffset(23), price: 7500 },
  { id: 'm5', dog_id: 'd6', dog_name: 'ここ',  customer_name: '中村 春香', visit_date: dateOffset(-9),  service_type: 'シャンプー＆トリミング', condition: '状態良好。',                              groomer_notes: 'ナチュラルカット。爪切り実施。',              next_visit_scheduled: dateOffset(21), price: 6500 },
  { id: 'm6', dog_id: 'd7', dog_name: 'チョコ',customer_name: '小林 誠',   visit_date: dateOffset(-11), service_type: 'シャンプー＆トリミング', condition: '目元に目やに。毛並み問題なし。',       groomer_notes: '目元のカットを丁寧に。次回も同じスタイル希望。',next_visit_scheduled: dateOffset(19), price: 6800 },
  { id: 'm7', dog_id: 'd2', dog_name: 'ハル',  customer_name: '山本 健太', visit_date: dateOffset(-13), service_type: 'フルコース',                condition: '耳に少し汚れ。毛玉あり（脇の下）。',    groomer_notes: '毛玉除去。耳掃除丁寧に実施。',                next_visit_scheduled: dateOffset(17), price: 9800 },
  { id: 'm8', dog_id: 'd4', dog_name: 'ソラ',  customer_name: '佐藤 由美', visit_date: dateOffset(-15), service_type: 'トリミングのみ',           condition: '通常。',                                  groomer_notes: 'カット仕上がり良好。',                        next_visit_scheduled: dateOffset(15), price: 4500 },
  // 先月分
  { id: 'm9', dog_id: 'd1', dog_name: 'モカ',  customer_name: '田中 美咲', visit_date: dateOffset(-20), service_type: 'シャンプー＆トリミング', condition: '通常。',                                  groomer_notes: '前回より少し短めにカット。',                  next_visit_scheduled: dateOffset(10), price: 7500 },
  { id: 'm10',dog_id: 'd5', dog_name: 'レオ',  customer_name: '鈴木 拓也', visit_date: dateOffset(-25), service_type: 'シャンプーのみ',           condition: '大型犬。毛量多め。',                      groomer_notes: '大型犬用台使用。ブラッシング念入りに。',       next_visit_scheduled: dateOffset(5),  price: 5500 },
  { id: 'm11',dog_id: 'd8', dog_name: 'ラテ',  customer_name: '加藤 里奈', visit_date: dateOffset(-32), service_type: 'フルコース',                condition: '毛量多め。',                              groomer_notes: 'テディベアカット。',                          next_visit_scheduled: dateOffset(-2), price: 9800 },
  { id: 'm12',dog_id: 'd3', dog_name: 'ルナ',  customer_name: '佐藤 由美', visit_date: dateOffset(-37), service_type: 'シャンプーのみ',           condition: '皮膚状態良好。',                          groomer_notes: 'アレルギー対応継続。',                        next_visit_scheduled: dateOffset(-7), price: 4000 },
  { id: 'm13',dog_id: 'd1', dog_name: 'モカ',  customer_name: '田中 美咲', visit_date: dateOffset(-42), service_type: 'フルコース',                condition: '通常。',                                  groomer_notes: 'テディベアカット。',                          next_visit_scheduled: dateOffset(-12),price: 9800 },
  { id: 'm14',dog_id: 'd6', dog_name: 'ここ',  customer_name: '中村 春香', visit_date: dateOffset(-45), service_type: 'フルコース',                condition: '通常。',                                  groomer_notes: '夏前なので少し短めに。',                      next_visit_scheduled: dateOffset(-15),price: 9800 },
  { id: 'm15',dog_id: 'd2', dog_name: 'ハル',  customer_name: '山本 健太', visit_date: dateOffset(-50), service_type: 'シャンプー＆トリミング', condition: '通常。',                                  groomer_notes: '耳掃除実施。',                                next_visit_scheduled: dateOffset(-20),price: 6500 },
  // 2-3か月前
  { id: 'm16',dog_id: 'd8', dog_name: 'ラテ',  customer_name: '加藤 里奈', visit_date: dateOffset(-60), service_type: 'シャンプー＆トリミング', condition: '通常。',                                  groomer_notes: 'スタンダードカット。',                        next_visit_scheduled: dateOffset(-30),price: 6800 },
  { id: 'm17',dog_id: 'd5', dog_name: 'レオ',  customer_name: '鈴木 拓也', visit_date: dateOffset(-70), service_type: 'シャンプー＆トリミング', condition: '通常。',                                  groomer_notes: '大型犬用台使用。',                            next_visit_scheduled: dateOffset(-40),price: 7500 },
  { id: 'm18',dog_id: 'd1', dog_name: 'モカ',  customer_name: '田中 美咲', visit_date: dateOffset(-78), service_type: 'シャンプーのみ',           condition: '通常。',                                  groomer_notes: '−',                                            next_visit_scheduled: dateOffset(-48),price: 4000 },
  { id: 'm19',dog_id: 'd3', dog_name: 'ルナ',  customer_name: '佐藤 由美', visit_date: dateOffset(-85), service_type: 'シャンプー＆トリミング', condition: '通常。',                                  groomer_notes: 'アレルギー対応。',                            next_visit_scheduled: dateOffset(-55),price: 6500 },
  { id: 'm20',dog_id: 'd6', dog_name: 'ここ',  customer_name: '中村 春香', visit_date: dateOffset(-95), service_type: 'シャンプー＆トリミング', condition: '通常。',                                  groomer_notes: 'ナチュラルカット。',                          next_visit_scheduled: dateOffset(-65),price: 6500 },
  // 4-5か月前
  { id: 'm21',dog_id: 'd1', dog_name: 'モカ',  customer_name: '田中 美咲', visit_date: dateOffset(-110),service_type: 'フルコース',                condition: '通常。',                                  groomer_notes: '−',                                            next_visit_scheduled: dateOffset(-80),price: 9800 },
  { id: 'm22',dog_id: 'd2', dog_name: 'ハル',  customer_name: '山本 健太', visit_date: dateOffset(-118),service_type: 'シャンプー＆トリミング', condition: '通常。',                                  groomer_notes: '−',                                            next_visit_scheduled: dateOffset(-88),price: 6500 },
  { id: 'm23',dog_id: 'd8', dog_name: 'ラテ',  customer_name: '加藤 里奈', visit_date: dateOffset(-130),service_type: 'フルコース',                condition: '通常。',                                  groomer_notes: '−',                                            next_visit_scheduled: dateOffset(-100),price: 9800 },
  { id: 'm24',dog_id: 'd7', dog_name: 'チョコ',customer_name: '小林 誠',   visit_date: dateOffset(-140),service_type: 'シャンプー＆トリミング', condition: '通常。',                                  groomer_notes: '−',                                            next_visit_scheduled: dateOffset(-110),price: 6800 },
  { id: 'm25',dog_id: 'd5', dog_name: 'レオ',  customer_name: '鈴木 拓也', visit_date: dateOffset(-155),service_type: 'シャンプーのみ',           condition: '通常。',                                  groomer_notes: '−',                                            next_visit_scheduled: dateOffset(-125),price: 5500 },
]

export const serviceTypes = ['シャンプーのみ', 'トリミングのみ', 'シャンプー＆トリミング', 'フルコース', '爪切りのみ']
export const statusMap: Record<string, { label: string; color: string }> = {
  confirmed: { label: '確定', color: 'bg-green-100 text-green-700' },
  pending:   { label: '仮予約', color: 'bg-yellow-100 text-yellow-700' },
  cancelled: { label: 'キャンセル', color: 'bg-red-100 text-red-600' },
}

// 相対時刻表示用ヘルパー
export function relativeTime(dateStr: string): string {
  const target = new Date(dateStr.includes(':') ? dateStr.replace(' ', 'T') : dateStr + 'T00:00:00')
  const now = new Date()
  const diffMs = now.getTime() - target.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  if (diffMin < 1) return 'たった今'
  if (diffMin < 60) return `${diffMin}分前`
  if (diffHour < 24) return `${diffHour}時間前`
  if (diffDay < 7) return `${diffDay}日前`
  if (diffDay < 30) return `${Math.floor(diffDay / 7)}週間前`
  return `${Math.floor(diffDay / 30)}ヶ月前`
}
