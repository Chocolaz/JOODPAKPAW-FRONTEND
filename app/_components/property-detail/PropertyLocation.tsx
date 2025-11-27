'use client'

import Image from 'next/image'
import { Property } from '@/types'
import { getStaticMapUrl } from '@/lib/mapUtils'

interface PropertyLocationProps {
  property: Pick<Property, 'latitude' | 'longitude' | 'district' | 'province'>
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  if (!property.latitude || !property.longitude) {
    return null
  }

  const mapUrl = getStaticMapUrl({
    latitude: property.latitude,
    longitude: property.longitude,
  })
  const googleMapsUrl = `https://www.google.com/maps?q=${property.latitude},${property.longitude}`

  return (
    <div className="mt-10 border-t pt-8">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-deep-teal ">Location</h3>
        <p className="text-neutral-gray">
          {property.district}, {property.province}
        </p>
      </div>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-[200px] relative"
      >
        <Image
          src={mapUrl}
          alt="Map of property location"
          fill
          unoptimized
          className="object-cover rounded-xl shadow cursor-pointer hover:opacity-90 transition"
        />
      </a>
    </div>
  )
}