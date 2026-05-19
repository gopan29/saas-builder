'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Demo } from '@/types/demo'
import { TEMPLATE_LABEL } from '@/lib/industry-templates'

// ---- helpers ----

const INDUSTRY_CATEGORY: Record<string, string> = {
  dog_salon: 'ペット',
  beauty_salon: 'BtoC',
  dental_clinic: '医療',
  restaurant: 'BtoB',
  esthetic_salon: 'BtoC',
  osteopathic_clinic: '医療',
  juku: '教育',
  yoga_fitness: 'BtoC',
}

function strHash(s: string): number {
  let h = 0
  for (const c of s) h = ((h << 5) - h + c.charCodeAt(0)) | 0
  return Math.abs(h)
}

function getMockViews(slug: string): number {
  return 40 + (strHash(slug) % 110)
}

function getMockSparkline(slug: string): number[] {
  return Array.from({ length: 7 }, (_, i) => 20 + (strHash(slug + String(i)) % 60))
}

function relTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return '1時間以内'
  if (h < 24) return `${h}時間前`
  const d = Math.floor(h / 24)
  return `${d}日前`
}

// ---- sub-components ----

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const W = 80, H = 28, P = 2
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const pts = values.map((v, i) => [
    P + (i / (values.length - 1)) * (W - P * 2),
    H - P - ((v - min) / range) * (H - P * 2),
  ])
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return (
    <svg width={W} height={H} className="block">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SummaryChart() {
  const vals = [150, 200, 170, 220, 190, 250, 230, 300, 270, 340, 310, 370, 350, 400, 380, 430, 410, 460, 440, 490, 470, 450, 480, 460, 510, 490, 530, 510, 550, 570]
  const W = 260, H = 70, P = 4
  const max = Math.max(...vals)
  const pts = vals.map((v, i) => [
    P + (i / (vals.length - 1)) * (W - P * 2),
    H - P - (v / max) * (H - P * 2),
  ])
  const linePath = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(1)},${H} L${P},${H} Z`
  return (
    <svg width={W} height={H} className="w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#chartGrad)" />
      <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StatCard({
  icon, iconBg, label, value, sub, subColor = 'text-gray-400',
}: {
  icon: React.ReactNode
  iconBg: string
  label: string
  value: string
  sub: string
  subColor?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
        <p className={`text-xs mt-0.5 ${subColor}`}>{sub}</p>
      </div>
    </div>
  )
}

// ---- types ----

type Stats = {
  total: number
  active: number
  inactive: number
  thisMonth: number
  lastMonth: number
  avgUpdateDays: number
}

type Props = {
  demos: Demo[]
  stats: Stats
}

const TABS = [
  { key: 'all', label: 'すべて' },
  { key: 'active', label: '公開中' },
  { key: 'draft', label: '下書き' },
  { key: 'inactive', label: '非公開' },
  { key: 'archive', label: 'アーカイブ' },
]

const CHART_LABELS = ['5/1', '5/8', '5/15', '5/22', '5/29']

// ---- main component ----

export default function AdminDashboard({ demos, stats }: Props) {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')

  const tabCounts: Record<string, number> = {
    all: stats.total,
    active: stats.active,
    draft: 0,
    inactive: stats.inactive,
    archive: 0,
  }

  const filteredDemos = useMemo(() => {
    let result = [...demos]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(d =>
        d.client_name.toLowerCase().includes(q) || d.slug.toLowerCase().includes(q)
      )
    }
    if (tab === 'active') result = result.filter(d => d.is_active)
    if (tab === 'inactive') result = result.filter(d => !d.is_active)
    if (tab === 'draft' || tab === 'archive') result = []
    return result
  }, [demos, search, tab])

  const recentActivity = useMemo(() => {
    const actions = ['が閲覧されました', 'を更新しました', 'を公開しました', 'が閲覧されました', 'を作成しました']
    return [...demos].slice(0, 5).map((d, i) => ({
      name: d.client_name,
      action: actions[i % actions.length],
      time: relTime(d.updated_at),
      color: d.theme_color,
    }))
  }, [demos])

  const monthGrowth = stats.lastMonth > 0
    ? Math.round(((stats.thisMonth - stats.lastMonth) / stats.lastMonth) * 100)
    : 0

  const copyUrl = (slug: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(`${window.location.origin}/demo/${slug}`)
    }
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">デモ案件一覧</h1>
          <p className="text-sm text-gray-500 mt-0.5">クライアント提案用デモを管理します</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="案件名・クライアントで検索"
              className="w-full sm:w-64 pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* Create button */}
          <div className="flex items-stretch shadow-sm">
            <Link
              href="/admin/new"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-l-xl sm:rounded-l-xl rounded-r-none transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規デモを作成
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 rounded-r-xl border-l border-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-5">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="text-sm text-gray-500 font-medium">並び替え</span>
            <div className="flex items-center gap-2">
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-40 sm:max-w-none">
                <option>更新日が新しい順</option>
                <option>更新日が古い順</option>
                <option>作成日が新しい順</option>
              </select>
              <button className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 hover:bg-gray-50 transition-colors shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0014 13.914V19l-4-2v-3.086a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                フィルター
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <StatCard
              iconBg="bg-blue-500"
              label="総デモ案件数"
              value={`${stats.total}件`}
              sub={`公開中：${stats.active}件`}
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard
              iconBg="bg-green-500"
              label="公開中のデモ"
              value={`${stats.active}件`}
              sub={`非公開：${stats.inactive}件`}
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
            />
            <StatCard
              iconBg="bg-purple-500"
              label="今月の作成数"
              value={`${stats.thisMonth}件`}
              sub={monthGrowth >= 0 ? `先月比：+${monthGrowth}%` : `先月比：${monthGrowth}%`}
              subColor={monthGrowth >= 0 ? 'text-green-600' : 'text-red-500'}
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />
            <StatCard
              iconBg="bg-orange-400"
              label="平均更新日"
              value={`${stats.avgUpdateDays}日前`}
              sub="最終更新からの平均"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-0 border-b border-gray-200 mb-4 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  tab === t.key ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  tab === t.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tabCounts[t.key]}
                </span>
                {tab === t.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Demo list */}
          {filteredDemos.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <p className="text-gray-400 text-sm">デモ案件がありません</p>
              <Link href="/admin/new" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
                最初のデモを作成する →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDemos.map(demo => {
                const views = getMockViews(demo.slug)
                const sparkline = getMockSparkline(demo.slug)
                const category = INDUSTRY_CATEGORY[demo.industry_template] ?? 'BtoC'
                return (
                  <div
                    key={demo.id}
                    className="bg-white rounded-xl border border-gray-200 px-4 py-3.5 flex items-center gap-3 hover:shadow-sm transition-shadow overflow-hidden"
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                      style={{ backgroundColor: demo.theme_color }}
                    >
                      {demo.client_name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">{demo.client_name}</span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {TEMPLATE_LABEL[demo.industry_template] ?? demo.industry_template}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                          {category}
                        </span>
                        {demo.is_active
                          ? <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">公開中</span>
                          : <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">非公開</span>
                        }
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 font-mono">/demo/{demo.slug}</p>
                    </div>

                    {/* Updated */}
                    <div className="hidden sm:block text-right shrink-0 w-20">
                      <p className="text-xs text-gray-400">更新日</p>
                      <p className="text-xs font-medium text-gray-600">{relTime(demo.updated_at)}</p>
                    </div>

                    {/* Views */}
                    <div className="hidden sm:block text-right shrink-0 w-14">
                      <p className="text-xs text-gray-400">閲覧数</p>
                      <p className="text-sm font-bold text-gray-800">{views}</p>
                    </div>

                    {/* Sparkline */}
                    <div className="hidden md:block shrink-0">
                      <Sparkline values={sparkline} color={demo.theme_color} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Link
                        href={`/demo/${demo.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="デモを見る"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => copyUrl(demo.slug)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="URLをコピー"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </button>
                      <Link
                        href={`/admin/${demo.id}/edit`}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="その他"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {filteredDemos.length > 0 && (
            <div className="flex items-center justify-between mt-4 gap-2 flex-wrap">
              <span className="text-xs sm:text-sm text-gray-500">
                1 - {Math.min(filteredDemos.length, 10)} / {filteredDemos.length}件を表示
              </span>
              <div className="flex items-center gap-1">
                <button disabled className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">1</button>
                {filteredDemos.length > 10 && (
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-sm text-gray-600">2</button>
                )}
                {filteredDemos.length > 20 && (
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 text-sm text-gray-600">3</button>
                )}
                <button disabled={filteredDemos.length <= 10} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500">
                <span>10件 / ページ</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="w-full xl:w-72 shrink-0 space-y-4">
          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">クイックアクション</h3>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/admin/new"
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center leading-tight">新規デモを作成</span>
              </Link>
              <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center leading-tight">テンプレートから作成</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center leading-tight">インポート（CSV）</span>
              </button>
              <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center leading-tight">デモを複製</span>
              </button>
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">最近のアクティビティ</h3>
            {recentActivity.length === 0 ? (
              <p className="text-xs text-gray-400">アクティビティがありません</p>
            ) : (
              <div className="space-y-2.5">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        <span className="font-medium">{item.name}</span>
                        {item.action}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>
            )}
            <button className="text-xs text-blue-600 hover:text-blue-700 mt-3 w-full text-center transition-colors">
              すべてのアクティビティを見る
            </button>
          </div>

          {/* Monthly summary chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-800">閲覧数サマリー（今月）</h3>
              <span className="text-xs text-green-600 font-medium">先月比：+18%</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-3">726</p>
            <SummaryChart />
            <div className="flex justify-between mt-1.5">
              {CHART_LABELS.map(l => (
                <span key={l} className="text-xs text-gray-400">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
