'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HostReview } from '@/types/hostProfile'

const CLAMP_THRESHOLD = 200

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr.replace(' ', 'T')).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function HostReviewCard({ review, onReport }: { review: HostReview; onReport?: (id: number) => void }) {
  const { guestProfile } = review
  const guestName = `${guestProfile.firstName} ${guestProfile.lastName}`
  const isLong = !!review.comment && review.comment.length > CLAMP_THRESHOLD
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-3 hover:shadow-md hover:border-gray-200 transition-all duration-200">
      {/* Guest info + date */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
            {guestProfile.avatar ? (
              <Image src={guestProfile.avatar} alt={guestName} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-deep-teal/10 text-deep-teal text-xs font-semibold">
                {guestProfile.firstName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-sm font-medium text-gray-800 truncate">{guestName}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-neutral-gray">{formatDate(review.reviewedAt)}</span>
          {onReport && (
            <button
              onClick={() => onReport(review.id)}
              className="p-1 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition cursor-pointer"
              title="Report this review"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              'w-3.5 h-3.5',
              s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
            )}
            strokeWidth={0}
          />
        ))}
      </div>

      {/* Comment */}
      {review.comment ? (
        <div className="flex-1">
          <p className={cn('text-sm text-gray-600 leading-relaxed', !expanded && 'line-clamp-4')}>
            &ldquo;{review.comment}&rdquo;
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-medium text-accent-orange hover:underline underline-offset-2 transition-colors cursor-pointer"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-300 italic flex-1">No comment left.</p>
      )}

      {/* Property tag */}
      <div className="pt-2.5 border-t border-gray-50">
        <span className="inline-flex items-center gap-1.5 text-xs text-deep-teal/80 bg-deep-teal/5 rounded-full px-2.5 py-1 max-w-full">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-orange shrink-0" />
          <span className="truncate">{review.propertyName}</span>
        </span>
      </div>
    </div>
  )
}
