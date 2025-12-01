'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getHostProperties } from '@/lib/api'
import { Property } from '@/types'
import { PropertyList } from '@/app/_components/PropertyList'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'

export default function HostPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHostProperties = async () => {
      try {
        setLoading(true)
        const response = await getHostProperties()
        const sortedProperties = (response.properties || []).sort(
          (a: Property, b: Property) => a.id - b.id
        )
        setProperties(sortedProperties)
        setError(null)
      } catch (err) {
        setError('Failed to fetch properties. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHostProperties()
  }, [])

  return (
    <div className="flex flex-col px-5">
      {/* Scrollable card section */}
      <div className="pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          <ErrorState message={error} />
        ) : properties.length > 0 ? (
          <PropertyList
            properties={properties}
            className="grid grid-cols-2 gap-3 mt-4"
            buildHref={(property) => `/profile/host/${property.id}`}
            showRoomCount={true}
            showStatusIcon={true}
          />
        ) : (
          <div className="text-center mt-20 text-neutral-gray">
            <Image
              src="/graphics/no-host.svg"
              alt="No host listing"
              width={300}
              height={300}
              className="w-full h-auto max-w-sm mx-auto"
            />
            <h2 className="mt-4 text-lg font-semibold">No host listing</h2>
            <p className="mt-1">
              Open your home and heart to new furry friends
            </p>
          </div>
        )}
      </div>

      {/* Add Property Button fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 py-5 px-5 sm:px-10 z-10 max-w-[500px] mx-auto">
        <Link href="/profile/host/add-property">
          <Button className="interact-button w-full">Add Property</Button>
        </Link>
      </div>
    </div>
  )
}
