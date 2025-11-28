'use client'

import { useMemo } from 'react'
import { Property } from '@/types'
import dynamic from 'next/dynamic'

interface PropertyLocationProps {
  property: Pick<Property, 'latitude' | 'longitude' | 'district' | 'province'>
}

export function PropertyLocation({ property }: PropertyLocationProps) {
  if (!property.latitude || !property.longitude) {
    return null
  }

  const lat = Number(property.latitude)
  const lng = Number(property.longitude)

  const Map = useMemo(
    () =>
      dynamic(() => import('@/app/_components/Map'), {
        ssr: false,
      }),
    []
  )

  return (
    <div className="mt-10 border-t pt-8">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-deep-teal ">Location</h3>
        <p className="text-neutral-gray">
          {property.district}, {property.province}
        </p>
      </div>
      <div className="w-full aspect-square relative">
        <Map lat={lat} lng={lng} />
      </div>
    </div>
  )
}
