'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { searchRoomCategories } from '@/lib/api'
import { useAuth } from '@/app/_components/AuthContext'
import { RoomCategories, BookingDetail } from '@/types'
import ConfirmBookingDisplay from './ConfirmBookingDisplay'

export default function ConfirmBookingDataLoader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()

  const [bookingDetails, setBookingDetails] = useState<BookingDetail | null>(
    null
  )
  const [fetchedRoomCategories, setFetchedRoomCategories] = useState<
    RoomCategories[]
  >([])
  const [loading, setLoading] = useState(true)
  const [isBookingLoading, setIsBookingLoading] = useState(false) // State for booking confirmation loading

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

  return (
    <ConfirmBookingDisplay
      bookingDetails={bookingDetails}
      fetchedRoomCategories={fetchedRoomCategories}
      isBookingLoading={isBookingLoading}
      setIsBookingLoading={setIsBookingLoading}
    />
  )
}
