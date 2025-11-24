'use client'

import { Property } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface PropertyCardProps {
  property: Property
  href?: string
  className?: string
}

export function PropertyCard({ property, href, className }: PropertyCardProps) {
  const [imgSrc, setImgSrc] = useState(
    property.images.length > 0 && API_BASE_URL
      ? new URL(property.images[0].filePath, API_BASE_URL).toString()
      : '/graphics/welcome.svg'
  )

  const finalHref = href || `/${property.id}`

  return (
    <Link href={finalHref} className={cn('block', className)}>
      {/* Image Box — Square Responsive */}
      <div className="w-full aspect-square relative">
        <Image
          src={imgSrc}
          alt={property.title}
          fill
          unoptimized
          className="object-cover rounded-[14px] shadow-md"
          onError={() => setImgSrc('/graphics/welcome.svg')}
        />
      </div>

      {/* Content */}
      <div className="mt-2">
        <p className="text-sm font-medium text-deep-teal truncate">
          {property.title}
        </p>

        <p className="text-xs text-gray-500 truncate">
          {property.province}, {property.district}
        </p>

        {property.roomCategory && (
          <p className="font-bold text-[10px]">
            THB {property.roomCategory.basePrice}
          </p>
        )}

        {!property.isActive && (
          <span className="inline-block mt-1 px-1 py-0.5 text-[8px] bg-red-100 text-red-600 rounded-full">
            Inactive
          </span>
        )}
      </div>
    </Link>
  )
}
