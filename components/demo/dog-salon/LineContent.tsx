'use client'

import { useState } from 'react'
import { lineCandidates } from '@/lib/sample-data'

type Candidate = typeof lineCandidates[number] & { _skipped?: boolean }

export default function DogSalonLineContent() {
  const [items, setItems] = useState<Candidate[]>(lineCandidates)

  const register = (id: string) => {
    setItems(prev => prev.map(l => l.id === id ? { ...l, status: 'registered' } : l))
  }

  const skip = (id: string) => {
    setItems(prev => prev.map(l => l.id === id ? { ...l, status: 'registered', _skipped: true } : l))
  }

  const pending = items.filter(l => l.status === 'pending')
  const done = items.filter(l => l.status === 'registered')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">LINE 予約候補</h1>
        <p className="text-sm text-gray-400 mt-0.5">LINEで受信した予約希望メッセージを管理します</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl px-4 sm:px-5 py-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-green-700">LINE公式アカウント 連携済み（デモ表示）</p>
          <p className="text-xs text-green-500">新着メッセージを自動取得・予約管理に転記できます</p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-600 mb-3">
          対応待ち
          {pending.length > 0
            ? <span className="text-red-500 ml-1">{pending.length}件</span>
            : <span className="text-gray-400 ml-1">0件</span>}
        </h2>
        {pending.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-8 text-center text-sm text-gray-400">
            対応待ちのメッセージはありません ✓
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(l => (
              <div key={l.id} className="bg-white rounded-xl border border-yellow-200 p-3 sm:p-4 transition-all">
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {l.sender_name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-800">{l.sender_name}</span>
                      <span className="text-xs text-gray-400">{l.received_at}</span>
                    </div>
                    <div className="bg-green-50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 leading-relaxed">
                      {l.message}
                    </div>
                    {l.requested_date && (
                      <p className="text-xs text-gray-400 mt-2">
                        📅 希望日: {new Date(l.requested_date).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => register(l.id)}
                      className="text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                    >
                      予約に転記
                    </button>
                    <button
                      onClick={() => skip(l.id)}
                      className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      スキップ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {done.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-400 mb-3">完了済み</h2>
          <div className="space-y-2">
            {done.map(l => (
              <div key={l.id} className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {l.sender_name.charAt(0)}
                </div>
                <span className="text-sm text-gray-400 flex-1">{l.sender_name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${l._skipped ? 'bg-gray-100 text-gray-400' : 'bg-green-100 text-green-600'}`}>
                  {l._skipped ? 'スキップ' : '転記済み'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
