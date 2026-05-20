import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import type { Client, ClientPlan, ClientStatus } from '@/types/client'

const PLAN_STYLE: Record<ClientPlan, string> = {
  starter: 'bg-gray-100 text-gray-700',
  standard: 'bg-blue-100 text-blue-700',
  premium: 'bg-purple-100 text-purple-700',
}

const PLAN_LABEL: Record<ClientPlan, string> = {
  starter: 'スターター',
  standard: 'スタンダード',
  premium: 'プレミアム',
}

const STATUS_STYLE: Record<ClientStatus, string> = {
  live: 'bg-green-100 text-green-700',
  staging: 'bg-amber-100 text-amber-700',
  paused: 'bg-gray-100 text-gray-500',
}

const STATUS_LABEL: Record<ClientStatus, string> = {
  live: '本番稼働中',
  staging: '導入準備中',
  paused: '一時停止',
}

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('clients')
    .select('*')
    .order('contracted_at', { ascending: false })

  const clients: Client[] = data ?? []

  const summary = {
    total: clients.length,
    live: clients.filter(c => c.status === 'live').length,
    totalMau: clients.reduce((s, c) => s + c.mau, 0),
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <Link href="/admin" className="text-xs text-gray-400 hover:text-gray-600">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">顧客SaaS</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            本番納品中のSaaSテナントを管理します
          </p>
        </div>
        <button
          disabled
          className="bg-gray-200 text-gray-500 text-sm font-bold px-4 py-2 rounded-xl cursor-not-allowed"
          title="近日対応"
        >
          + 新規テナントを追加
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">契約社数</p>
          <p className="text-xl font-bold text-gray-900">{summary.total}社</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">稼働中</p>
          <p className="text-xl font-bold text-emerald-600">{summary.live}社</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">合計MAU</p>
          <p className="text-xl font-bold text-blue-600">{summary.totalMau}</p>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <p className="text-sm text-gray-500">
            まだ顧客SaaSテナントが登録されていません。
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 text-xs font-medium text-gray-500 border-b border-gray-200">
            <div className="col-span-3">テナント</div>
            <div className="col-span-2">業種</div>
            <div className="col-span-3">ドメイン</div>
            <div className="col-span-1">プラン</div>
            <div className="col-span-2">ステータス</div>
            <div className="col-span-1 text-right">MAU</div>
          </div>
          <ul className="divide-y divide-gray-100">
            {clients.map(c => (
              <li
                key={c.id}
                className="px-5 py-4 md:grid md:grid-cols-12 md:gap-2 md:items-center hover:bg-gray-50 transition-colors"
              >
                <div className="md:col-span-3 mb-2 md:mb-0">
                  <p className="text-sm font-medium text-gray-900">{c.name}</p>
                  <p className="text-xs text-gray-400">契約日：{c.contracted_at}</p>
                </div>
                <div className="md:col-span-2 mb-1 md:mb-0">
                  <span className="text-xs text-gray-600 md:hidden">業種：</span>
                  <span className="text-sm text-gray-700">{c.industry}</span>
                </div>
                <div className="md:col-span-3 mb-1 md:mb-0">
                  <span className="text-xs text-gray-600 md:hidden">ドメイン：</span>
                  <span className="text-xs text-blue-600 break-all">{c.domain}</span>
                </div>
                <div className="md:col-span-1 mb-1 md:mb-0">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${PLAN_STYLE[c.plan]}`}>
                    {PLAN_LABEL[c.plan]}
                  </span>
                </div>
                <div className="md:col-span-2 mb-1 md:mb-0">
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${STATUS_STYLE[c.status]}`}>
                    {STATUS_LABEL[c.status]}
                  </span>
                </div>
                <div className="md:col-span-1 md:text-right">
                  <span className="text-sm font-medium text-gray-900">{c.mau}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
