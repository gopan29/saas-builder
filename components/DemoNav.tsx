'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Demo } from '@/types/demo'
import { TEMPLATE_NAV } from '@/types/demo'

type Props = {
  demo: Demo
  slug: string
}

const SYSTEM_NAMES: Record<string, string> = {
  dog_salon: 'ドッグサロン管理システム',
  beauty_salon: '美容室管理システム',
  dental_clinic: '歯科クリニック管理システム',
  restaurant: '飲食店管理システム',
  esthetic_salon: 'エステサロン管理システム',
  osteopathic_clinic: '整骨院管理システム',
  juku: '学習塾管理システム',
  yoga_fitness: 'ヨガ・フィットネス管理システム',
}

function isDarkColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
}

export default function DemoNav({ demo, slug }: Props) {
  const pathname = usePathname()
  const base = `/demo/${slug}`
  const navItems = TEMPLATE_NAV[demo.industry_template] ?? TEMPLATE_NAV['dog_salon']
  const systemName = SYSTEM_NAMES[demo.industry_template] ?? 'ドッグサロン管理システム'
  const isDogSalon = demo.industry_template === 'dog_salon'
  const badgeTextColor = isDarkColor(demo.theme_color) ? '#ffffff' : '#831843'

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
      <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
        {/* Left: logo + name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{
              backgroundColor: demo.theme_color,
              color: badgeTextColor,
            }}
          >
            {demo.client_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-gray-800 text-sm sm:text-base truncate block sm:inline">{demo.client_name}</span>
            <span className="ml-2 text-xs text-gray-400 hidden sm:inline">{systemName}</span>
          </div>
        </div>

        {/* Right: DEMO + extras */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span
            className="text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full flex-shrink-0"
            style={{
              backgroundColor: demo.theme_color,
              color: badgeTextColor,
            }}
          >
            DEMO
          </span>

          {isDogSalon && (
            <>
              {/* Notification bell */}
              <div className="relative">
                <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold leading-none"
                  style={{ backgroundColor: '#f472b6', fontSize: '10px' }}
                >
                  3
                </span>
              </div>

              {/* User avatar + name */}
              <button className="flex items-center gap-1.5 sm:gap-2 hover:bg-gray-50 rounded-lg px-1.5 sm:px-2 py-1 transition-colors">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden shrink-0"
                  style={{ backgroundColor: demo.theme_color, color: badgeTextColor }}
                >
                  田
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold text-gray-800 leading-tight">田中 美咲</p>
                  <p className="text-xs text-gray-400 leading-tight">オーナー</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab nav */}
      <nav className="px-2 flex gap-0 overflow-x-auto">
        {navItems.map(item => {
          const href = `${base}${item.path}`
          const isActive = item.path === ''
            ? pathname === base
            : pathname.startsWith(href)

          return (
            <Link
              key={item.path}
              href={href}
              className="flex-shrink-0 text-sm font-medium px-3.5 py-3.5 border-b-2 transition-colors whitespace-nowrap"
              style={{
                borderBottomColor: isActive ? demo.theme_color : 'transparent',
                color: isActive ? demo.theme_color : '#6b7280',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
