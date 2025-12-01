'use client'

import React, { useEffect, useState, useMemo, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { createBooking, searchRoomCategories } from '@/lib/api'
import { useAuth } from '@/app/_components/AuthContext'
import { RoomCategories } from '@/types'
import { CalendarCheck, CalendarX, CalendarDays } from 'lucide-react'

interface BookingDetail {
  propertyId: number
  checkInDate: string
  checkOutDate: string
  numberOfPets: number
  selectedRooms: { [key: string]: number }
  roomNames: { [key: string]: string }
}

function ConfirmBookingContentInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()

  const [bookingDetails, setBookingDetails] = useState<BookingDetail | null>(
    null
  )
  const [fetchedRoomCategories, setFetchedRoomCategories] = useState<
    RoomCategories[]
  >([])
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
  }, [isAuthenticated, searchParams, router])

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
      console.error('Failed to confirm booking:', err)
      toast.error('Unable to confirm booking')
    } finally {
      setIsBookingLoading(false)
    }
  }

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
            const pricePerNight = roomCategory.availability.totalPrice
            const roomTotal = pricePerNight * quantity
            subtotal += roomTotal
            breakdown.push({
              name: bookingDetails.roomNames[roomId] || `Room ${roomId}`,
              quantity,
              pricePerNight,
              total: roomTotal,
            })
          }
        }
      )
    }
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
    <div className="container mx-auto max-w-[500px] px-5 pb-20 pt-6 space-y-8">
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-8">
        <div className="space-y-1">
          <h3 className="text-deep-teal text-xl font-semibold">
            {fetchedRoomCategories[0]?.property?.title || 'Your Trip'}
          </h3>

          {fetchedRoomCategories[0]?.property?.address && (
            <p className="text-neutral-gray text-sm">
              {fetchedRoomCategories[0].property.address}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-xl p-4 bg-off-white flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <CalendarCheck className="w-5 h-5 text-deep-teal" />
            </div>

            <div>
              <p className="text-xs text-neutral-gray uppercase">Check-in</p>
              <p className="text-base font-semibold text-gray-900">
                {format(new Date(bookingDetails.checkInDate), 'EEE, MMM d')}
              </p>
            </div>
          </div>

          <div className="border rounded-xl p-4 bg-off-white flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <CalendarX className="w-5 h-5 text-accent-orange" />
            </div>

            <div>
              <p className="text-xs text-neutral-gray uppercase">Check-out</p>
              <p className="text-base font-semibold text-gray-900">
                {format(new Date(bookingDetails.checkOutDate), 'EEE, MMM d')}
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-700 text-sm -mt-3">
          <span className="font-medium">Total nights:</span> {nights}
        </p>

        <div className="space-y-1 pt-2">
          <h4 className="text-deep-teal text-sm font-semibold uppercase tracking-wide">
            Pets
          </h4>
          <p className="text-gray-700">
            {bookingDetails.numberOfPets}{' '}
            {bookingDetails.numberOfPets > 1 ? 'pets' : 'pet'}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-deep-teal text-sm font-semibold uppercase tracking-wide">
            Selected Rooms
          </h4>
          <div className="space-y-3">
            {Object.entries(bookingDetails.selectedRooms).map(([id, count]) => (
              <div
                key={id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
              >
                <span className="text-gray-800 font-medium">
                  {bookingDetails.roomNames[id] || `Room ${id}`}
                </span>
                <span className="font-semibold text-gray-900">
                  {count} {count > 1 ? 'rooms' : 'room'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-deep-teal text-sm font-semibold uppercase tracking-wide">
            Price Summary ({nights} nights)
          </h4>

          <div className="space-y-2">
            {priceSummary.breakdown.map((item, index) => (
              <div
                key={index}
                className="flex justify-between text-gray-600 text-sm"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>฿{item.total.toLocaleString()}</span>
              </div>
            ))}

            <div className="border-t pt-3 mt-3 flex justify-between text-xl font-semibold text-gray-900">
              <span>Total</span>
              <span>฿{priceSummary.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/85 border-t shadow-2xl rounded-t-3xl py-5 px-6 z-50">
        <div className="max-w-[500px] mx-auto">
          <Button
            onClick={handleConfirmBooking}
            disabled={isBookingLoading}
            className="bg-positive-green h-14 w-full text-lg text-white font-semibold"
          >
            {isBookingLoading ? <Spinner /> : 'Confirm Booking'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmBookingPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <ConfirmBookingContentInner />
    </Suspense>
  )
}
