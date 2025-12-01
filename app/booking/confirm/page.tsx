'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { createBooking } from '@/lib/api' // Assuming this is available
import { useAuth } from '@/app/_components/AuthContext' // Assuming AuthContext is needed

interface BookingDetail {
  propertyId: number
  checkInDate: string
  checkOutDate: string
  numberOfPets: number
  selectedRooms: { [key: string]: number } // { roomId: count }
}

export default function ConfirmBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth() // Assuming authentication is required

  const [bookingDetails, setBookingDetails] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookingLoading, setIsBookingLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to confirm a booking.')
      router.push('/authen/login')
      return
    }

    const propertyId = searchParams.get('propertyId')
    const start = searchParams.get('start')
    const end = searchParams.get('end')
    const pets = searchParams.get('pets')
    const rooms = searchParams.get('rooms')

    if (!propertyId || !start || !end || !pets || !rooms) {
      toast.error('Missing booking details. Please go back and select again.')
      router.push('/') // Redirect to home or property detail
      return
    }

    try {
      const parsedRooms = JSON.parse(decodeURIComponent(rooms))
      setBookingDetails({
        propertyId: parseInt(propertyId),
        checkInDate: start,
        checkOutDate: end,
        numberOfPets: parseInt(pets),
        selectedRooms: parsedRooms,
      })
    } catch (e) {
      console.error('Failed to parse room data:', e)
      toast.error('Invalid room data. Please go back and select again.')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [searchParams, router, isAuthenticated])

  const handleConfirmBooking = async () => {
    if (!bookingDetails || !user?.id) {
      toast.error('Cannot confirm booking: missing details or user information.')
      return
    }

    setIsBookingLoading(true)
    setError(null)

    try {
      // Prepare booking request body
      const bookingRequestBody = {
        propertyId: bookingDetails.propertyId,
        numberOfPets: bookingDetails.numberOfPets,
        bookingOrders: Object.entries(bookingDetails.selectedRooms).map(([roomId, count]) => ({
          roomCategoryId: parseInt(roomId),
          checkInDate: bookingDetails.checkInDate,
          checkOutDate: bookingDetails.checkOutDate,
          roomsBooked: count,
        })),
      }

      await createBooking(bookingRequestBody)
      toast.success('Booking confirmed successfully!')
      router.push('/profile/bookings') // Redirect to a bookings page
    } catch (err: any) {
      console.error('Failed to confirm booking:', err)
      setError(err.message || 'Failed to confirm booking. Please try again.')
      toast.error(err.message || 'Failed to confirm booking.')
    } finally {
      setIsBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
        <p className="ml-2">Loading booking details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No booking details to display.</p>
      </div>
    )
  }

  const totalRooms = Object.values(bookingDetails.selectedRooms).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Confirm Your Booking</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Booking Summary</h2>
        <div className="space-y-2">
          <p><strong>Property ID:</strong> {bookingDetails.propertyId}</p>
          <p>
            <strong>Check-in Date:</strong>{' '}
            {format(new Date(bookingDetails.checkInDate), 'PPP')}
          </p>
          <p>
            <strong>Check-out Date:</strong>{' '}
            {format(new Date(bookingDetails.checkOutDate), 'PPP')}
          </p>
          <p><strong>Number of Pets:</strong> {bookingDetails.numberOfPets}</p>
          <p><strong>Selected Rooms:</strong></p>
          <ul className="list-disc pl-5">
            {Object.entries(bookingDetails.selectedRooms).map(([roomId, count]) => (
              <li key={roomId}>
                Room Category {roomId}: {count}
              </li>
            ))}
          </ul>
          <p><strong>Total Rooms:</strong> {totalRooms}</p>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleConfirmBooking}
          className="bg-accent-orange text-white py-2 px-6 rounded-lg text-lg"
          disabled={isBookingLoading}
        >
          {isBookingLoading ? <Spinner /> : 'Confirm Booking'}
        </Button>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="ml-4 py-2 px-6 rounded-lg text-lg"
          disabled={isBookingLoading}
        >
          Go Back
        </Button>
      </div>
    </div>
  )
}
