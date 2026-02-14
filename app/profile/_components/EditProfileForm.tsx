'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { UserProfile } from '@/types'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { updateUserProfile } from '@/lib/api'
import { useAuth } from '@/app/_components/AuthContext'
import { useRouter } from 'next/router'

export const EditProfileForm = ({
  profile,
  onRefreshProfile,
  onCloseDrawer,
}: {
  profile: UserProfile
  onRefreshProfile: () => void
  onCloseDrawer: () => void
}) => {
  const router = useRouter()
  const guestAvatarSrc = `${router.basePath || ''}/graphics/guest.jpg`
  const { refreshAuth } = useAuth()
  const [firstName, setFirstName] = useState(profile.firstName)
  const [lastName, setLastName] = useState(profile.lastName)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isDirty =
    firstName !== profile.firstName ||
    lastName !== profile.lastName ||
    avatarFile !== null

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('firstName', firstName)
    formData.append('lastName', lastName)
    if (avatarFile) {
      formData.append('avatar', avatarFile)
    }

    try {
      await updateUserProfile(profile.id.toString(), formData)
      onRefreshProfile()
      refreshAuth()
      onCloseDrawer()
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile', error)
      // You might want to show an error message to the user
    }
  }

  return (
    <form onSubmit={handleSubmit} className="py-4 px-14">
      <div className="relative mx-auto w-47 h-47 mb-4">
        <Avatar className="w-47 h-47 border border-gray-200 ring-1 ring-gray-200 ring-offset-15 ring-offset-background">
          <AvatarImage
            src={avatarPreview || guestAvatarSrc}
            alt="Avatar preview"
          />
          <AvatarFallback className="text-5xl">
            {profile.firstName?.charAt(0)}
            {profile.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={handleAvatarClick}
          className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
        >
          <Image
            src="/icons/photo.svg"
            alt="Change photo"
            width={24}
            height={24}
          />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>
      <div>
        <div className="space-y-1">
          <label htmlFor="firstName" className="text-sm text-deep-teal">
            Firstname
          </label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            maxLength={60}
          />
          <p className="text-sm text-muted-foreground text-right">{`${firstName.length}/60`}</p>
        </div>
        <div className="space-y-1">
          <label htmlFor="lastName" className="text-sm text-deep-teal">
            Lastname
          </label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            maxLength={60}
          />
          <p className="text-sm text-muted-foreground text-right">{`${lastName.length}/60`}</p>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full mt-6 bg-positive-green h-12 text-[16px]"
        disabled={!isDirty}
      >
        Confirm
      </Button>
    </form>
  )
}
