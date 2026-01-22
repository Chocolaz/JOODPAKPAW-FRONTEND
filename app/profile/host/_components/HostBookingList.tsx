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

export function HostBookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
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
    return bookings
      .filter((booking) =>
        isSameMonth(parseISO(booking.checkInDate), selectedMonth)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
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
