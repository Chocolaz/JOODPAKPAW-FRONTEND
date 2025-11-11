'use client'

import { Property } from '@/types'
import { PropertyCard } from './PropertyCard'

interface PropertyListProps {
  properties: Property[]
}

export function PropertyList({ properties }: PropertyListProps) {
  return (
    <main className="mt-5">
      <h5 className="text-xl font-medium text-deep-teal mb-4">Properties</h5>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </main>
  )
}
