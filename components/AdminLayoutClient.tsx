'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminNav from '@/components/AdminNav'
import AdminLogoutButton from '@/components/AdminLogoutButton'

type Props = {
  monthlyCount: number
  userEmail: string
  children: React.ReactNode
}

export default function AdminLayoutClient({ monthlyCount, userEmail, children }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop only */}
      <div className="hidden lg:block shrink-0">
        <AdminNav monthlyCount={monthlyCount} />
      </div>

      {/* Mobile drawer + overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminNav monthlyCount={monthlyCount} onItemClick={() => setOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
        <div className="bg-[#0f172a] flex items-center px-4 sm:px-6 py-3 shrink-0 gap-3">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="メニューを開く"
            aria-expanded={open}
            className="lg:hidden -ml-1 p-2 text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile logo (replaces sidebar logo on mobile) */}
          <div className="lg:hidden flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="font-bold text-white text-sm truncate">Demo Builder</span>
          </div>

          {/* Spacer on desktop pushes email + logout to the right */}
          <div className="hidden lg:block flex-1" />

          <span className="text-xs text-gray-400 hidden sm:block truncate max-w-40">{userEmail}</span>
          <AdminLogoutButton />
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
