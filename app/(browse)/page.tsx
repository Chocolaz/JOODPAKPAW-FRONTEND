'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import Fuse from 'fuse.js'
import { PageHeader } from '@/app/_components/PageHeader'
import { PropertyList } from '@/app/_components/PropertyList'
import { getProperties, getRecommendedProperties } from '@/lib/api'
import { getLowestPrice } from '@/lib/utils'
import { PropertiesResponse, Property } from '@/types'
import { useAuth } from '@/app/_components/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchX, Sparkles, Star, Heart, Loader2, Tag, MapPin, Dog, Cat, Clock } from 'lucide-react'
import { useBrowseFilters } from '@/app/_hooks/useBrowseFilters'
import { useRecentlyViewed } from '@/app/_hooks/useRecentlyViewed'
import { BrowseSection } from './_components/BrowseSection'

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'province', weight: 0.25 },
    { name: 'district', weight: 0.15 },
    { name: 'description', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
}

const SKELETON_COUNT = 12
const RECOMMEND_LIMIT = 10
const TOP_RATED_MIN = 4.0
const PAGE_SIZE = 50

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRows, setTotalRows] = useState(0)
  const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([])
  const [recommendedTotal, setRecommendedTotal] = useState(0)
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const { isAuthenticated, user } = useAuth()
  const { searchQuery, filters, buildSeeAllUrl } = useBrowseFilters()
  const { ids: recentlyViewedIds } = useRecentlyViewed()
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)

  const fetchKeyRef = useRef(0)

  const fetchProperties = useCallback(async (pageNum: number, reset: boolean) => {
    const key = ++fetchKeyRef.current
    if (reset) setIsLoading(true)
    else setLoadingMore(true)
    try {
      const response = (await getProperties(pageNum, PAGE_SIZE)) as PropertiesResponse
      if (key !== fetchKeyRef.current) return
      if (reset) {
        setProperties(response.data)
        getProperties(1, response.totalRows)
          .then((res) => setAllProperties((res as PropertiesResponse).data))
          .catch(() => {})
      } else {
        setProperties((prev) => [...prev, ...response.data])
      }
      setPage(pageNum)
      setTotalPages(response.totalPages)
      setTotalRows(response.totalRows)
    } catch (error) {
      console.error(error)
    } finally {
      if (key === fetchKeyRef.current) {
        setIsLoading(false)
        setLoadingMore(false)
      }
    }
  }, [])

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {}
    )
  }, [])

  useEffect(() => {
    fetchProperties(1, true)
  }, [fetchProperties, isAuthenticated])

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

  // Exclude the current user's own properties
  const visibleProperties = useMemo(() => {
    if (!user) return properties
    return properties.filter((p) => p.hostId !== user.id)
  }, [properties, user])

  const searchedProperties = useMemo(() => {
    if (!searchQuery.trim()) return visibleProperties
    const fuse = new Fuse(visibleProperties, fuseOptions)
    return fuse.search(searchQuery).map((r) => r.item)
  }, [visibleProperties, searchQuery])

  const filteredProperties = useMemo(() => {
    return searchedProperties.filter((p) => {
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
  }, [searchedProperties, filters])

  const sectionBase = useMemo(() => {
    const base = allProperties.length > 0 ? allProperties : filteredProperties
    return base.filter((p) => {
      if (user && p.hostId === user.id) return false
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
  }, [allProperties, filteredProperties, user, filters])

  const bestValue = useMemo(() => {
    const withPrice = sectionBase.filter((p) => getLowestPrice(p.roomCategories) !== null)
    const avg =
      withPrice.reduce((sum, p) => sum + (getLowestPrice(p.roomCategories) ?? 0), 0) /
      (withPrice.length || 1)
    return withPrice
      .filter((p) => (getLowestPrice(p.roomCategories) ?? Infinity) <= avg)
      .sort((a, b) => {
        const priceA = getLowestPrice(a.roomCategories) ?? Infinity
        const priceB = getLowestPrice(b.roomCategories) ?? Infinity
        return priceA - priceB
      })
  }, [sectionBase])

  const topRated = useMemo(
    () =>
      [...sectionBase]
        .filter((p) => p.avgRating >= TOP_RATED_MIN)
        .sort((a, b) => b.avgRating - a.avgRating),
    [sectionBase]
  )

  const newListings = useMemo(() => {
    const sorted = [...sectionBase].sort(
      (a, b) =>
        new Date(b.publishedAt ?? b.createdAt).getTime() -
        new Date(a.publishedAt ?? a.createdAt).getTime()
    )
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 30)
    const recent = sorted.filter((p) => new Date(p.publishedAt ?? p.createdAt) >= cutoff)
    return recent.length >= 5 ? recent : sorted.slice(0, 20)
  }, [filteredProperties])

  const nearYou = useMemo(() => {
    if (!userLocation) return []
    return [...sectionBase]
      .filter((p) => {
        if (p.latitude == null || p.longitude == null) return false
        return haversineDistance(userLocation.lat, userLocation.lon, p.latitude, p.longitude) <= 50
      })
      .sort((a, b) => {
        const distA = haversineDistance(userLocation.lat, userLocation.lon, a.latitude, a.longitude)
        const distB = haversineDistance(userLocation.lat, userLocation.lon, b.latitude, b.longitude)
        return distA - distB
      })
  }, [sectionBase, userLocation])

  const dogFriendly = useMemo(
    () => sectionBase.filter((p) => (p.pets || []).some((pet) => pet.name.toLowerCase() === 'dog')),
    [sectionBase]
  )

  const catFriendly = useMemo(
    () => sectionBase.filter((p) => (p.pets || []).some((pet) => pet.name.toLowerCase() === 'cat')),
    [sectionBase]
  )

  const recentlyViewed = useMemo(() => {
    if (recentlyViewedIds.length === 0) return []
    return recentlyViewedIds
      .map((id) => sectionBase.find((p) => p.id === id))
      .filter((p): p is Property => p != null)
  }, [recentlyViewedIds, sectionBase])

  return (
    <div>
      {/* Mobile only: heading text (desktop hero is in BrowseLayoutClient) */}
      <div className="px-5 lg:hidden">
        <PageHeader />
      </div>

      {/* IMPORTANT: use <div> not <main> — root layout already wraps in <main> */}
      <div className="px-5 lg:px-12 mt-6 lg:mt-0 pb-28 lg:pb-16">
        {(() => {
          const hasActiveFilters = filters.petTypes.length > 0 || filters.minRating > 0 || filters.maxPrice !== ''
          const isFiltering = !!searchQuery || hasActiveFilters

          const filterLabel = [
            searchQuery ? `"${searchQuery}"` : null,
            filters.petTypes.length > 0 ? filters.petTypes.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(' & ') : null,
            filters.minRating > 0 ? `${filters.minRating}★+` : null,
            filters.maxPrice ? `฿${Number(filters.maxPrice).toLocaleString()} max` : null,
          ].filter(Boolean).join(' · ')

          return (
            <>
              {/* Flat results header — shown when searching or filtering */}
              {isFiltering && (
                <div className="flex items-center justify-between mb-4 lg:mb-8 lg:pt-10">
                  <h5 className="text-xl lg:text-3xl xl:text-4xl font-medium text-deep-teal truncate mr-4">
                    {filterLabel}
                  </h5>
                  <AnimatePresence>
                    {!isLoading && (
                      <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm lg:text-lg xl:text-xl text-neutral-gray shrink-0"
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
                    className="space-y-0 lg:pt-2"
                  >
                    {Array.from({ length: 3 }).map((_, si) => (
                      <div key={si} className="mb-10 lg:mb-0 lg:py-10 lg:border-b lg:border-gray-100 animate-pulse">
                        {/* Section header */}
                        <div className="flex items-center gap-2 mb-4 lg:mb-6">
                          <div className="w-5 h-5 bg-gray-200 rounded-full" />
                          <div className="h-5 bg-gray-200 rounded w-28" />
                        </div>
                        {/* Cards row */}
                        <div className="flex gap-4 overflow-hidden -mx-5 px-5 lg:mx-0 lg:px-0">
                          {Array.from({ length: 7 }).map((_, ci) => (
                            <div key={ci} className="w-44 shrink-0 lg:w-[calc((100%-6*1rem)/7)]">
                              <div className="aspect-square w-full bg-gray-200 rounded-[20px]" />
                              <div className="mt-2 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 rounded w-1/3" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                ) : isFiltering ? (
                  /* Flat results — search or filter active */
                  <motion.div
                    key="filtered-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {filteredProperties.length === 0 ? (
                      <EmptyState searchQuery={searchQuery} hasFilters={hasActiveFilters} />
                    ) : (
                      <>
                        <PropertyList
                          properties={filteredProperties}
                          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 lg:gap-6"
                          showPetPolicyChip={true}
                          showHeartIcon={isAuthenticated}
                        />
                        {!isFiltering && page < totalPages && (
                          <div className="flex justify-center mt-8">
                            <button
                              onClick={() => fetchProperties(page + 1, false)}
                              disabled={loadingMore}
                              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-deep-teal/40 hover:text-deep-teal transition disabled:opacity-50"
                            >
                              {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                              {loadingMore ? 'Loading…' : 'Load more'}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                ) : (
                  /* Sectioned browse — no active search or filters */
                  <motion.div
                    key="sections"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="lg:pt-2"
                  >
                    {/* Recently Viewed */}
                    {recentlyViewed.length > 0 && (
                      <BrowseSection
                        title="Recently Viewed"
                        icon={<Clock className="w-5 h-5 text-neutral-gray" />}
                        properties={recentlyViewed}
                        totalCount={recentlyViewed.length}
                        showHeartIcon={isAuthenticated}
                        showPetPolicyChip={true}
                        seeAllHref={buildSeeAllUrl('/recently-viewed')}
                      />
                    )}

                    {/* Recommended slot — authenticated only */}
                    {isAuthenticated && recommendedProperties.length > 0 && (
                      <BrowseSection
                        title="Recommended for You"
                        icon={<Heart className="w-5 h-5 fill-accent-orange text-accent-orange" />}
                        properties={recommendedProperties}
                        totalCount={recommendedTotal}
                        showHeartIcon={true}
                        showPetPolicyChip={true}
                        seeAllHref={buildSeeAllUrl('/recommended')}
                      />
                    )}

                    {filteredProperties.length === 0 ? (
                      <EmptyState searchQuery="" hasFilters={false} />
                    ) : (
                      <>
                        {/* Near You */}
                        {nearYou.length > 0 && (
                          <BrowseSection
                            title="Near You"
                            icon={<MapPin className="w-5 h-5 text-accent-orange" />}
                            properties={nearYou}
                            totalCount={nearYou.length}
                            showHeartIcon={isAuthenticated}
                            showPetPolicyChip={true}
                            seeAllHref={buildSeeAllUrl('/near-you')}
                          />
                        )}

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
                          title="Best Value"
                          icon={<Tag className="w-5 h-5 text-positive-green" />}
                          properties={bestValue}
                          totalCount={bestValue.length}
                          showHeartIcon={isAuthenticated}
                          showPetPolicyChip={true}
                          seeAllHref={buildSeeAllUrl('/best-value')}
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

                        {/* Dog-friendly */}
                        {dogFriendly.length > 0 && (
                          <BrowseSection
                            title="Dog-Friendly"
                            icon={<Dog className="w-5 h-5 text-amber-500" />}
                            properties={dogFriendly}
                            totalCount={dogFriendly.length}
                            showHeartIcon={isAuthenticated}
                            showPetPolicyChip={false}
                            seeAllHref={buildSeeAllUrl('/dog-friendly')}
                          />
                        )}

                        {/* Cat-friendly */}
                        {catFriendly.length > 0 && (
                          <BrowseSection
                            title="Cat-Friendly"
                            icon={<Cat className="w-5 h-5 text-purple-400" />}
                            properties={catFriendly}
                            totalCount={catFriendly.length}
                            showHeartIcon={isAuthenticated}
                            showPetPolicyChip={false}
                            seeAllHref={buildSeeAllUrl('/cat-friendly')}
                          />
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )
        })()}
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
