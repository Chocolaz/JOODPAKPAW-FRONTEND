'use client'

import { Property } from '@/types'
import { PropertyCard } from './PropertyCard'

interface PropertyListProps {
  properties: Property[]
  className?: string
  buildHref?: (property: Property) => string
  showRoomCount?: boolean
}

export function PropertyList({
  properties,
  className = 'grid grid-cols-2 gap-4 px-5',
  buildHref,
  showRoomCount,
}: PropertyListProps) {
  return (
    <div className={className}>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          href={buildHref ? buildHref(property) : undefined}
          showRoomCount={showRoomCount}
        />
      ))}
    </div>
  )
}
