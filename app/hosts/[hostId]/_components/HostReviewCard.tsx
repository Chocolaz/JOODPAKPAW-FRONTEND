'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Flag, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HostReview } from '@/types/hostProfile'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const CLAMP_LINES = 4

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr.replace(' ', 'T')).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 shrink-0">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={cn('w-3 h-3', s <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200')} strokeWidth={0} />
      ))}
    </div>
  )
}

export function HostReviewCard({ review, onReport }: { review: HostReview; onReport?: (id: number) => void }) {
  const { guestProfile } = review
  const guestName = `${guestProfile.firstName} ${guestProfile.lastName}`
  const [modalOpen, setModalOpen] = useState(false)

  // Estimate if comment exceeds 4 lines (~80 chars/line)
  const isLong = !!review.comment && review.comment.length > 80 * CLAMP_LINES

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex gap-3 hover:shadow-md hover:border-gray-200 transition-all duration-200">
        {/* Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 mt-0.5">
          {guestProfile.avatar ? (
            <Image src={guestProfile.avatar} alt={guestName} fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-deep-teal/10 text-deep-teal text-sm font-semibold">
              {guestProfile.firstName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Row 1: name + stars + date + report */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 shrink-0">{guestName}</span>
            <StarRow rating={review.rating} />
            <span className="text-xs text-neutral-gray shrink-0">{formatDate(review.reviewedAt)}</span>
            <div className="flex-1" />
            {onReport && (
              <button
                onClick={() => onReport(review.id)}
                className="p-1 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 transition cursor-pointer shrink-0"
                title="Report this review"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Comment — min-h matches 4 lines of text-sm/leading-relaxed */}
          <div className="min-h-[5.75rem] pr-2">
            {review.comment ? (
              <>
                <p className="text-sm text-gray-600 leading-relaxed break-words line-clamp-4">
                  {review.comment}
                </p>
                {isLong && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-1 text-xs font-medium text-accent-orange hover:underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    See more
                  </button>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-300 italic">No comment left.</p>
            )}
          </div>

          {/* Property tag */}
          <div className="flex items-center gap-1.5 text-xs text-deep-teal/80">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-orange shrink-0" />
            <span className="truncate">{review.propertyName}</span>
          </div>
        </div>
      </div>

      {/* Full review modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md gap-0 p-0 overflow-hidden [&>button]:hidden">
          <DialogHeader className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                  {guestProfile.avatar ? (
                    <Image src={guestProfile.avatar} alt={guestName} fill className="object-cover" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-deep-teal/10 text-deep-teal text-sm font-semibold">
                      {guestProfile.firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-sm font-semibold text-gray-900 truncate">{guestName}</DialogTitle>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StarRow rating={review.rating} />
                    <span className="text-xs text-neutral-gray">{formatDate(review.reviewedAt)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </DialogHeader>
          <div className="px-5 py-4 space-y-3">
            <p className="text-sm text-gray-700 leading-relaxed" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{review.comment}</p>
            <div className="flex items-center gap-1.5 text-xs text-deep-teal/80 pt-2 border-t border-gray-100">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-orange shrink-0" />
              <span className="truncate">{review.propertyName}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
