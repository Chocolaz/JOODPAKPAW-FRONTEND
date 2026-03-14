'use client'

import Image from 'next/image'
import { Star, UserCircle, CalendarDays, Building2, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HostProfile } from '@/types/hostProfile'
import { ContactHostButton } from '@/app/_components/property-detail/ContactHostButton'

function formatMemberSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function HostProfileHero({ host }: { host: HostProfile }) {
  const hasRating = host.avgRating > 0

  return (
    <div className="px-5 lg:px-12 pt-16 pb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-10">
        {/* Avatar */}
        <div className="relative w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gray-100 ring-2 ring-deep-teal/20 shadow-sm shrink-0 mx-auto lg:mx-0">
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
        <div className="flex-1 mt-4 lg:mt-0 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-semibold text-deep-teal">
            {host.firstName} {host.lastName}
          </h1>

          <div className="flex items-center justify-center lg:justify-start gap-1.5 mt-1 text-sm text-neutral-gray">
            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
            <span>Member since {formatMemberSince(host.createdAt)}</span>
          </div>

          {/* Stats pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-4">
            {/* Rating pill */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      'w-3.5 h-3.5',
                      hasRating && s <= Math.round(host.avgRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    )}
                    strokeWidth={0}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {hasRating ? host.avgRating.toFixed(1) : 'New'}
              </span>
              <span className="text-xs text-neutral-gray">
                · {host.reviewCount} {host.reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {/* Properties pill */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm">
              <Building2 className="w-3.5 h-3.5 text-deep-teal" />
              <span className="text-sm font-medium text-gray-700">{host.totalProperties}</span>
              <span className="text-xs text-neutral-gray">
                {host.totalProperties === 1 ? 'property' : 'properties'}
              </span>
            </div>
          </div>

          {/* Message button */}
          <div className="mt-4 lg:max-w-xs">
            <ContactHostButton hostId={host.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
