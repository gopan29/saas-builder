import Link from 'next/link'

const SETTING_SECTIONS = [
  {
    label: 'プロジェクト基本情報',
    desc: 'ツール名・本番URL・GitHub・Vercel・Supabase の参照情報',
    items: [
      { k: 'ツール名', v: 'SaaS Builder' },
      { k: '本番URL', v: 'https://saas-builder-coral.vercel.app' },
      { k: 'GitHub', v: 'gopan29/saas-builder' },
      { k: 'Vercel Project', v: 'saas-builder' },
      { k: 'Supabase Ref', v: 'bdxjhtiwhzfgdvyiclnx' },
    ],
  },
  {
    label: 'デモ運用ルール',
    desc: 'デモ案件の標準的な扱い',
    items: [
      { k: 'デフォルトのテーマカラー', v: '#0EA5E9（青）' },
      { k: '新規デモの公開ステータス初期値', v: '非公開（管理者承認後に公開）' },
      { k: '今月のデモ作成数の上限', v: '50件 / スタンダードプラン' },
    ],
  },
  {
    label: '通知・連携',
    desc: '外部サービスへの連携と通知設定',
    items: [
      { k: 'Slack通知', v: '未設定' },
      { k: 'LINE連携', v: '未設定' },
      { k: 'eパーク連携', v: '未設定' },
    ],
  },
]

export default function SettingsPage() {
  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-5">
        <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600">
          ← ダッシュボードに戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">設定</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          プロジェクト・運用ルール・連携の設定を確認します
        </p>
      </div>

      <div className="space-y-4">
        {SETTING_SECTIONS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">{s.label}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
            </div>
            <ul className="divide-y divide-gray-100">
              {s.items.map(item => (
                <li key={item.k} className="px-5 py-3 sm:grid sm:grid-cols-3 sm:gap-3">
                  <span className="text-xs text-gray-500 sm:col-span-1">{item.k}</span>
                  <span className="text-sm text-gray-900 sm:col-span-2 break-all">{item.v}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-700">
            ⚠ 設定の編集機能は未実装です（読み取り専用）。値を変える場合は環境変数・CLAUDE.md を直接編集してください。
          </p>
        </div>
      </div>
    </div>
  )
}
