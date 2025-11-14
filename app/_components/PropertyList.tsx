'use client'

import { Property } from '@/types'
import { PropertyCard } from './PropertyCard'

interface PropertyListProps {
  properties: Property[]
}

export function PropertyList({ properties }: PropertyListProps) {
  return (
    <main className="mt-5">
      <h5 className="text-xl font-medium text-deep-teal mb-4 px-5">
        Properties
      </h5>
      <div className="flex flex-nowrap overflow-x-auto mt-4 pb-2 hide-scrollbar pl-5">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </main>
  )
}
