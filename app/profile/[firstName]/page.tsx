'use client'

import { useState } from 'react'
import { useUserProfile } from '@/app/profile/_hooks/useUserProfile'
import { ProfileHeader } from '@/app/profile/_components/ProfileHeader'
import { ProfileCard } from '@/app/profile/_components/ProfileCard'
import { LoadingState } from '@/app/profile/_components/LoadingState'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { EditProfileForm } from '@/app/profile/_components/EditProfileForm'

export default function UserProfilePage() {
  const { profile, loading, error, router, refreshProfile } = useUserProfile()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  if (!profile) {
    return null
  }

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <div className="px-5">
        <ProfileHeader onBack={() => router.back()} />
        <ProfileCard profile={profile} />
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
        </DrawerHeader>
        <EditProfileForm
          profile={profile}
          onRefreshProfile={refreshProfile}
          onCloseDrawer={() => setIsDrawerOpen(false)}
        />
      </DrawerContent>
    </Drawer>
  )
}
