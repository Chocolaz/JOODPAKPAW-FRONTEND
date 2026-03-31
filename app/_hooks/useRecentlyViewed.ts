'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/_context/AuthContext'

const KEY = (userId: number | string) => `joodpakpaw_recently_viewed_${userId}`
const GUEST_KEY = 'joodpakpaw_recently_viewed'
const MAX = 10

export function useRecentlyViewed() {
  const { user } = useAuth()
  const storageKey = user ? KEY(user.id) : null
  const [ids, setIds] = useState<number[]>([])

  useEffect(() => {
    // Clear guest key when user logs in
    if (user) localStorage.removeItem(GUEST_KEY)

    if (!storageKey) {
      setIds([])
      return
    }
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) setIds(JSON.parse(stored))
      else setIds([])
    } catch {}
  }, [storageKey, user])

  const track = (propertyId: number) => {
    if (!storageKey) return
    try {
      const stored = localStorage.getItem(storageKey)
      const current: number[] = stored ? JSON.parse(stored) : []
      const updated = [propertyId, ...current.filter((id) => id !== propertyId)].slice(0, MAX)
      localStorage.setItem(storageKey, JSON.stringify(updated))
      setIds(updated)
    } catch {}
  }

  return { ids, track }
}
