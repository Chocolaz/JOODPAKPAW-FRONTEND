'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { getProfile } from '@/lib/api'
import { UserProfile } from '@/types'
import { useAuth } from '@/app/_components/AuthContext'

export const useUserProfile = () => {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshProfile = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/authen')
      return
    }

    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
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
  }, [router, isAuthenticated, authLoading, refreshTrigger])

  return { profile, loading: authLoading || loading, error, router, refreshProfile }
}
