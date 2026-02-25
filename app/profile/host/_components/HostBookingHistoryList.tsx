'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getHostBookings } from '@/lib/api'
import { Booking, BookingsResponse } from '@/types/booking'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { useRouter } from 'next/navigation'
import { parseISO } from 'date-fns'
import { BookingCard } from '@/app/profile/bookings/_components/BookingCard'
import { cn } from '@/lib/utils'
import { History } from 'lucide-react'

const HISTORY_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'SUCCESSFUL', label: 'Completed', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-300' },
] as const

export function HostBookingHistoryList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const router = useRouter()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response: BookingsResponse = await getHostBookings()
        setBookings(response.bookings)
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch host bookings'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const historyBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const status = booking.bookingStatus.toUpperCase()
      return status === 'SUCCESSFUL' || status === 'CANCELLED'
    })
  }, [bookings])

  const filteredBookings = useMemo(() => {
    const statusOrder = ['SUCCESSFUL', 'CANCELLED']

    return historyBookings
      .filter((booking) => {
        const status = booking.bookingStatus.toUpperCase()
        return statusFilter === 'ALL' || status === statusFilter
      })
      .sort((a, b) => {
        const statusA = a.bookingStatus.toUpperCase()
        const statusB = b.bookingStatus.toUpperCase()

        const orderA = statusOrder.indexOf(statusA)
        const orderB = statusOrder.indexOf(statusB)

        if (orderA !== -1 && orderB !== -1 && orderA !== orderB) {
          return orderA - orderB
        }
        return (
          new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
        )
      })
  }, [historyBookings, statusFilter])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: 0 }
    historyBookings.forEach((booking) => {
      const status = booking.bookingStatus.toUpperCase()
      counts.ALL = (counts.ALL || 0) + 1
      counts[status] = (counts[status] || 0) + 1
    })
    return counts
  }, [historyBookings])

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >
          {/* Skeleton filter chips */}
          <div className="flex gap-2 px-3 sm:px-4 py-2.5 border-b border-gray-100">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 rounded-full bg-gray-200" style={{ width: `${56 + i * 20}px` }} />
              </div>
            ))}
          </div>
          {/* Skeleton booking cards */}
          <div className="p-3 sm:p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-gray-100 p-4 sm:p-5 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded-full w-16" />
                </div>
                <div className="flex gap-3">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-3 bg-gray-200 rounded w-14" />
                </div>
                <div className="grid grid-cols-2 gap-3 bg-gray-100 rounded-lg p-3">
                  <div className="space-y-1.5">
                    <div className="h-2.5 bg-gray-200 rounded w-12" />
                    <div className="h-3.5 bg-gray-200 rounded w-20" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2.5 bg-gray-200 rounded w-14" />
                    <div className="h-3.5 bg-gray-200 rounded w-20" />
                  </div>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-5 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col h-full"
        >
          {/* Filter chips */}
          <div className="flex gap-2 px-3 sm:px-4 py-2.5 overflow-x-auto hide-scrollbar border-b border-gray-100">
            {HISTORY_FILTERS.map((filter) => {
              const count = statusCounts[filter.value] || 0
              const isActive = statusFilter === filter.value

              return (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border whitespace-nowrap transition-all duration-200',
                    isActive
                      ? filter.value === 'ALL'
                        ? 'bg-deep-teal text-white border-deep-teal'
                        : filter.color
                      : 'bg-white text-gray-500 border-gray-200'
                  )}
                >
                  {filter.label}
                  {count > 0 && (
                    <span
                      className={cn(
                        'text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5',
                        isActive
                          ? filter.value === 'ALL'
                            ? 'bg-white/20'
                            : 'bg-black/10'
                          : 'bg-gray-100'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="grow overflow-y-auto p-3 sm:p-4 md:p-6">
            {filteredBookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {filteredBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onClick={(id) => router.push(`/profile/host/booking/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                <History className="w-12 h-12 text-gray-300 mb-3" />
                <h4 className="text-base font-semibold text-gray-600">
                  No history yet
                </h4>
                <p className="text-sm text-gray-400 mt-1 max-w-[240px]">
                  Completed and cancelled bookings will appear here.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
