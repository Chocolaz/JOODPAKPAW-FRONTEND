'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBookings } from '@/lib/api'
import { Booking, BookingsResponse } from '@/types/booking'
import { BookingCard } from './BookingCard'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { CalendarCheck, History, CalendarX2, AlertCircle } from 'lucide-react'

const UPCOMING_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'PENDING', label: 'Pending', color: 'bg-blue-100 text-blue-700 border-blue-300' },
] as const

const PAST_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'SUCCESSFUL', label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-300' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-300' },
] as const

function BookingCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 p-4 sm:p-5 space-y-3">
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
  )
}

function FilterChips({
  filters,
  activeFilter,
  counts,
  onFilterChange,
}: {
  filters: readonly { value: string; label: string; color?: string }[]
  activeFilter: string
  counts: Record<string, number>
  onFilterChange: (value: string) => void
}) {
  return (
    <div className="flex gap-2 px-3 sm:px-4 py-2.5 overflow-x-auto hide-scrollbar">
      {filters.map((filter) => {
        const count = counts[filter.value] || 0
        const isActive = activeFilter === filter.value

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
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
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <Icon className="w-12 h-12 text-gray-300 mb-3" />
      <h4 className="text-base font-semibold text-gray-600">{title}</h4>
      <p className="text-sm text-gray-400 mt-1 max-w-[260px]">{description}</p>
    </div>
  )
}

export function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upcomingFilter, setUpcomingFilter] = useState('ALL')
  const [pastFilter, setPastFilter] = useState('ALL')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response: BookingsResponse = await getBookings()
        setBookings(response.bookings)
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch bookings'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  // Split bookings into upcoming and past
  const upcomingBookings = useMemo(() => {
    return bookings.filter((b) => {
      const status = b.bookingStatus.toUpperCase()
      return status === 'CONFIRMED' || status === 'PENDING'
    })
  }, [bookings])

  const pastBookings = useMemo(() => {
    return bookings.filter((b) => {
      const status = b.bookingStatus.toUpperCase()
      return status === 'SUCCESSFUL' || status === 'CANCELLED'
    })
  }, [bookings])

  // Counts
  const upcomingCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: upcomingBookings.length }
    upcomingBookings.forEach((b) => {
      const status = b.bookingStatus.toUpperCase()
      counts[status] = (counts[status] || 0) + 1
    })
    return counts
  }, [upcomingBookings])

  const pastCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: pastBookings.length }
    pastBookings.forEach((b) => {
      const status = b.bookingStatus.toUpperCase()
      counts[status] = (counts[status] || 0) + 1
    })
    return counts
  }, [pastBookings])

  // Filtered & sorted
  const filteredUpcoming = useMemo(() => {
    return upcomingBookings
      .filter((b) => {
        const status = b.bookingStatus.toUpperCase()
        return upcomingFilter === 'ALL' || status === upcomingFilter
      })
      .sort((a, b) => {
        // Pending first, then confirmed
        const statusOrder = ['PENDING', 'CONFIRMED']
        const orderA = statusOrder.indexOf(a.bookingStatus.toUpperCase())
        const orderB = statusOrder.indexOf(b.bookingStatus.toUpperCase())
        if (orderA !== orderB) return orderA - orderB
        // Soonest check-in first
        return new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
      })
  }, [upcomingBookings, upcomingFilter])

  const filteredPast = useMemo(() => {
    return pastBookings
      .filter((b) => {
        const status = b.bookingStatus.toUpperCase()
        return pastFilter === 'ALL' || status === pastFilter
      })
      .sort((a, b) => {
        // Most recent first
        return new Date(b.checkOutDate).getTime() - new Date(a.checkOutDate).getTime()
      })
  }, [pastBookings, pastFilter])

  const pendingCount = upcomingCounts.PENDING || 0

  if (error) {
    return <ErrorState message={error} />
  }

  // Default tab: show upcoming if there are any, otherwise past
  const defaultTab = upcomingBookings.length > 0 || pastBookings.length === 0 ? 'upcoming' : 'past'

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
          {/* Skeleton tabs */}
          <div className="flex justify-center border-b border-gray-100 py-2">
            <div className="flex gap-6">
              <div className="animate-pulse h-5 bg-gray-200 rounded w-20" />
              <div className="animate-pulse h-5 bg-gray-200 rounded w-14" />
            </div>
          </div>
          {/* Skeleton filter chips */}
          <div className="flex gap-2 px-3 sm:px-4 py-2.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 rounded-full bg-gray-200" style={{ width: `${52 + i * 16}px` }} />
              </div>
            ))}
          </div>
          {/* Skeleton booking cards */}
          <div className="p-3 sm:p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
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
          <Tabs defaultValue={defaultTab} className="w-full flex flex-col flex-1">
            <TabsList className="grid w-full grid-cols-2 mx-auto sticky top-14 z-10 rounded-none h-11 bg-gray-50/80 backdrop-blur-sm md:max-w-md md:rounded-lg md:mt-2">
              <TabsTrigger value="upcoming" className="text-sm gap-1.5">
                <CalendarCheck className="w-4 h-4" />
                Upcoming
                {upcomingBookings.length > 0 && (
                  <span className="text-[10px] bg-deep-teal/10 text-deep-teal rounded-full px-1.5 py-0.5 font-semibold">
                    {upcomingBookings.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="past" className="text-sm gap-1.5">
                <History className="w-4 h-4" />
                Past
                {pastBookings.length > 0 && (
                  <span className="text-[10px] bg-gray-200 text-gray-600 rounded-full px-1.5 py-0.5 font-semibold">
                    {pastBookings.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* ===== UPCOMING TAB ===== */}
            <TabsContent value="upcoming" className="mt-0 flex-1 flex flex-col">
              {/* Pending alert */}
              {pendingCount > 0 && upcomingFilter === 'ALL' && (
                <div className="flex items-center gap-2.5 mx-3 sm:mx-4 mt-3 p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                  <p className="text-xs sm:text-sm text-amber-800 min-w-0">
                    <span className="font-semibold">{pendingCount}</span> booking{pendingCount > 1 ? 's' : ''} awaiting payment
                  </p>
                  <button
                    onClick={() => setUpcomingFilter('PENDING')}
                    className="ml-auto text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap"
                  >
                    View
                  </button>
                </div>
              )}

              <FilterChips
                filters={UPCOMING_FILTERS}
                activeFilter={upcomingFilter}
                counts={upcomingCounts}
                onFilterChange={setUpcomingFilter}
              />

              <div className="grow overflow-y-auto p-3 sm:p-4 md:p-6">
                {filteredUpcoming.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {filteredUpcoming.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : upcomingBookings.length === 0 ? (
                  <EmptyState
                    icon={CalendarCheck}
                    title="No upcoming bookings"
                    description="When you book a pet hotel, your upcoming stays will appear here."
                  />
                ) : (
                  <EmptyState
                    icon={CalendarX2}
                    title={
                      upcomingFilter === 'CONFIRMED'
                        ? 'No confirmed bookings'
                        : 'No pending bookings'
                    }
                    description={
                      upcomingFilter === 'CONFIRMED'
                        ? 'Your confirmed bookings will show up here.'
                        : 'No bookings awaiting payment right now.'
                    }
                  />
                )}
              </div>
            </TabsContent>

            {/* ===== PAST TAB ===== */}
            <TabsContent value="past" className="mt-0 flex-1 flex flex-col">
              <FilterChips
                filters={PAST_FILTERS}
                activeFilter={pastFilter}
                counts={pastCounts}
                onFilterChange={setPastFilter}
              />

              <div className="grow overflow-y-auto p-3 sm:p-4 md:p-6">
                {filteredPast.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {filteredPast.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : pastBookings.length === 0 ? (
                  <EmptyState
                    icon={History}
                    title="No past bookings"
                    description="Your completed and cancelled stays will appear here."
                  />
                ) : (
                  <EmptyState
                    icon={CalendarX2}
                    title={
                      pastFilter === 'SUCCESSFUL'
                        ? 'No completed stays'
                        : 'No cancellations'
                    }
                    description={
                      pastFilter === 'SUCCESSFUL'
                        ? 'Your completed stays will appear here.'
                        : 'You have no cancelled bookings.'
                    }
                  />
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
