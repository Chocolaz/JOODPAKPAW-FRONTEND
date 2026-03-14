'use client'

import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { HostReview } from '@/types/hostProfile'
import { HostReviewCard } from './HostReviewCard'
import { Skeleton } from '@/components/ui/skeleton'

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

interface HostReviewsSectionProps {
  reviews: HostReview[]
  page: number
  totalPages: number
  totalRows: number
  avgRating: number
  reviewCount: number
  loading: boolean
  onPageChange: (page: number) => void
}

export function HostReviewsSection({
  reviews,
  page,
  totalPages,
  totalRows,
  avgRating,
  reviewCount,
  loading,
  onPageChange,
}: HostReviewsSectionProps) {
  return (
    <section className="px-5 lg:px-12 mt-2 border-t pt-8 lg:pt-10 pb-8">
      <h2 className="text-lg lg:text-xl font-semibold text-deep-teal mb-5">Reviews</h2>

      {/* Summary card */}
      <div className="bg-off-white/80 rounded-2xl p-5 mb-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-6">
          {/* Score */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <span className="text-5xl font-bold text-gray-900">
              {avgRating > 0 ? avgRating.toFixed(1) : '-'}
            </span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    'w-4 h-4',
                    s <= Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
                  )}
                  strokeWidth={0}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-gray mt-0.5">
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </span>
            {avgRating > 0 && (
              <span className="text-xs font-semibold text-deep-teal">
                {RATING_LABELS[Math.round(avgRating)] || ''}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="w-px self-stretch bg-gray-200 shrink-0" />

          {/* Bar breakdown */}
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-right text-gray-500 font-medium">{star}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 shrink-0" strokeWidth={0} />
                  <div className="flex-1 h-2 bg-white border border-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-4 text-right text-gray-400">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Review list */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-3"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </motion.div>
        ) : reviews.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center gap-2 py-8 text-center"
          >
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-gray-200 text-gray-200" strokeWidth={0} />
              ))}
            </div>
            <p className="font-medium text-gray-700">No reviews yet</p>
            <p className="text-sm text-neutral-gray">Be the first to stay and leave a review.</p>
          </motion.div>
        ) : (
          <motion.div
            key={`page-${page}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-3"
          >
            {reviews.map((review) => (
              <HostReviewCard key={review.id} review={review} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-neutral-gray hover:border-deep-teal hover:text-deep-teal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'w-8 h-8 rounded-full text-sm font-medium transition-colors',
                p === page
                  ? 'bg-deep-teal text-white'
                  : 'border border-gray-200 text-neutral-gray hover:border-deep-teal hover:text-deep-teal'
              )}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-neutral-gray hover:border-deep-teal hover:text-deep-teal disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  )
}
