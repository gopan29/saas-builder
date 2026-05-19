'use client'

import { useState } from 'react'
import { eparkEntries } from '@/lib/sample-data'

type Entry = typeof eparkEntries[number]

export default function DogSalonEparkContent() {
  const [items, setItems] = useState<Entry[]>(eparkEntries)

  const transfer = (id: string) => {
    setItems(prev => prev.map(e => e.id === id ? { ...e, is_transferred: true } : e))
  }

  const pending = items.filter(e => !e.is_transferred)
  const done = items.filter(e => e.is_transferred)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">eパーク 転記管理</h1>
        <p className="text-sm text-gray-400 mt-0.5">eパークから入った予約を自社システムへ転記します</p>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 sm:px-5 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
          e
        </div>
        <div>
          <p className="text-sm font-bold text-orange-700">eパーク 連携済み（デモ表示）</p>
          <p className="text-xs text-orange-400">eパークの予約を一覧表示・ワンクリックで転記できます</p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-600 mb-3">
          未転記
          {pending.length > 0
            ? <span className="text-red-500 ml-1">{pending.length}件</span>
            : <span className="text-gray-400 ml-1">0件</span>}
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {pending.length === 0 ? (
            <p className="px-5 py-8 text-sm text-gray-400 text-center">未転記の予約はありません ✓</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {pending.map(e => (
                <div key={e.id} className="px-3 sm:px-5 py-4 flex items-center gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono text-gray-400 truncate">{e.epark_id}</p>
                    <p className="font-bold text-gray-800 mt-0.5">
                      {e.dog_name} <span className="font-normal text-gray-400 text-sm">（{e.customer_name} 様）</span>
                    </p>
                    <p className="text-sm text-gray-500">{formatDate(e.reservation_date)} {e.reservation_time} ／ {e.service_type}</p>
                  </div>
                  <button
                    onClick={() => transfer(e.id)}
                    className="text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 active:bg-orange-700 px-3 sm:px-4 py-2 rounded-lg transition-colors flex-shrink-0 whitespace-nowrap"
                  >
                    転記する
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-400 mb-3">転記済み {done.length}件</h2>
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {done.map(e => (
              <div key={e.id} className="px-3 sm:px-5 py-3 flex items-center gap-3 sm:gap-4 opacity-60">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-600 text-sm">
                    {e.dog_name} <span className="text-gray-400">（{e.customer_name} 様）</span>
                  </p>
                  <p className="text-xs text-gray-400">{formatDate(e.reservation_date)} {e.reservation_time} ／ {e.service_type}</p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">転記済み</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
