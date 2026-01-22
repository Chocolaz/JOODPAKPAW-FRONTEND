'use client'

import { useEffect, useState, useCallback } from 'react'
import { getHostProperties } from '@/lib/api'
import { Property } from '@/types'

export function useHostProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHostProperties = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getHostProperties()
      const sortedProperties = (response.properties || []).sort(
        (a: Property, b: Property) => a.id - b.id
      )
      setProperties(sortedProperties)
      setError(null)
    } catch (err) {
      setError('Failed to fetch properties. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHostProperties()
  }, [fetchHostProperties])

  return { properties, loading, error, refetch: fetchHostProperties }
}
