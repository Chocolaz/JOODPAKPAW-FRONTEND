'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { getProperties } from '@/lib/api'
import { getLowestPrice } from '@/lib/utils'
import { PropertiesResponse, Property } from '@/types'
import { useAuth } from '@/app/_components/AuthContext'
import { useBrowseFilters } from '@/app/_hooks/useBrowseFilters'
import { BrowsePageLayout, PAGE_SIZE } from '../_components/BrowsePageLayout'

const NEW_LISTING_DAYS = 30
const NEW_LISTING_FALLBACK = 20

export default function NewListingsPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const { isAuthenticated } = useAuth()
  const { filters } = useBrowseFilters()

  useEffect(() => {
    getProperties(1, 1000)
      .then((res) => setProperties((res as PropertiesResponse).data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [isAuthenticated])

  const filtered = useMemo(() => {
    const applyFilters = (list: Property[]) =>
      list.filter((p) => {
        if (filters.petTypes.length > 0) {
          const names = (p.pets || []).map((pet) => pet.name.toLowerCase())
          if (!filters.petTypes.some((t) => names.includes(t))) return false
        }
        if (filters.minRating > 0 && p.avgRating < filters.minRating) return false
        if (filters.maxPrice !== '') {
          const price = getLowestPrice(p.roomCategories)
          if (price !== null && price > Number(filters.maxPrice)) return false
        }
        return true
      })

    const sorted = [...properties].sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt).getTime() -
        new Date(a.publishedAt ?? a.createdAt).getTime()
    )

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - NEW_LISTING_DAYS)
    const recent = applyFilters(sorted.filter((p) => new Date(p.publishedAt ?? p.createdAt) >= cutoff))

    return recent.length >= 5 ? recent : applyFilters(sorted).slice(0, NEW_LISTING_FALLBACK)
  }, [properties, filters])

  return (
    <BrowsePageLayout
      title="New Listings"
      icon={<Sparkles className="w-5 h-5 text-deep-teal" />}
      isLoading={isLoading}
      filtered={filtered}
      visibleCount={visibleCount}
      setVisibleCount={setVisibleCount}
      showHeartIcon={isAuthenticated}
      showPetPolicyChip={true}
    />
  )
}
