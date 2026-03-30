'use client'

import { useEffect, useState } from 'react'

const KEY = 'joodpakpaw_recently_viewed'
const MAX = 10

export function useRecentlyViewed() {
  const [ids, setIds] = useState<number[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY)
      if (stored) setIds(JSON.parse(stored))
    } catch {}
  }, [])

  const track = (propertyId: number) => {
    try {
      const stored = localStorage.getItem(KEY)
      const current: number[] = stored ? JSON.parse(stored) : []
      const updated = [propertyId, ...current.filter((id) => id !== propertyId)].slice(0, MAX)
      localStorage.setItem(KEY, JSON.stringify(updated))
      setIds(updated)
    } catch {}
  }

  return { ids, track }
}
