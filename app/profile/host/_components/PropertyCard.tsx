'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Property } from '@/types'
import { Star } from 'lucide-react'

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imagePath = property.images?.[0]?.filePath
  let mainImage = '/graphics/no-image.svg'

  if (imagePath) {
    let url = imagePath
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // It's already a full URL. Leave it as is, but clean up slashes.
      mainImage = url
    } else {
      // It's some other format. Strip any leading slashes or partial protocols.
      url = url.replace(/^(https?:)?\/*/, '')
      mainImage = `http://${url}`
    }
    // Finally, fix double slashes in the path part, but not the protocol.
    mainImage = mainImage.replace(/(?<!:)\/\//g, '/')
  }

  return (
    <Link href={`/profile/host/${property.id}`}>
      <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="w-full h-40 sm:h-48 relative">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            unoptimized={true}
            className="object-cover"
          />
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="text-sm sm:text-lg font-semibold">{property.title}</h3>
          <p className="text-neutral-gray text-xs sm:text-sm">
            {property.district}, {property.province}
          </p>
          <div className="flex items-center mt-1 sm:mt-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-1" />
            <span className="text-xs sm:text-sm">
              {property.avgRating?.toFixed(1) || 0}
            </span>
          </div>
          {!property.isActive && (
            <span className="inline-block mt-1 sm:mt-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
              Inactive
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
