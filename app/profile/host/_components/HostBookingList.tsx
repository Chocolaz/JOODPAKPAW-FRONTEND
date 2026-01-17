'use client'

import React, { useEffect, useState } from 'react'
import { getHostBookings } from '@/lib/api'
import { Booking, BookingsResponse } from '@/types/booking'
import { BookingCard } from '@/app/profile/bookings/_components/BookingCard'
import { LoadingState } from '@/app/profile/_components/LoadingState'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { useRouter } from 'next/navigation'

export function HostBookingList() {
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
          err instanceof Error
            ? err.message
            : 'Failed to fetch host bookings',
        )
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">No bookings found for your properties.</p>
      </div>
    )
  }

  const sortedBookings = [...bookings].sort((a, b) => {
    const aIsCancelled = a.bookingStatus.toUpperCase() === 'CANCELLED'
    const bIsCancelled = b.bookingStatus.toUpperCase() === 'CANCELLED'

    if (aIsCancelled && !bIsCancelled) {
      return 1
    }
    if (!aIsCancelled && bIsCancelled) {
      return -1
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="p-4">
      {sortedBookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onClick={(id) => router.push(`/profile/host/booking/${id}`)}
        />
      ))}
    </div>
  )
}
