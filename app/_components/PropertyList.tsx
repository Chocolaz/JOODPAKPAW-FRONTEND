'use client'

import { getProperties } from '@/lib/fetchUtils'
import { PropertiesResponse, Property } from '@/types'
import { useEffect, useState } from 'react'
import { PropertyCard } from './PropertyCard'

export function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = (await getProperties(1, 10)) as PropertiesResponse
        setProperties(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchProperties()
  }, [])

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
