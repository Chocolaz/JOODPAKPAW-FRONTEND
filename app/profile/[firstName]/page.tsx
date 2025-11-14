// app/profile/user-profile/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile } from '@/lib/fetchAuthen'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { ChevronLeft } from 'lucide-react' // Import ChevronLeft
import { UserProfile } from '@/types'
import { useAuth } from '@/app/_components/AuthContext'

export default function UserProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/authen')
      return
    }

    if (isAuthenticated && !profile) {
      // Only fetch if authenticated and profile not yet loaded
      const fetchProfile = async () => {
        try {
          setLoading(true)
          const response = await getProfile()
          setProfile(response.data)
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message || 'Failed to fetch profile.')
          } else {
            setError('An unknown error occurred.')
          }
        } finally {
          setLoading(false)
        }
      }

      fetchProfile()
    }
  }, [router, isAuthenticated, authLoading, profile])

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="px-5">
      <button
        onClick={() => router.back()}
        className="absolute top-2.5 left-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out"
      >
        <ChevronLeft className="w-6 h-6 text-neutral-gray" />
      </button>
      <Card>
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage
              src={profile.avatar || '/graphics/welcome.svg'}
              alt={`${profile.firstName} ${profile.lastName}`}
            />
            <AvatarFallback className="text-3xl">
              {profile.firstName?.charAt(0)}
              {profile.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">
            {profile.firstName} {profile.lastName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-500">Email</span>
            <span>{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-500">Phone</span>
            <span>{profile.phone}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
