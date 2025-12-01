'use client'

import React, { useEffect, useState, useMemo } from 'react' // Import useMemo
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { createBooking, searchRoomCategories } from '@/lib/api' // Import searchRoomCategories
import { useAuth } from '@/app/_components/AuthContext'
import { RoomCategories } from '@/types' // Import RoomCategories type

interface BookingDetail {
  propertyId: number
  checkInDate: string
  checkOutDate: string
  numberOfPets: number
  selectedRooms: { [key: string]: number }
  roomNames: { [key: string]: string }
}

export default function ConfirmBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()

  const [bookingDetails, setBookingDetails] = useState<BookingDetail | null>(
    null
  )
  const [fetchedRoomCategories, setFetchedRoomCategories] = useState<
    RoomCategories[]
  >([]) // New state
  const [loading, setLoading] = useState(true)
  const [isBookingLoading, setIsBookingLoading] = useState(false)

  useEffect(() => {
    const fetchBookingData = async () => {
      if (!isAuthenticated) {
        toast.error('Please login to continue')
        router.push('/authen')
        return
      }

      const propertyId = searchParams.get('propertyId')
      const start = searchParams.get('start')
      const end = searchParams.get('end')
      const pets = searchParams.get('pets')
      const rooms = searchParams.get('rooms')
      const roomNames = searchParams.get('roomNames')

      if (!propertyId || !start || !end || !pets || !rooms || !roomNames) {
        toast.error('Missing booking details')
        router.push('/')
        return
      }

      try {
        const parsedRooms = JSON.parse(decodeURIComponent(rooms))
        const parsedRoomNames = JSON.parse(decodeURIComponent(roomNames))

        const propertyIdNum = Number(propertyId)
        const petsNum = Number(pets)

        setBookingDetails({
          propertyId: propertyIdNum,
          checkInDate: start,
          checkOutDate: end,
          numberOfPets: petsNum,
          selectedRooms: parsedRooms,
          roomNames: parsedRoomNames,
        })

        // Fetch room categories with prices
        const response = await searchRoomCategories(
          propertyIdNum,
          start,
          end,
          petsNum
        )
        setFetchedRoomCategories(response.roomCategories)
      } catch (err) {
        console.error('Error fetching booking data or parsing params:', err)
        toast.error('Invalid booking data or failed to fetch prices.')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchBookingData()
  }, [isAuthenticated, searchParams, router]) // Add searchParams and router to dependencies

  const handleConfirmBooking = async () => {
    if (!bookingDetails) return

    setIsBookingLoading(true)

    try {
      const body = {
        propertyId: bookingDetails.propertyId,
        numberOfPets: bookingDetails.numberOfPets,
        bookingOrders: Object.entries(bookingDetails.selectedRooms).map(
          ([id, count]) => ({
            roomCategoryId: Number(id),
            checkInDate: bookingDetails.checkInDate,
            checkOutDate: bookingDetails.checkOutDate,
            roomsBooked: count,
          })
        ),
      }

      await createBooking(body)
      toast.success('Booking confirmed!')
      router.push('/profile/bookings')
    } catch (err) {
      console.error('Failed to confirm booking:', err) // Log the error for debugging
      toast.error('Unable to confirm booking')
    } finally {
      setIsBookingLoading(false)
    }
  }

  // Calculate total price and breakdown
  const priceSummary = useMemo(() => {
    let subtotal = 0
    const breakdown: {
      name: string
      quantity: number
      pricePerNight: number
      total: number
    }[] = []

    if (bookingDetails && fetchedRoomCategories.length > 0) {
      Object.entries(bookingDetails.selectedRooms).forEach(
        ([roomId, quantity]) => {
          const roomCategory = fetchedRoomCategories.find(
            (cat) => cat.id.toString() === roomId
          )
          if (
            roomCategory &&
            roomCategory.availability?.totalPrice !== undefined
          ) {
            const pricePerNight = roomCategory.availability.totalPrice // This is actually total price for the stay
            const roomTotal = pricePerNight * quantity // Assuming totalPrice from API is for one room for the entire stay
            subtotal += roomTotal
            breakdown.push({
              name: bookingDetails.roomNames[roomId] || `Room ${roomId}`,
              quantity,
              pricePerNight, // This is total price for the duration for one room
              total: roomTotal,
            })
          }
        }
      )
    }
    // You can add taxes, service fees here if applicable
    // For now, let's assume total is just subtotal
    const total = subtotal

    return { subtotal, total, breakdown }
  }, [bookingDetails, fetchedRoomCategories])

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner />
      </div>
    )

  if (!bookingDetails)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>No booking data found.</p>
      </div>
    )

  const nights =
    (new Date(bookingDetails.checkOutDate).getTime() -
      new Date(bookingDetails.checkInDate).getTime()) /
    (1000 * 60 * 60 * 24)

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        Confirm Your Booking
      </h1>

      {/* Summary Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-6 border border-gray-200">
        {/* Dates */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Trip</h2>
          <div className="space-y-1 text-gray-700">
            <p>
              <strong>Check-in:</strong>{' '}
              {format(new Date(bookingDetails.checkInDate), 'EEE, MMM d')}
            </p>
            <p>
              <strong>Check-out:</strong>{' '}
              {format(new Date(bookingDetails.checkOutDate), 'EEE, MMM d')}
            </p>
            <p>
              <strong>Total nights:</strong> {nights}
            </p>
          </div>
        </div>

        {/* Pets */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Pets</h2>
          <p className="text-gray-700">{bookingDetails.numberOfPets} pet(s)</p>
        </div>

        {/* Rooms */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Selected Rooms</h2>
          <div className="space-y-2">
            {Object.entries(bookingDetails.selectedRooms).map(([id, count]) => (
              <div
                key={id}
                className="flex justify-between border rounded-lg p-3 bg-gray-50"
              >
                <span>{bookingDetails.roomNames[id] || `Room ${id}`}</span>
                <span className="font-medium">{count} room(s)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Price Summary</h2>
          <div className="space-y-1 text-gray-700">
            {priceSummary.breakdown.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity} room(s)
                </span>
                <span>฿{item.total.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span>฿{priceSummary.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="sticky bottom-0 bg-white py-4 flex justify-center gap-4 border-t">
        <Button
          onClick={handleConfirmBooking}
          disabled={isBookingLoading}
          className="bg-accent-orange px-8 py-3 text-lg text-white rounded-xl"
        >
          {isBookingLoading ? <Spinner /> : 'Confirm Booking'}
        </Button>

        <Button
          onClick={() => router.back()}
          variant="outline"
          className="px-8 py-3 text-lg rounded-xl"
        >
          Go Back
        </Button>
      </div>
    </div>
  )
}
