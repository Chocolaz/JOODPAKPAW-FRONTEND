'use client'

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { getHostBookings } from '@/lib/api'
import { Booking, BookingsResponse } from '@/types/booking'
import { LoadingState } from '@/app/profile/_components/LoadingState'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { useRouter } from 'next/navigation'
import {
  format,
  getYear,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  isSameMonth,
  parseISO,
} from 'date-fns'
import { BookingCard } from '@/app/profile/bookings/_components/BookingCard'
import { cn } from '@/lib/utils'
import { CalendarX2, AlertCircle } from 'lucide-react'

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'PENDING', label: 'Pending', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-300' },
] as const

const EMPTY_MESSAGES: Record<string, { title: string; description: string }> = {
  ALL: { title: 'No bookings this month', description: 'Bookings for this month will appear here.' },
  CONFIRMED: { title: 'No confirmed bookings', description: 'Confirmed bookings for this month will appear here.' },
  PENDING: { title: 'No pending bookings', description: 'You\'re all caught up! No bookings waiting for action.' },
  CANCELLED: { title: 'No cancellations', description: 'No cancelled bookings for this month.' },
}

export function HostBookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [statusFilter, setStatusFilter] = useState('ALL')
  const monthScrollRef = useRef<HTMLDivElement>(null)
  const monthButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
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

  // Auto-scroll to current month on mount
  const scrollToMonth = useCallback((date: Date) => {
    const key = format(date, 'yyyy-MM')
    const button = monthButtonRefs.current.get(key)
    if (button && monthScrollRef.current) {
      const container = monthScrollRef.current
      const scrollLeft = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => {
    if (!loading) {
      // Small delay to ensure buttons are rendered
      setTimeout(() => scrollToMonth(selectedMonth), 100)
    }
  }, [loading, scrollToMonth, selectedMonth])

  const currentYear = getYear(new Date())
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(currentYear, 0, 1)),
    end: endOfYear(new Date(currentYear, 11, 31)),
  })

  const bookingsByMonth = useMemo(() => {
    const monthMap = new Map<string, boolean>()
    bookings.forEach((booking) => {
      if (booking.bookingStatus.toUpperCase() === 'SUCCESSFUL') return
      const checkInMonth = format(parseISO(booking.checkInDate), 'yyyy-MM')
      monthMap.set(checkInMonth, true)
    })
    return monthMap
  }, [bookings])

  const filteredBookings = useMemo(() => {
    const statusOrder = ['CONFIRMED', 'PENDING', 'SUCCESSFUL', 'CANCELLED']

    return bookings
      .filter((booking) => {
        const status = booking.bookingStatus.toUpperCase()
        const inMonth = isSameMonth(parseISO(booking.checkInDate), selectedMonth)
        const notSuccessful = status !== 'SUCCESSFUL'
        const matchesFilter = statusFilter === 'ALL' || status === statusFilter
        return inMonth && notSuccessful && matchesFilter
      })
      .sort((a, b) => {
        const statusA = a.bookingStatus.toUpperCase()
        const statusB = b.bookingStatus.toUpperCase()

        const orderA = statusOrder.indexOf(statusA)
        const orderB = statusOrder.indexOf(statusB)

        if (orderA !== -1 && orderB !== -1) {
          if (orderA !== orderB) {
            return orderA - orderB
          }
        } else if (orderA !== -1) {
          return -1
        } else if (orderB !== -1) {
          return 1
        }
        return (
          new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
        )
      })
  }, [bookings, selectedMonth, statusFilter])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: 0 }
    bookings.forEach((booking) => {
      const status = booking.bookingStatus.toUpperCase()
      if (status === 'SUCCESSFUL') return
      if (!isSameMonth(parseISO(booking.checkInDate), selectedMonth)) return
      counts.ALL = (counts.ALL || 0) + 1
      counts[status] = (counts[status] || 0) + 1
    })
    return counts
  }, [bookings, selectedMonth])

  const handleMonthSelect = (month: Date) => {
    setSelectedMonth(month)
    setStatusFilter('ALL')
  }

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  const pendingCount = statusCounts.PENDING || 0
  const emptyMsg = EMPTY_MESSAGES[statusFilter] || EMPTY_MESSAGES.ALL

  return (
    <div className="flex flex-col h-full">
      {/* Pending alert banner */}
      {pendingCount > 0 && statusFilter === 'ALL' && (
        <div className="flex items-center gap-2.5 mx-3 sm:mx-4 mt-3 p-2.5 sm:p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
          <p className="text-xs sm:text-sm text-amber-800 min-w-0">
            <span className="font-semibold">{pendingCount}</span> booking{pendingCount > 1 ? 's' : ''} awaiting response
          </p>
          <button
            onClick={() => setStatusFilter('PENDING')}
            className="ml-auto text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-900 whitespace-nowrap"
          >
            View
          </button>
        </div>
      )}

      {/* Month selector */}
      <div
        ref={monthScrollRef}
        className="overflow-x-auto whitespace-nowrap hide-scrollbar border-b"
      >
        <div className="inline-flex space-x-4 p-3 sm:p-4 md:justify-center md:w-full">
          {months.map((month) => {
            const monthStr = format(month, 'yyyy-MM')
            const hasBooking = bookingsByMonth.has(monthStr)
            const isSelected = isSameMonth(month, selectedMonth)

            return (
              <button
                key={month.toString()}
                ref={(el) => {
                  if (el) monthButtonRefs.current.set(monthStr, el)
                }}
                onClick={() => handleMonthSelect(month)}
                className={cn(
                  'relative pb-2 text-sm font-medium text-gray-500 transition-colors duration-200',
                  isSelected && 'text-deep-teal border-b-2 border-deep-teal'
                )}
              >
                {format(month, 'MMM')}
                {hasBooking && !isSelected && (
                  <span className="absolute top-0 right-[-4px] h-1.5 w-1.5 rounded-full bg-accent-orange"></span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Summary stats bar */}
      {statusCounts.ALL > 0 && (
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-[11px] sm:text-xs text-neutral-gray border-b border-gray-100 overflow-x-auto hide-scrollbar">
          <span className="whitespace-nowrap">{statusCounts.ALL} booking{statusCounts.ALL > 1 ? 's' : ''}</span>
          <span className="text-gray-200">|</span>
          {statusCounts.CONFIRMED > 0 && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></span>
              {statusCounts.CONFIRMED} confirmed
            </span>
          )}
          {statusCounts.PENDING > 0 && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500"></span>
              {statusCounts.PENDING} pending
            </span>
          )}
          {statusCounts.CANCELLED > 0 && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-400"></span>
              {statusCounts.CANCELLED} cancelled
            </span>
          )}
        </div>
      )}

      {/* Status filter chips */}
      <div className="flex gap-2 px-3 sm:px-4 py-2.5 overflow-x-auto hide-scrollbar">
        {STATUS_FILTERS.map((filter) => {
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
            <CalendarX2 className="w-12 h-12 text-gray-300 mb-3" />
            <h4 className="text-base font-semibold text-gray-600">
              {emptyMsg.title}
            </h4>
            <p className="text-sm text-gray-400 mt-1 max-w-[240px]">
              {emptyMsg.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
