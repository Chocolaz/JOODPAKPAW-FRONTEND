'use client'

import { Property } from '@/types'
import { PropertyCard } from './PropertyCard'

interface PropertyListProps {
  properties: Property[]
  className?: string
  buildHref?: (property: Property) => string
  showRoomCount?: boolean
  showStatusIcon?: boolean
  showPetPolicyChip?: boolean
}

export function PropertyList({
  properties,
  className = 'grid grid-cols-2 gap-4 px-5',
  buildHref,
  showRoomCount,
  showStatusIcon,
  showPetPolicyChip,
}: PropertyListProps) {
  return (
    <div className={className}>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          href={buildHref ? buildHref(property) : undefined}
          showRoomCount={showRoomCount}
          showStatusIcon={showStatusIcon}
          showPetPolicyChip={showPetPolicyChip}
        />
      ))}
    </div>
  )
}
