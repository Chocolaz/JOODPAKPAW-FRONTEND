'use client'

import { useState, useEffect, useCallback } from 'react'
import { Property } from '@/types'
import { ApiError } from '@/lib/errorHandling'
import { useParams, notFound } from 'next/navigation'

type FetcherFunc = (id: string) => Promise<{ property: Property }>

export function usePropertyLoader(fetcher: FetcherFunc) {
  const params = useParams()
  const propertyId = params.propertyId as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshProperty = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!propertyId || isNaN(Number(propertyId))) {
      setLoading(false)
      notFound()
      return
    }

    const fetchProperty = async () => {
      const isInitialLoad = property === null
      try {
        if (isInitialLoad) {
          setLoading(true)
        } else {
          setIsRefreshing(true)
        }
        const response = await fetcher(propertyId)
        setProperty(response.property)
        setError(null)
      } catch (err) {
        if (err instanceof ApiError && err.code === 'DB-1001') {
          notFound()
        }
        setError('Failed to fetch property details. Please try again later.')
        console.error(err)
      } finally {
        if (isInitialLoad) {
          setLoading(false)
        } else {
          setIsRefreshing(false)
        }
      }
    }

    fetchProperty()
  }, [propertyId, fetcher, refreshTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

  return { property, loading, isRefreshing, error, refreshProperty }
}
