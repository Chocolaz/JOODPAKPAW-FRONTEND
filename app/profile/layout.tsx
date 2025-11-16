'use client'
// app/profile/layout.tsx
import React from 'react'
import { usePathname } from 'next/navigation'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const headerText = pathname.includes('/profile/host') ? 'Host' : 'Profile'

  return (
    <main className="flex flex-col items-center">
      <div className="w-full max_w-[500px] flex flex-col overflow-hidden">
        <h2 className="text-xl font-semibold pt-4 pb-2 mb-2 text-center border-b-2 text-deep-teal">
          {headerText}
        </h2>
        {children}
      </div>
    </main>
  )
}
