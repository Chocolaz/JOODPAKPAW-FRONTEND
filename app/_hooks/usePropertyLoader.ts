'use client'

import { useState, useEffect } from 'react'
import { Property } from '@/types'
import { useParams } from 'next/navigation'

type FetcherFunc = (id: string) => Promise<{ property: Property }>

export function usePropertyLoader(fetcher: FetcherFunc) {
  const params = useParams()
  const propertyId = params.propertyId as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!propertyId) {
      setLoading(false)
      setError('Property ID is missing.')
      return
    }

    const fetchProperty = async () => {
      try {
        setLoading(true)
        const response = await fetcher(propertyId)
        setProperty(response.property)
        setError(null)
      } catch (err) {
        setError('Failed to fetch property details. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId, fetcher])

  return { property, loading, error }
}
