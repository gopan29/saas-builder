import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { INDUSTRY_TEMPLATES } from '@/lib/industry-templates'

export default async function AdminHomePage() {
  const supabase = await createClient()
  const { data: demos } = await supabase
    .from('demos')
    .select('id, client_name, slug, industry_template, is_active, updated_at')
    .order('updated_at', { ascending: false })
    .limit(5)

  const { count: demoCount } = await supabase
    .from('demos')
    .select('*', { count: 'exact', head: true })

  const { count: activeDemoCount } = await supabase
    .from('demos')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // 顧客SaaSはモックデータ
  const clientSaasCount = 3
  const sampleSaasCount = INDUSTRY_TEMPLATES.length

  const sections = [
    {
      label: 'デモ案件',
      desc: '商談用デモを作成・編集する',
      href: '/admin/demos',
      count: demoCount ?? 0,
      countLabel: '件のデモ',
      iconBg: 'bg-blue-500',
      iconRing: 'ring-blue-100',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: '顧客SaaS',
      desc: '本番納品中のSaaSテナントを管理',
      href: '/admin/clients',
      count: clientSaasCount,
      countLabel: '社が稼働中',
      iconBg: 'bg-emerald-500',
      iconRing: 'ring-emerald-100',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'サンプルSaaS',
      desc: '提案時に見せる業種別サンプル',
      href: '/admin/samples',
      count: sampleSaasCount,
      countLabel: '業種テンプレ',
      iconBg: 'bg-amber-500',
      iconRing: 'ring-amber-100',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
    },
    {
      label: '設定',
      desc: 'プロジェクト・連携・通知の設定',
      href: '/admin/settings',
      count: null,
      countLabel: '',
      iconBg: 'bg-slate-500',
      iconRing: 'ring-slate-100',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  const kpis = [
    {
      label: 'デモ案件',
      value: `${demoCount ?? 0}件`,
      sub: `公開中：${activeDemoCount ?? 0}件`,
      accent: 'text-blue-600',
    },
    {
      label: '顧客SaaS',
      value: `${clientSaasCount}社`,
      sub: '本番稼働中',
      accent: 'text-emerald-600',
    },
    {
      label: 'サンプル業種',
      value: `${sampleSaasCount}種類`,
      sub: '提案テンプレ',
      accent: 'text-amber-600',
    },
    {
      label: 'プラン',
      value: 'スタンダード',
      sub: '次回更新：2024/06/01',
      accent: 'text-slate-600',
    },
  ]

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">SaaS Builder</h1>
        <p className="text-sm text-gray-500 mt-1">
          デモ作成・顧客SaaS運用・提案テンプレートを一括管理するハブです。
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{k.label}</p>
            <p className={`text-xl font-bold ${k.accent}`}>{k.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {sections.map(s => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-white rounded-2xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl ${s.iconBg} ring-4 ${s.iconRing} flex items-center justify-center shrink-0`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h2 className="text-base font-bold text-gray-900">{s.label}</h2>
                  {s.count !== null && (
                    <span className="text-xs text-gray-500 shrink-0">
                      <span className="font-bold text-gray-900">{s.count}</span> {s.countLabel}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                <p className="text-xs text-blue-600 mt-2 group-hover:underline">開く →</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent demos */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">最近のデモ案件</h2>
          <Link href="/admin/demos" className="text-xs text-blue-600 hover:underline">
            すべて見る →
          </Link>
        </div>
        {demos && demos.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {demos.map(d => (
              <li key={d.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{d.client_name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    /demo/{d.slug} ・ {d.industry_template}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    d.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {d.is_active ? '公開中' : '非公開'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">まだデモ案件がありません</p>
        )}
      </div>
    </div>
  )
}
