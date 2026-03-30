'use client'

import React, { useState } from 'react'
import { Star, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { submitReview } from '@/lib/api'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ReviewSectionProps {
  bookingId: string
  existingRating?: number | null
  existingComment?: string | null
}

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
const MAX_COMMENT_LENGTH = 500

export default function ReviewSection({
  bookingId,
  existingRating,
  existingComment,
}: ReviewSectionProps) {
  const hasExistingReview = existingRating != null && existingRating > 0

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const activeRating = hoveredRating || rating

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating.')
      return
    }

    setIsSubmitting(true)
    try {
      await submitReview(bookingId, { rating, comment: comment.trim() })
      toast.success('Review submitted successfully!')
      setIsSubmitted(true)
    } catch (error) {
      toast.error('Failed to submit review. Please try again.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasExistingReview || isSubmitted) {
    const displayRating = hasExistingReview ? existingRating : rating
    const displayComment = hasExistingReview
      ? existingComment || ''
      : comment.trim()


    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-14 h-14 rounded-full bg-positive-green/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-positive-green" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">
            {hasExistingReview ? 'Your Review' : 'Thank you for your review!'}
          </h4>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-5 h-5',
                  star <= displayRating
                    ? 'fill-yellow-400 text-yellow-500'
                    : 'text-gray-300'
                )}
              />
            ))}
            <span className="text-sm text-neutral-gray ml-1">
              {RATING_LABELS[displayRating]}
            </span>
          </div>
          {displayComment && (
            <p className="text-sm text-neutral-gray text-center max-w-xs" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
              &quot;{displayComment}&quot;
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-deep-teal uppercase tracking-wide">
          Rate Your Experience
        </h4>
        <p className="text-xs text-neutral-gray">
          How was your stay? Let us know!
        </p>
      </div>

      {/* Star Rating */}
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="group relative p-1 transition-transform hover:scale-110 active:scale-95"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              disabled={isSubmitting}
            >
              <Star
                className={cn(
                  'w-9 h-9 transition-all duration-150',
                  star <= activeRating
                    ? 'fill-yellow-400 text-yellow-500 drop-shadow-sm'
                    : 'text-gray-300 hover:text-accent-orange/40'
                )}
              />
            </button>
          ))}
        </div>
        <div className="h-5">
          {activeRating > 0 && (
            <span
              className={cn(
                'text-sm font-medium transition-all',
                activeRating >= 4
                  ? 'text-positive-green'
                  : activeRating >= 3
                    ? 'text-accent-orange'
                    : 'text-red-500'
              )}
            >
              {RATING_LABELS[activeRating]}
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <Textarea
          placeholder="Share your experience... (optional)"
          value={comment}
          onChange={(e) => {
            if (e.target.value.length <= MAX_COMMENT_LENGTH) {
              setComment(e.target.value)
            }
          }}
          disabled={isSubmitting}
          rows={4}
          className="resize-none border-gray-200 focus-visible:ring-accent-orange"
        />
        <div className="flex justify-end">
          <span
            className={cn(
              'text-xs',
              comment.length >= MAX_COMMENT_LENGTH
                ? 'text-red-500 font-medium'
                : comment.length >= MAX_COMMENT_LENGTH * 0.8
                  ? 'text-accent-orange'
                  : 'text-neutral-gray'
            )}
          >
            {comment.length}/{MAX_COMMENT_LENGTH}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || isSubmitting}
        className="w-full h-11 bg-deep-teal hover:bg-deep-teal/90 text-white font-medium rounded-xl transition-all disabled:opacity-50"
      >
        {isSubmitting ? (
          <Spinner className="size-4 mr-2" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </div>
  )
}
