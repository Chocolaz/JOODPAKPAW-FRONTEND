'use client'
// app/profile/layout.tsx
import React from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/_components/AuthContext'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user } = useAuth()
  const headerText = pathname.includes('/profile/host') ? 'Host' : 'Profile'

  return (
    <main className="flex flex-col items-center">
      <div className="w-full max_w-[500px] flex flex-col overflow-hidden">
        <h2 className="text-xl font-semibold pt-4 pb-2 mb-2 text-center border-b-2 text-deep-teal">
          {headerText}
        </h2>
        {pathname.includes('/profile/host') && (
          <div className="bg-off-white py-10 px-10 rounded-bl-xl rounded-br-xl -mt-2 shadow-sm">
            <p className="text-lg text-accent-orange">
              Hello {user?.firstName} {user?.lastName}
            </p>
            <h4 className="text-deep-teal">
              Manage your host activities below!
            </h4>
          </div>
        )}
        {children}
      </div>
    </main>
  )
}
