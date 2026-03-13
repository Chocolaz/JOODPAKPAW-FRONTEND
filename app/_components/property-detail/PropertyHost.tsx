'use client'

import Image from 'next/image'
import { Star, UserCircle } from 'lucide-react'
import { PropertyHost as PropertyHostType } from '@/types/property'
import { ContactHostButton } from './ContactHostButton'

interface PropertyHostProps {
  host: PropertyHostType
}

export function PropertyHost({ host }: PropertyHostProps) {
  return (
    <div className="border-t pt-8 mb-10">
      <h3 className="text-lg lg:text-xl font-semibold text-deep-teal mb-5">
        Meet your host
      </h3>

      <div className="flex items-center gap-4 bg-off-white/60 rounded-2xl p-5 border border-gray-100 shadow-sm">
        {/* Avatar */}
        <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden bg-gray-100 shrink-0 ring-2 ring-deep-teal/20 shadow-sm">
          {host.avatar ? (
            <Image
              src={host.avatar}
              alt={`${host.firstName} ${host.lastName}`}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <UserCircle className="w-full h-full text-gray-300" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-deep-teal text-base lg:text-lg truncate">
            {host.firstName} {host.lastName}
          </p>
          {host.hostAvgRating > 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              <Star
                className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                strokeWidth={0}
              />
              <span className="text-sm font-medium text-gray-700">
                {host.hostAvgRating.toFixed(1)}
              </span>
              <span className="text-xs text-neutral-gray">host rating</span>
            </div>
          )}
        </div>

        {/* Message button */}
        <ContactHostButton hostId={host.id} compact />
      </div>
    </div>
  )
}
