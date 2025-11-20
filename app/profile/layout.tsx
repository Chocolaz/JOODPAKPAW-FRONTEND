'use client'
// app/profile/layout.tsx
import React from 'react'
import { usePathname } from 'next/navigation'
import { ProfileHeader } from './_components/ProfileHeader'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Determine header properties based on the current path
  const getHeaderProps = () => {
    if (pathname.startsWith('/profile/host')) {
      return { title: 'Host', showBackButton: true }
    }
    if (pathname === '/profile') {
      return { title: 'Profile', showBackButton: false }
    }
    if (pathname.startsWith('/profile/')) {
      return { title: 'Profile', showBackButton: true }
    }
    // Default case
    return { title: 'Profile', showBackButton: false }
  }

  const headerProps = getHeaderProps()

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-[500px] flex flex-col">
        <ProfileHeader {...headerProps} />
        <div className="grow overflow-y-auto">{children}</div>
      </div>
    </main>
  )
}
