'use client'

import React, { useEffect, useState } from 'react'
import { getHostPropertyBookings } from '@/lib/api'
import { Booking } from '@/types/booking'
import { BookingCard } from '@/app/profile/bookings/_components/BookingCard'
import { LoadingState } from '@/app/profile/_components/LoadingState'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { useRouter } from 'next/navigation'

interface PropertyBookingsSectionProps {
  propertyId: number
  propertyTitle: string
}

export function PropertyBookingsSection({
  propertyId,
  propertyTitle,
}: PropertyBookingsSectionProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await getHostPropertyBookings(propertyId.toString())
        setBookings(response.bookings)
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch property bookings'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [propertyId])

  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (bookings.length === 0) {
    return (
      <div className="border-t pt-8 mt-10">
        <h3 className="mb-3 text-deep-teal font-semibold">Bookings</h3>
        <p className="text-neutral-gray">
          No bookings found for this property.
        </p>
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
    <div className="border-t pt-8 mt-10">
      <h3 className="mb-4 text-deep-teal font-semibold">
        Bookings ({bookings.length})
      </h3>
      <div className="space-y-4">
        {sortedBookings.map((booking) => {
          // Inject property title if missing (because API might omit it for nested property bookings)
          const bookingWithProperty = {
            ...booking,
            property: booking.property || {
              title: propertyTitle,
              roomCategories: [],
            },
          }

          return (
            <BookingCard
              key={booking.id}
              booking={bookingWithProperty}
              onClick={(id) => router.push(`/profile/host/booking/${id}`)}
            />
          )
        })}
      </div>
    </div>
  )
}
