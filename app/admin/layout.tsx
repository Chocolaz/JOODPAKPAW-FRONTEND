'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/_components/AuthContext'
import { Spinner } from '@/components/ui/spinner'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'

const NAV_ITEMS = [
  {
    label: 'Verifications',
    href: '/admin/verifications',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" strokeWidth={1.8} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isAdmin = user?.role?.some((r) => r.name === 'admin')

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.replace('/')
    }
  }, [loading, isAuthenticated, isAdmin, router])

  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#ececec]">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#ececec]" style={{ fontFamily: "'DM Sans', Helvetica, Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-[230px] min-w-[230px] flex flex-col bg-[#3a3a3a] border-r-2 border-[#2a2a2a]">
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded bg-[#555] border-2 border-white/30 flex items-center justify-center text-white font-bold text-base">
            J
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">JOODPAKPAW</p>
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
          <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider px-3 py-2">
            Management
          </p>
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded text-[13.5px] font-medium transition-all duration-150 ${
                  active
                    ? 'bg-[#111] text-white border border-white/15'
                    : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}
              >
                <span className="opacity-70">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/10 text-white/25 text-[11px] font-mono">
          {user.firstName} {user.lastName}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[60px] bg-white border-b-2 border-[#b8b8b8] flex items-center justify-between px-7 shrink-0">
          <span id="admin-topbar-title" className="font-bold text-lg text-[#1c1c1c]">
            {NAV_ITEMS.find((n) => pathname.startsWith(n.href))?.label ?? 'Admin'}
          </span>
          <div className="flex items-center gap-2 bg-[#f5f5f5] border-[1.5px] border-[#b8b8b8] rounded px-3 py-1.5 text-[13px] font-medium">
            <div className="w-7 h-7 rounded-full bg-[#e0e0e0] border-[1.5px] border-[#b8b8b8] flex items-center justify-center text-xs font-bold text-[#3a3a3a]">
              {user.firstName.charAt(0)}
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-[#3a3a3a]" />
            Admin
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-7">
          {children}
        </div>
      </div>
    </div>
  )
}
