'use client'

import React from 'react'
import { format } from 'date-fns'
import { RoomCategories, BookingDetail } from '@/types'
import { CalendarCheck, CalendarX } from 'lucide-react'
import PaymentSection from './PaymentSection'

interface ConfirmBookingDisplayProps {
  bookingDetails: BookingDetail
  fetchedRoomCategories: RoomCategories[]
  isBookingLoading: boolean
  setIsBookingLoading: (loading: boolean) => void
}

export default function ConfirmBookingDisplay({
  bookingDetails,
  fetchedRoomCategories,
  isBookingLoading,
  setIsBookingLoading,
}: ConfirmBookingDisplayProps) {
  const checkInDate = new Date(bookingDetails.checkInDate)
  const checkOutDate = new Date(bookingDetails.checkOutDate)

  let nights = 0
  if (
    checkInDate instanceof Date &&
    !isNaN(checkInDate.getTime()) &&
    checkOutDate instanceof Date &&
    !isNaN(checkOutDate.getTime())
  ) {
    nights =
      (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  }

  // Ensure nights is a non-negative integer
  nights = Math.max(0, Math.round(nights))

  const priceDetails = Object.entries(bookingDetails.selectedRooms).map(
    ([id, count]) => {
      const roomCategory = fetchedRoomCategories.find(
        (rc) => rc.id === Number(id),
      )
      const roomCount = count ?? 0
      const pricePerRoomForDuration = roomCategory?.availability?.totalPrice ?? 0
      const price = pricePerRoomForDuration * roomCount
      return {
        id,
        count: roomCount,
        name: bookingDetails.roomNames[id] || `Room ${id}`,
        price,
      }
    },
  )

  const finalPrice = priceDetails.reduce((acc, detail) => acc + detail.price, 0)

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
            {priceDetails.map((detail) => (
              <div
                key={detail.id}
                className="flex justify-between text-gray-700"
              >
                <span>{`${detail.name} (${detail.count}x)`}</span>
                <span>THB {detail.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-3 mt-3 flex justify-between text-xl font-semibold text-gray-900">
              <span>Total</span>
              <span>THB {finalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <PaymentSection
        bookingDetails={bookingDetails}
        isBookingLoading={isBookingLoading}
        setIsBookingLoading={setIsBookingLoading}
      />
    </div>
  )
}
