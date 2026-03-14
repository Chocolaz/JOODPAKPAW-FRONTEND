import { Star, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HostReview } from '@/types/hostProfile'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function HostReviewCard({ review }: { review: HostReview }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col gap-3 hover:shadow-md hover:border-gray-200 transition-all duration-200">
      {/* Top row — stars + property chip + date */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex gap-0.5 shrink-0">
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
          <div className="flex items-center gap-1 bg-off-white rounded-full px-2 py-0.5 border border-gray-100 min-w-0">
            <MapPin className="w-3 h-3 text-accent-orange shrink-0" />
            <span className="text-xs text-deep-teal font-medium truncate">{review.propertyName}</span>
          </div>
        </div>
        <span className="text-xs text-neutral-gray shrink-0">{formatDate(review.reviewedAt)}</span>
      </div>

      {/* Comment */}
      {review.comment ? (
        <p className="text-sm text-gray-600 leading-relaxed">"{review.comment}"</p>
      ) : (
        <p className="text-sm text-gray-300 italic">No comment left.</p>
      )}
    </div>
  )
}
