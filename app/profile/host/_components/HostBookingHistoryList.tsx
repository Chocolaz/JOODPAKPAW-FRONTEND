'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { getHostBookings } from '@/lib/api'
import { Booking, BookingsResponse } from '@/types/booking'
import { LoadingState } from '@/app/profile/_components/LoadingState'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { useRouter } from 'next/navigation'
import { parseISO } from 'date-fns' // Only need parseISO now
import { BookingCard } from '@/app/profile/bookings/_components/BookingCard'
// import { cn } from '@/lib/utils' // cn is no longer needed here

export function HostBookingHistoryList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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

  const filteredBookings = useMemo(() => {
    const statusOrder = ['CONFIRMED', 'PENDING', 'SUCCESSFUL', 'CANCELLED'] // Updated status order

    return bookings
      .filter((booking) => booking.bookingStatus.toUpperCase() === 'SUCCESSFUL') // Filter only for SUCCESSFUL status
      .sort((a, b) => {
        const statusA = a.bookingStatus.toUpperCase()
        const statusB = b.bookingStatus.toUpperCase()

        const orderA = statusOrder.indexOf(statusA)
        const orderB = statusOrder.indexOf(statusB)

        // If both statuses are in the predefined order
        if (orderA !== -1 && orderB !== -1) {
          if (orderA !== orderB) {
            return orderA - orderB // Sort by status order
          }
        } else if (orderA !== -1) {
          return -1 // A comes first if B is not in predefined order
        } else if (orderB !== -1) {
          return 1 // B comes first if A is not in predefined order
        }
        // If one or both statuses are not in the predefined order, or if statuses are the same
        // Sort by checkInDate (ascending)
        return (
          new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
        )
      })
  }, [bookings]) // Remove selectedMonth from dependency array

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="flex flex-col h-full">
      {/* Removed monthly navigation UI */}
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
            <p className="text-gray-500">No successful bookings found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
