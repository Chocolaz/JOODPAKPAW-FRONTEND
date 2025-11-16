'use client'

import { useState, useRef } from 'react'
import { UserProfile } from '@/types'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { updateUserProfile } from '@/lib/fetchAuthen'

export const EditProfileForm = ({
  profile,
  onRefreshProfile,
  onCloseDrawer,
}: {
  profile: UserProfile
  onRefreshProfile: () => void
  onCloseDrawer: () => void
}) => {
  const [firstName, setFirstName] = useState(profile.firstName)
  const [lastName, setLastName] = useState(profile.lastName)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      onCloseDrawer()
    } catch (error) {
      console.error('Failed to update profile', error)
      // You might want to show an error message to the user
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="relative mx-auto w-32 h-32 mb-4">
        <Avatar className="w-32 h-32">
          <AvatarImage src={avatarPreview || '/graphics/guest.jpg'} alt="Avatar preview" />
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
          <Image src="/icons/photo.svg" alt="Change photo" width={24} height={24} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>
      <div className="space-y-4">
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
        />
        <Input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
        />
      </div>
      <Button type="submit" className="w-full mt-6">
        Save Changes
      </Button>
    </form>
  )
}
