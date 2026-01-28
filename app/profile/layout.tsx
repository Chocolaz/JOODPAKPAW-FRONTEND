'use client'
// app/profile/layout.tsx
import React, { ReactNode, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ProfileHeader } from './_components/ProfileHeader'
import { HostBanner } from './_components/HostBanner'
import { PetsBanner } from './pets/_components/PetsBanner'
import { AddPetBanner } from './pets/add/_components/AddPetBanner'
import { ProfileProvider, useProfileContext } from './ProfileContext'
import { useAuth } from '@/app/_components/AuthContext'
import { Spinner } from '@/components/ui/spinner'

function LayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { menu, hostProperties, petProfiles } = useProfileContext()
  const { isAuthenticated, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated && pathname !== '/profile') {
      router.replace('/authen')
    }
  }, [isAuthenticated, authLoading, pathname, router]) // Re-added pathname to deps

  if (authLoading || (!isAuthenticated && pathname !== '/profile')) {
    // Added pathname condition
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // Determine header properties based on the current path
  const getHeaderProps = () => {
    if (pathname.startsWith('/profile/host/add-property')) {
      return { title: 'Host', backPath: '/profile/host?tab=properties' }
    }
    if (pathname.match(/^\/profile\/host\/booking\/\d+$/)) {
      return {
        title: 'Booking Detail(Host)',
        backPath: '/profile/host?tab=bookings',
      }
    }
    if (
      pathname.startsWith('/profile/host/') &&
      pathname.split('/').length === 4
    ) {
      // /profile/host/[propertyId]
      return null // Do not show header for this specific page
    }
    if (pathname === '/profile/host') {
      return { title: 'Host', backPath: '/profile' }
    }
    if (pathname === '/profile/pets') {
      return { title: 'Pets', backPath: '/profile' }
    }
    if (pathname.startsWith('/profile/pets/add')) {
      return { title: 'Add Pet', backPath: '/profile/pets' }
    }
    if (pathname.match(/^\/profile\/pets\/\d+$/)) {
      return { title: 'Pet Profile', backPath: '/profile/pets' }
    }
    if (pathname === '/profile/bookings') {
      return { title: 'Bookings', backPath: '/profile' }
    }
    if (pathname.match(/^\/profile\/bookings\/\d+$/)) {
      return { title: 'Booking Detail', backPath: '/profile/bookings' }
    }
    if (pathname.startsWith('/profile/') && pathname !== '/profile') {
      // This covers /profile/[firstName] and other potential sub-pages
      return { title: 'Profile', backPath: '/profile' }
    }
    // Base /profile page
    return { title: 'Profile' }
  }

  const headerProps = getHeaderProps()

  const renderBanner = () => {
    if (pathname.startsWith('/profile/host/add-property')) {
      const stepId = parseInt(pathname.split('/').pop() || '', 10)
      if (!isNaN(stepId)) {
        return <HostBanner currentStep={stepId} totalSteps={9} />
      }
      return null
    }
    if (pathname.startsWith('/profile/pets/add')) {
      const stepId = parseInt(pathname.split('/').pop() || '', 10)
      if (!isNaN(stepId)) {
        return <AddPetBanner currentStep={stepId} totalSteps={5} />
      }
      return null
    }
    if (pathname === '/profile/host') {
      const { properties, error } = hostProperties

      if (error) {
        return null // or some error indicator
      }

      const publishedCount = properties.filter((p) => p.isActive).length
      const draftCount = properties.length - publishedCount

      return (
        <HostBanner
          summary={{
            total: properties.length,
            published: publishedCount,
            draft: draftCount,
          }}
        />
      )
    }
    if (pathname === '/profile/pets') {
      const { pets, error } = petProfiles
      if (error) {
        return null
      }
      return <PetsBanner summary={{ total: pets.length }} />
    }
    return null
  }

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-[500px]">
        {headerProps && <ProfileHeader {...headerProps} menu={menu} />}
        {renderBanner()}
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
