'use client'

import React, { useEffect, useState, useMemo } from 'react'
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

const STATUS_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'PENDING', label: 'Pending', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-300' },
] as const

export function HostBookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
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

  const currentYear = getYear(new Date())
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(currentYear, 0, 1)),
    end: endOfYear(new Date(currentYear, 11, 31)),
  })

  const bookingsByMonth = useMemo(() => {
    const monthMap = new Map<string, boolean>()
    bookings.forEach((booking) => {
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

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto whitespace-nowrap hide-scrollbar border-b">
        <div className="inline-flex space-x-4 p-4">
          {months.map((month) => {
            const monthStr = format(month, 'yyyy-MM')
            const hasBooking = bookingsByMonth.has(monthStr)
            const isSelected = isSameMonth(month, selectedMonth)

            return (
              <button
                key={month.toString()}
                onClick={() => setSelectedMonth(month)}
                className={cn(
                  'relative pb-2 text-sm font-medium text-gray-500',
                  isSelected && 'text-primary border-b-2 border-primary'
                )}
              >
                {format(month, 'MMMM')}
                {hasBooking && (
                  <span className="absolute top-0 right-[-4px] h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Status filter chips */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
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

      <div className="grow overflow-y-auto p-4">
        {filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onClick={(id) => router.push(`/profile/host/booking/${id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">No bookings found for this month.</p>
          </div>
        )}
      </div>
    </div>
  )
}
