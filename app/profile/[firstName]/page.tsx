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
  DrawerClose,
} from '@/components/ui/drawer'
import { EditProfileForm } from '@/app/profile/_components/EditProfileForm'
import { ChangePasswordForm } from '@/app/profile/_components/ChangePasswordForm'
import { ChevronLeft } from 'lucide-react'

export default function UserProfilePage() {
  const { profile, loading, error, router, refreshProfile } = useUserProfile()
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false)
  const [isPasswordDrawerOpen, setIsPasswordDrawerOpen] = useState(false)

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
    <>
      <Drawer open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <div className="px-5">
          <ProfileHeader onBack={() => router.back()} />
          <ProfileCard
            profile={profile}
            onPasswordChangeClick={() => setIsPasswordDrawerOpen(true)}
          />
        </div>
        <DrawerContent aria-describedby={undefined}>
          <DrawerHeader>
            <div className="flex items-center ">
              <DrawerClose asChild>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                  <ChevronLeft className="w-6 h-6 text-neutral-gray" />
                </button>
              </DrawerClose>
              <DrawerTitle>Edit Profile</DrawerTitle>
              <div className="w-10"></div> {/* Placeholder for alignment */}
            </div>
          </DrawerHeader>
          <EditProfileForm
            profile={profile}
            onRefreshProfile={refreshProfile}
            onCloseDrawer={() => setIsEditDrawerOpen(false)}
          />
        </DrawerContent>
      </Drawer>

      <Drawer
        open={isPasswordDrawerOpen}
        onOpenChange={setIsPasswordDrawerOpen}
      >
        <DrawerContent aria-describedby={undefined}>
          <DrawerHeader>
            <div className="flex items-center ">
              <DrawerClose asChild>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                  <ChevronLeft className="w-6 h-6 text-neutral-gray" />
                </button>
              </DrawerClose>
              <DrawerTitle>Change Password</DrawerTitle>
              <div className="w-10"></div> {/* Placeholder for alignment */}
            </div>
          </DrawerHeader>
          <ChangePasswordForm
            onCloseDrawer={() => setIsPasswordDrawerOpen(false)}
          />
        </DrawerContent>
      </Drawer>
    </>
  )
}
