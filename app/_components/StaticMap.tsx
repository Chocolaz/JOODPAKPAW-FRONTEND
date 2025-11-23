'use client'

import { getStaticMapUrl } from '@/lib/mapUtils'

interface StaticMapProps {
  latitude: number | string
  longitude: number | string
  zoom?: number
}

export function StaticMap({ latitude, longitude, zoom }: StaticMapProps) {
  if (!latitude || !longitude) {
    return null
  }

  const mapUrl = getStaticMapUrl({ latitude, longitude, zoom })
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full"
    >
      <img
        src={mapUrl}
        alt="Map of property location"
        className="w-full h-auto rounded-xl shadow cursor-pointer hover:opacity-90 transition"
      />
    </a>
  )
}
