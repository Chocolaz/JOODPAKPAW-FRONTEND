'use client'

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

export default function UserProfilePage() {
  const { profile, loading, error, router } = useUserProfile()

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
    <Drawer>
      <div className="px-5">
        <ProfileHeader onBack={() => router.back()} />
        <ProfileCard profile={profile} />
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <p>Edit form will be here.</p>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
