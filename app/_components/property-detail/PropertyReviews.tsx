'use client'

import { useState, useMemo } from 'react'
import { Star, UserCircle } from 'lucide-react'
import { PropertyReview } from '@/types/property'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PropertyReviewsProps {
  avgRating: number
  reviewCount: number
  reviews?: PropertyReview[]
}

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
const MAX_VISIBLE_REVIEWS = 3

function StarRow({
  rating,
  size = 'sm',
}: {
  rating: number
  size?: 'sm' | 'md'
}) {
  const starSize = size === 'md' ? 'w-5 h-5' : 'w-3.5 h-3.5'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            starSize,
            star <= rating ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  )
}

function RatingBreakdown({ reviews }: { reviews: PropertyReview[] }) {
  const total = reviews.length
  const counts = [0, 0, 0, 0, 0]
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++
  })

  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = counts[star - 1]
        const percentage = total > 0 ? (count / total) * 100 : 0
        return (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-3 text-right text-gray-500 font-medium">
              {star}
            </span>
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />
            <div className="flex-1 h-2 bg-white border border-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-5 text-right text-gray-400">{count}</span>
          </div>
        )
      })}
    </div>
  )
}

function ReviewCard({ review }: { review: PropertyReview }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
          {review.avatar ? (
            <Image
              src={review.avatar}
              alt={`${review.firstName} ${review.lastName}`}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <UserCircle className="w-10 h-10 text-gray-300" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {review.firstName} {review.lastName}
          </p>
          <StarRow rating={review.rating} />
        </div>
      </div>

      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  )
}

export function PropertyReviews({
  avgRating,
  reviewCount,
  reviews = [],
}: PropertyReviewsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const topReviews = useMemo(
    () =>
      [...reviews]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, MAX_VISIBLE_REVIEWS),
    [reviews]
  )

  const hasMore = reviewCount > MAX_VISIBLE_REVIEWS

  return (
    <div className="mt-10 border-t pt-8">
      <h3 className="text-xl font-semibold text-deep-teal mb-6">Reviews</h3>

      {/* Summary card */}
      <div className="bg-off-white/80 rounded-2xl p-5 mb-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-bold text-gray-900">
              {avgRating > 0 ? avgRating.toFixed(1) : '-'}
            </span>
            <StarRow rating={Math.round(avgRating)} size="md" />
            <span className="text-xs text-neutral-gray mt-0.5">
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </span>
            {avgRating > 0 && (
              <span className="text-xs font-medium text-deep-teal">
                {RATING_LABELS[Math.round(avgRating)] || ''}
              </span>
            )}
          </div>

          {reviews.length > 0 && (
            <div className="flex-1">
              <RatingBreakdown reviews={reviews} />
            </div>
          )}
        </div>
      </div>

      {/* Top 3 reviews */}
      {topReviews.length > 0 ? (
        <div className="space-y-3">
          {topReviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-gray text-center py-6">
          No reviews yet. Be the first to review!
        </p>
      )}

      {/* Show all reviews button */}
      {hasMore && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 w-full text-center text-sm font-medium text-deep-teal underline underline-offset-2 hover:text-deep-teal/80 transition-colors py-2"
        >
          {reviewCount}+ reviews
        </button>
      )}

      {/* All reviews modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-deep-teal">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-500" />
              {avgRating.toFixed(1)} - {reviewCount}{' '}
              {reviewCount === 1 ? 'review' : 'reviews'}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto space-y-3 pr-1 -mr-1">
            {[...reviews]
              .sort((a, b) => b.rating - a.rating)
              .map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
