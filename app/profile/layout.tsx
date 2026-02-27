'use client'
// app/profile/layout.tsx
import React, { ReactNode, useEffect } from 'react'
import { useNormalizedPathname } from '@/app/_hooks/useNormalizedPathname'
import { useRouter } from 'next/navigation'
import { ProfileHeader } from './_components/ProfileHeader'
import { HostBanner } from './_components/HostBanner'
import { PetsBanner } from './pets/_components/PetsBanner'
import { AddPetBanner } from './pets/add/_components/AddPetBanner'
import { addPetStepsComponents } from './pets/add/steps' // Import the steps array
import { ProfileProvider, useProfileContext } from './ProfileContext'
import { useAuth } from '@/app/_components/AuthContext'
import { Spinner } from '@/components/ui/spinner'

function LayoutContent({ children }: { children: ReactNode }) {
  const normalizedPath = useNormalizedPathname()
  const router = useRouter()
  const { menu, hostProperties, petProfiles } = useProfileContext()
  const { isAuthenticated, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !isAuthenticated && normalizedPath !== '/profile') {
      router.replace('/profile')
    }
  }, [isAuthenticated, authLoading, normalizedPath, router])

  if (authLoading || (!isAuthenticated && normalizedPath !== '/profile')) {
    // Added normalizedPath condition
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // Determine header properties based on the current path
  const getHeaderProps = () => {
    if (normalizedPath.startsWith('/profile/host/add-property')) {
      return { title: 'Host', backPath: '/profile/host?tab=properties' }
    }
    if (normalizedPath.match(/^\/profile\/host\/booking\/\d+$/)) {
      const bookingId = normalizedPath.split('/').pop()
      return {
        title: `Booking #${bookingId}`,
        backPath: '/profile/host?tab=bookings',
      }
    }
    if (
      normalizedPath.startsWith('/profile/host/') &&
      normalizedPath.split('/').length === 4
    ) {
      // /profile/host/[propertyId]
      return null // Do not show header for this specific page
    }
    if (normalizedPath === '/profile/host') {
      return { title: 'Host', backPath: '/profile' }
    }
    if (normalizedPath === '/profile/pets') {
      return { title: 'Pets', backPath: '/profile' }
    }
    if (normalizedPath.startsWith('/profile/pets/add')) {
      return { title: 'Add Pet', backPath: '/profile/pets' }
    }
    if (normalizedPath.match(/^\/profile\/pets\/\d+$/)) {
      return null // Pet detail page has its own header
    }
    if (normalizedPath === '/profile/bookings') {
      return { title: 'Bookings', backPath: '/profile' }
    }
    if (normalizedPath.match(/^\/profile\/bookings\/\d+$/)) {
      return { title: 'Booking Detail', useBack: true }
    }
    if (normalizedPath.startsWith('/profile/') && normalizedPath !== '/profile') {
      // This covers /profile/[firstName] and other potential sub-pages
      return { title: 'Profile', backPath: '/profile' }
    }
    // Base /profile page
    return { title: 'Profile' }
  }

  const headerProps = getHeaderProps()

  const renderBanner = () => {
    if (normalizedPath.startsWith('/profile/host/add-property')) {
      const stepId = parseInt(normalizedPath.split('/').pop() || '', 10)
      if (!isNaN(stepId)) {
        return <HostBanner currentStep={stepId} totalSteps={9} />
      }
      return null
    }
    if (normalizedPath.startsWith('/profile/pets/add')) {
      const stepId = parseInt(normalizedPath.split('/').pop() || '', 10)
      if (!isNaN(stepId)) {
        return (
          <AddPetBanner
            currentStep={stepId}
            totalSteps={addPetStepsComponents.length}
          />
        )
      }
      return null
    }
    if (normalizedPath === '/profile/host') {
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
    if (normalizedPath === '/profile/pets') {
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
      <div className="w-full">
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
