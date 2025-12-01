'use client'

import React, { useEffect, useState } from 'react'
import { getBookings } from '@/lib/api'
import { Booking, BookingsResponse } from '@/types/booking'
import { BookingCard } from './BookingCard'
import { LoadingState } from '@/app/profile/_components/LoadingState'
import { ErrorState } from '@/app/profile/_components/ErrorState'

export function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response: BookingsResponse = await getBookings()
        setBookings(response.bookings)
      } catch (err: unknown) {
        setError((err instanceof Error) ? err.message : 'Failed to fetch bookings')
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
        <p className="text-gray-500">No bookings found.</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))}
    </div>
  )
}
