import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { INDUSTRY_TEMPLATES } from '@/lib/industry-templates'

const INDUSTRY_DESC: Record<string, string> = {
  dog_salon: '予約・カルテ・ワンちゃん管理・eパーク連携・LINE連携を含む総合管理',
  beauty_salon: 'スタッフ別予約・施術記録・LINE連携・顧客カルテ',
  dental_clinic: '患者管理・予約・診療記録・スタッフシフト',
  restaurant: '予約管理・売上記録・スタッフ管理',
  esthetic_salon: 'コース予約・施術記録・LINE連携・会員管理',
  osteopathic_clinic: '予約・カルテ・スタッフ管理',
  juku: '生徒管理・クラス・出欠記録・講師管理',
  yoga_fitness: 'クラス予約・会員・売上会費・インストラクター',
}

const INDUSTRY_ACCENT: Record<string, { bg: string; text: string }> = {
  dog_salon: { bg: 'bg-orange-50', text: 'text-orange-600' },
  beauty_salon: { bg: 'bg-pink-50', text: 'text-pink-600' },
  dental_clinic: { bg: 'bg-cyan-50', text: 'text-cyan-600' },
  restaurant: { bg: 'bg-red-50', text: 'text-red-600' },
  esthetic_salon: { bg: 'bg-rose-50', text: 'text-rose-600' },
  osteopathic_clinic: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  juku: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  yoga_fitness: { bg: 'bg-violet-50', text: 'text-violet-600' },
}

export default async function SamplesPage() {
  const supabase = await createClient()
  const { data: demos } = await supabase
    .from('demos')
    .select('slug, client_name, industry_template, is_active')
    .eq('is_active', true)

  const samplesByIndustry = new Map<string, { slug: string; client_name: string }>()
  for (const d of demos ?? []) {
    if (!samplesByIndustry.has(d.industry_template)) {
      samplesByIndustry.set(d.industry_template, {
        slug: d.slug,
        client_name: d.client_name,
      })
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-5">
        <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600">
          ← ダッシュボードに戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">サンプルSaaS</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          商談時に「御社ならこう管理できます」と見せる業種別サンプル
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {INDUSTRY_TEMPLATES.map(t => {
          const sample = samplesByIndustry.get(t.value)
          const accent = INDUSTRY_ACCENT[t.value] ?? { bg: 'bg-gray-50', text: 'text-gray-600' }
          return (
            <div
              key={t.value}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col"
            >
              <div className={`${accent.bg} px-5 py-4 border-b border-gray-100`}>
                <p className={`text-xs font-medium ${accent.text} mb-1`}>業種テンプレ</p>
                <h2 className="text-base font-bold text-gray-900">{t.label}</h2>
              </div>
              <div className="px-5 py-4 flex-1 flex flex-col">
                <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">
                  {INDUSTRY_DESC[t.value] ?? '業務管理に必要な機能をひとまとめに'}
                </p>
                {sample ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400">代表デモ：{sample.client_name}</p>
                    <div className="flex gap-2">
                      <Link
                        href={`/demo/${sample.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg text-center transition-colors"
                      >
                        デモを開く →
                      </Link>
                      <Link
                        href="/admin/demos/new"
                        className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold py-2 rounded-lg text-center transition-colors"
                      >
                        + 新規作成
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400">代表デモ：まだありません</p>
                    <Link
                      href="/admin/demos/new"
                      className="block bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-lg text-center transition-colors"
                    >
                      + この業種でデモを作成
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
