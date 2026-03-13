'use client'

import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '@/app/_components/PageHeader'
import { PropertyList } from '@/app/_components/PropertyList'
import { getProperties, getRecommendedProperties } from '@/lib/api'
import { getLowestPrice } from '@/lib/utils'
import { PropertiesResponse, Property } from '@/types'
import { useAuth } from '@/app/_components/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchX, Sparkles, Star, Heart } from 'lucide-react'
import { useBrowseFilters } from '@/app/_hooks/useBrowseFilters'
import { BrowseSection } from './_components/BrowseSection'
import { RecommendedCTA } from './_components/RecommendedCTA'

const SKELETON_COUNT = 12
const RECOMMEND_LIMIT = 10
const TOP_RATED_MIN = 4.0

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([])
  const [recommendedTotal, setRecommendedTotal] = useState(0)
  const { isAuthenticated } = useAuth()
  const { searchQuery, filters, buildSeeAllUrl } = useBrowseFilters()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true)
        const response = (await getProperties(
          1,
          1000,
          searchQuery || undefined,
          searchQuery ? 'title' : undefined
        )) as PropertiesResponse
        setProperties(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProperties()
  }, [searchQuery, isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) {
      setRecommendedProperties([])
      setRecommendedTotal(0)
      return
    }
    getRecommendedProperties(1, RECOMMEND_LIMIT)
      .then((res) => {
        setRecommendedProperties(res.data)
        setRecommendedTotal(res.totalRows)
      })
      .catch(() => {
        setRecommendedProperties([])
        setRecommendedTotal(0)
      })
  }, [isAuthenticated])

  const filteredProperties = useMemo(() => {
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

  const topRated = useMemo(
    () =>
      [...filteredProperties]
        .filter((p) => p.avgRating >= TOP_RATED_MIN)
        .sort((a, b) => b.avgRating - a.avgRating),
    [filteredProperties]
  )

  const newListings = useMemo(
    () =>
      [...filteredProperties].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [filteredProperties]
  )

  return (
    <div>
      {/* Mobile only: heading text (desktop hero is in BrowseLayoutClient) */}
      <div className="px-5 lg:hidden">
        <PageHeader />
      </div>

      {/* IMPORTANT: use <div> not <main> — root layout already wraps in <main> */}
      <div className="px-5 lg:px-12 mt-6 lg:mt-0 pb-28 lg:pb-16">
        {/* Search results header */}
        {searchQuery && (
          <div className="flex items-center justify-between mb-4 lg:mb-8 lg:pt-10">
            <h5 className="text-xl lg:text-3xl xl:text-4xl font-medium text-deep-teal">
              Results for &ldquo;{searchQuery}&rdquo;
            </h5>
            <AnimatePresence>
              {!isLoading && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm lg:text-lg xl:text-xl text-neutral-gray"
                >
                  {filteredProperties.length}{' '}
                  {filteredProperties.length === 1 ? 'place' : 'places'}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 lg:pt-10"
            >
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square w-full bg-gray-200 rounded-[20px]" />
                  <div className="mt-2 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : searchQuery ? (
            /* Flat search results */
            <motion.div
              key="search-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {filteredProperties.length === 0 ? (
                <EmptyState searchQuery={searchQuery} hasFilters={false} />
              ) : (
                <PropertyList
                  properties={filteredProperties}
                  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
                  showPetPolicyChip={true}
                  showHeartIcon={isAuthenticated}
                />
              )}
            </motion.div>
          ) : (
            /* Sectioned browse */
            <motion.div
              key="sections"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:pt-2"
            >
              {/* Recommended slot — always renders (CTA for logged-out, cards for logged-in) */}
              {isAuthenticated ? (
                recommendedProperties.length > 0 && (
                  <BrowseSection
                    title="Recommended for You"
                    icon={<Heart className="w-5 h-5 fill-accent-orange text-accent-orange" />}
                    properties={recommendedProperties}
                    totalCount={recommendedTotal}
                    showHeartIcon={true}
                    showPetPolicyChip={true}
                    seeAllHref={buildSeeAllUrl('/recommended')}
                  />
                )
              ) : (
                <RecommendedCTA />
              )}

              {filteredProperties.length === 0 ? (
                <EmptyState searchQuery="" hasFilters={filters.petTypes.length > 0 || filters.minRating > 0 || filters.maxPrice !== ''} />
              ) : (
                <>
                  <BrowseSection
                    title="Top Rated"
                    icon={<Star className="w-5 h-5 fill-yellow-400 text-yellow-500" />}
                    properties={topRated}
                    totalCount={topRated.length}
                    showHeartIcon={isAuthenticated}
                    showPetPolicyChip={true}
                    seeAllHref={buildSeeAllUrl('/top-rated')}
                  />
                  <BrowseSection
                    title="New Listings"
                    icon={<Sparkles className="w-5 h-5 text-deep-teal" />}
                    properties={newListings}
                    totalCount={newListings.length}
                    showHeartIcon={isAuthenticated}
                    showPetPolicyChip={true}
                    seeAllHref={buildSeeAllUrl('/new-listings')}
                  />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function EmptyState({ searchQuery, hasFilters }: { searchQuery: string; hasFilters: boolean }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center min-h-[40vh] gap-4 lg:gap-6 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
        className="w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-gray-100 flex items-center justify-center"
      >
        <SearchX className="w-9 h-9 lg:w-12 lg:h-12 text-gray-300" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="space-y-1 lg:space-y-2"
      >
        <p className="font-semibold text-gray-700 lg:text-xl xl:text-2xl">No properties found</p>
        <p className="text-sm lg:text-lg xl:text-xl text-neutral-gray">
          {searchQuery || hasFilters
            ? 'Try adjusting your search or filters.'
            : 'No properties available right now.'}
        </p>
      </motion.div>
    </motion.div>
  )
}
