'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from './_components/PageHeader'
import { PropertyList } from './_components/PropertyList'
import { PropertyCard } from './_components/PropertyCard'
import { SearchBar } from '@/app/_components/SearchBar'
import { FilterPanel, FilterState, defaultFilters } from '@/app/_components/FilterPanel'
import { getProperties } from '@/lib/api'
import { getLowestPrice, cn } from '@/lib/utils'
import { PropertiesResponse, Property } from '@/types'
import { useAuth } from './_components/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchX, Sparkles, Star, Dog, Cat, Banknote } from 'lucide-react'

const SKELETON_COUNT = 12
const SECTION_LIMIT = 8
const TOP_RATED_MIN = 4.0

const QUICK_PET_CHIPS = [
  { label: 'Dog', value: 'dog', Icon: Dog },
  { label: 'Cat', value: 'cat', Icon: Cat },
]
const QUICK_RATING_CHIPS = [
  { label: '4★+', value: 4 },
  { label: '4.5★+', value: 4.5 },
]
const QUICK_PRICE_CHIPS = [
  { label: '฿500', value: 500 },
  { label: '฿1,000', value: 1000 },
  { label: '฿2,000', value: 2000 },
  { label: '฿3,500', value: 3500 },
]

const chipBase = 'flex items-center gap-1.5 shrink-0 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors shadow-sm'
const chipActive = 'bg-accent-orange text-white border-accent-orange'
const chipInactive = 'bg-white border-gray-200 text-neutral-gray hover:border-deep-teal hover:text-deep-teal'

interface PropertySectionProps {
  title: string
  icon?: React.ReactNode
  properties: Property[]
  showHeartIcon?: boolean
  showPetPolicyChip?: boolean
  seeAllHref?: string
}

function PropertySection({
  title,
  icon,
  properties,
  showHeartIcon,
  showPetPolicyChip,
  seeAllHref,
}: PropertySectionProps) {
  if (properties.length === 0) return null
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-10 lg:mb-0 lg:py-10 lg:border-b lg:border-gray-100"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-2">
          {icon}
          <h5 className="text-lg lg:text-2xl xl:text-3xl font-semibold text-deep-teal">{title}</h5>
          <span className="text-sm lg:text-base xl:text-lg text-neutral-gray">({properties.length})</span>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="hidden lg:inline-flex text-sm font-medium text-accent-orange hover:underline"
          >
            See all
          </Link>
        )}
      </div>

      {/* Mobile: horizontal scroll; Desktop: responsive grid */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5 snap-x snap-mandatory lg:mx-0 lg:px-0 lg:overflow-x-visible lg:grid md:grid-cols-3 xl:grid-cols-5 lg:gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="w-44 shrink-0 snap-start lg:w-auto lg:shrink"
          >
            <PropertyCard
              property={property}
              showPetPolicyChip={showPetPolicyChip}
              showHeartIcon={showHeartIcon}
            />
          </div>
        ))}
      </div>
    </motion.section>
  )
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { isAuthenticated } = useAuth()

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

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.petTypes.length > 0) count++
    if (filters.minRating > 0) count++
    if (filters.maxPrice !== '') count++
    return count
  }, [filters])

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
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, SECTION_LIMIT),
    [filteredProperties]
  )

  const newListings = useMemo(
    () =>
      [...filteredProperties]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, SECTION_LIMIT),
    [filteredProperties]
  )

  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col">
      {/* Hero: search + header */}
      <div className="px-5 lg:px-12 lg:border-b lg:border-gray-100 lg:bg-gradient-to-br lg:from-white lg:to-off-white/40">
        <SearchBar
          onSearch={setSearchQuery}
          value={searchQuery}
          onFilterClick={() => setIsFilterOpen(true)}
          activeFilterCount={activeFilterCount}
        />
        <PageHeader />
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onApply={setFilters}
      />

      {/* Quick filter chip strip */}
      <div className="bg-white border-b border-gray-100">
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3 px-5 lg:px-12 lg:flex-wrap">
            {QUICK_PET_CHIPS.map(({ label, value, Icon }) => {
              const active = filters.petTypes.includes(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilters((f) => ({
                    ...f,
                    petTypes: active ? f.petTypes.filter((p) => p !== value) : [...f.petTypes, value],
                  }))}
                  className={cn(chipBase, active ? chipActive : chipInactive)}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              )
            })}

            <span className="shrink-0 self-center w-px h-4 bg-gray-200 mx-0.5" />

            {QUICK_RATING_CHIPS.map(({ label, value }) => {
              const active = filters.minRating === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, minRating: active ? 0 : value }))}
                  className={cn(chipBase, active ? chipActive : chipInactive)}
                >
                  <Star className="w-3.5 h-3.5" />
                  {label}
                </button>
              )
            })}

            <span className="shrink-0 self-center w-px h-4 bg-gray-200 mx-0.5" />

            {QUICK_PRICE_CHIPS.map(({ label, value }) => {
              const active = filters.maxPrice === String(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, maxPrice: active ? '' : String(value) }))}
                  className={cn(chipBase, active ? chipActive : chipInactive)}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  {label}
                </button>
              )
            })}
          </div>

          {/* Right-edge fade for mobile scroll */}
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none lg:hidden" />
        </div>
      </div>

      <main className="flex-1 px-5 lg:px-12 mt-6 lg:mt-0 pb-28 lg:pb-16">
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
                  {filteredProperties.length} {filteredProperties.length === 1 ? 'place' : 'places'}
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
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 lg:pt-10"
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
          ) : filteredProperties.length === 0 ? (
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
                  {searchQuery || activeFilterCount > 0
                    ? 'Try adjusting your search or filters.'
                    : 'No properties available right now.'}
                </p>
              </motion.div>
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
              <PropertyList
                properties={filteredProperties}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6"
                showPetPolicyChip={true}
                showHeartIcon={isAuthenticated}
              />
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
              <PropertySection
                title="Top Rated"
                icon={<Star className="w-5 h-5 fill-yellow-400 text-yellow-500" />}
                properties={topRated}
                showHeartIcon={isAuthenticated}
                showPetPolicyChip={true}
                seeAllHref="/"
              />
              <PropertySection
                title="New Listings"
                icon={<Sparkles className="w-5 h-5 text-deep-teal" />}
                properties={newListings}
                showHeartIcon={isAuthenticated}
                showPetPolicyChip={true}
                seeAllHref="/"
              />

              {/* All Properties */}
              <section className="mb-8 lg:py-10">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <div className="flex items-center gap-2">
                    <h5 className="text-lg lg:text-2xl xl:text-3xl font-semibold text-deep-teal">
                      All Properties
                    </h5>
                    <span className="text-sm lg:text-base xl:text-lg text-neutral-gray">
                      ({filteredProperties.length} {filteredProperties.length === 1 ? 'place' : 'places'})
                    </span>
                  </div>
                </div>
                <PropertyList
                  properties={filteredProperties}
                  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6"
                  showPetPolicyChip={true}
                  showHeartIcon={isAuthenticated}
                />
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
