export function NotificationSkeleton() {
  return (
    <div className="space-y-4 pt-3">
      {[0, 1].map((g) => (
        <div key={g}>
          <div className="px-4 py-1.5 h-4 w-16 bg-gray-200 rounded animate-pulse mx-4 mb-2" />
          <div className="bg-white rounded-2xl mx-4 overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-100">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3.5 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
