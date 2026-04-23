'use client'

import { useEffect, useMemo, useState } from 'react'
import { Tag } from 'lucide-react'
import { getProperties } from '@/lib/api'
import { getLowestPrice } from '@/lib/utils'
import { Property } from '@/types'
import { useAuth } from '@/app/_components/AuthContext'
import { useBrowseFilters } from '@/app/_hooks/useBrowseFilters'
import { BrowsePageLayout, PAGE_SIZE } from '../_components/BrowsePageLayout'

export default function BestValuePage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const { isAuthenticated } = useAuth()
  const { filters } = useBrowseFilters()

  useEffect(() => {
    getProperties(1, 500, { sortBy: 'price' })
      .then((res) => setProperties(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [isAuthenticated])

  const filtered = useMemo(() => {
    return properties.filter((p) => {
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
  }, [properties, filters])

  return (
    <BrowsePageLayout
      title="Best Value"
      icon={<Tag className="w-5 h-5 text-positive-green" />}
      isLoading={isLoading}
      filtered={filtered}
      visibleCount={visibleCount}
      setVisibleCount={setVisibleCount}
      showHeartIcon={isAuthenticated}
      showPetPolicyChip={true}
    />
  )
}
