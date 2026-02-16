'use client'

import { Star } from 'lucide-react'
import { Property } from '@/types'

interface PropertyHeaderProps {
  property: Pick<
    Property,
    'title' | 'district' | 'province' | 'country' | 'avgRating' | 'reviewCount'
  >
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  return (
    <div className="mb-6 text-deep-teal">
      <h2 className="text-deep-teal">{property.title}</h2>
      <div className="flex justify-between items-center">
        <p>
          {property.district}, {property.province}
        </p>
        <p className="flex items-center gap-1">
          <Star
            className={`w-5 h-5 ${property.avgRating > 0 ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            strokeWidth={0}
          />
          <span>
            {property.avgRating > 0
              ? `${property.avgRating.toFixed(1)} (${property.reviewCount})`
              : 'New'}
          </span>
        </p>
      </div>
      <p>{property.country}</p>
    </div>
  )
}
