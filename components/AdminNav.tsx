'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

type Props = {
  userEmail: string
}

export default function AdminNav({ userEmail }: Props) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="bg-[#1a1a2e] text-white px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Demo Builder</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
            ← ホーム
          </Link>
          <span className="text-xs text-gray-400">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-300 hover:text-white transition-colors"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  )
}
