import Link from 'next/link'
import { motion } from 'framer-motion'
import { PropertyCard } from '@/app/_components/PropertyCard'
import { Property } from '@/types'

const SECTION_LIMIT = 6

interface BrowseSectionProps {
  title: string
  icon?: React.ReactNode
  properties: Property[]
  totalCount?: number
  showHeartIcon?: boolean
  showPetPolicyChip?: boolean
  seeAllHref?: string
}

export function BrowseSection({
  title,
  icon,
  properties,
  totalCount,
  showHeartIcon,
  showPetPolicyChip,
  seeAllHref,
}: BrowseSectionProps) {
  if (properties.length === 0) return null
  const count = totalCount ?? properties.length
  const showSeeAll = seeAllHref && count > SECTION_LIMIT

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
          <span className="text-sm lg:text-base xl:text-lg text-neutral-gray">({count})</span>
        </div>
        {showSeeAll && (
          <Link
            href={seeAllHref}
            className="text-sm font-medium text-accent-orange hover:underline shrink-0"
          >
            See all
          </Link>
        )}
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      {/* pr-10 on mobile clips the last card slightly — signals more content off-screen */}
      {/* Note: properties prop is the full array; BrowseSection slices at SECTION_LIMIT internally */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-5 px-5 pr-10 snap-x snap-mandatory lg:mx-0 lg:px-0 lg:pr-0 lg:overflow-x-visible lg:grid lg:grid-cols-6 lg:gap-4">
        {properties.slice(0, SECTION_LIMIT).map((property) => (
          <div key={property.id} className="w-44 shrink-0 snap-start lg:w-auto lg:shrink">
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
