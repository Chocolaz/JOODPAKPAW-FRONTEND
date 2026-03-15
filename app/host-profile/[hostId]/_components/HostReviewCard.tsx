import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HostReview } from '@/types/hostProfile'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function HostReviewCard({ review }: { review: HostReview }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-3 hover:shadow-md hover:border-gray-200 transition-all duration-200">
      {/* Stars + date */}
      <div className="flex items-center justify-between">
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
        <span className="text-xs text-neutral-gray">{formatDate(review.reviewedAt)}</span>
      </div>

      {/* Comment */}
      {review.comment ? (
        <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-4">
          &ldquo;{review.comment}&rdquo;
        </p>
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
