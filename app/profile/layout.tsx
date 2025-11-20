'use client'
// app/profile/layout.tsx
import React, { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ProfileHeader } from './_components/ProfileHeader'
import { HostBanner } from './_components/HostBanner'
import { ProfileProvider, useProfileContext } from './ProfileContext'

function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { menu } = useProfileContext()

  // Determine header properties based on the current path
  const getHeaderProps = () => {
    if (pathname.startsWith('/profile/host/add-property')) {
      return { title: 'Host', backPath: '/profile/host' }
    }
    if (pathname === '/profile/host') {
      return { title: 'Host', backPath: '/profile' }
    }
    if (pathname.startsWith('/profile/') && pathname !== '/profile') {
      // This covers /profile/[firstName] and other potential sub-pages
      return { title: 'Profile', backPath: '/profile' }
    }
    // Base /profile page
    return { title: 'Profile' }
  }

  const headerProps = getHeaderProps()
  const showBanner =
    pathname.startsWith('/profile/host') && pathname !== '/profile/host/add-property'

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-[500px] h-screen overflow-y-auto">
        <ProfileHeader {...headerProps} menu={menu} />
        {showBanner && <HostBanner />}
        {children}
      </div>
    </main>
  )
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <LayoutContent>{children}</LayoutContent>
    </ProfileProvider>
  )
}
