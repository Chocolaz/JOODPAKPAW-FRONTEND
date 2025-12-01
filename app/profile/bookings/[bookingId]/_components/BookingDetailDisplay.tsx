'use client'

import React, { useMemo } from 'react'
import { format } from 'date-fns'
import {
  CalendarCheck,
  CalendarX,
  User,
  Mail,
  Hash,
  BadgeInfo,
} from 'lucide-react'
import { FullBookingDetail } from '@/types'

interface BookingDetailDisplayProps {
  bookingDetails: FullBookingDetail
}

export default function BookingDetailDisplay({
  bookingDetails,
}: BookingDetailDisplayProps) {
  const priceSummary = useMemo(() => {
    let subtotal = 0
    const breakdown: {
      name: string
      quantity: number
      pricePerRoom: number
      total: number
    }[] = []

    bookingDetails.bookingOrders.forEach((order) => {
      const roomTotal = order.pricePerRoom * order.roomsBooked
      subtotal += roomTotal

      breakdown.push({
        name: order.roomCategory.name,
        quantity: order.roomsBooked,
        pricePerRoom: order.pricePerRoom,
        total: roomTotal,
      })
    })

    return { subtotal, total: subtotal, breakdown }
  }, [bookingDetails])

  const nights =
    (new Date(bookingDetails.checkOutDate).getTime() -
      new Date(bookingDetails.checkInDate).getTime()) /
    (1000 * 60 * 60 * 24)

  return (
    <div className="container mx-auto max-w-[550px] px-6 pb-10 pt-6 space-y-10">
      {/* TITLE */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">
          {bookingDetails.bookingOrders[0]?.property?.title}
        </h2>
        <p className="text-sm text-neutral-gray">
          {bookingDetails.bookingOrders[0]?.property?.address}
        </p>
        <p className="text-neutral-gray font-medium">Booking Details</p>
      </div>

      {/* CONTAINER CARD */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-8">
        {/* BOOKING INFO */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-deep-teal uppercase tracking-wide">
            Booking Info
          </h4>

          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-gray-400" /> Booking ID:{' '}
              <span className="font-semibold">{bookingDetails.id}</span>
            </p>

            <p className="flex items-center gap-2">
              <BadgeInfo className="w-4 h-4 text-gray-400" /> Status:{' '}
              <span className="capitalize font-semibold text-yellow-600">
                {bookingDetails.bookingStatus}
              </span>
            </p>

            <p className="text-gray-600 text-sm">
              Booked on:{' '}
              <span className="font-medium">
                {format(new Date(bookingDetails.createdAt), 'PPP p')}
              </span>
            </p>
          </div>
        </div>

        {/* GUEST INFO */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-deep-teal uppercase tracking-wide">
            PETS OWNER
          </h4>

          <div className="space-y-2 text-sm text-gray-700">
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              {bookingDetails.guest.firstName} {bookingDetails.guest.lastName}
            </p>

            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              {bookingDetails.guest.email}
            </p>
          </div>
        </div>

        {/* CHECK-IN / CHECK-OUT */}
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

        {/* PETS */}
        <div className="space-y-1 pt-2">
          <h4 className="text-deep-teal text-sm font-semibold uppercase tracking-wide">
            Pets
          </h4>
          <p className="text-gray-700">
            {bookingDetails.numberOfPets}{' '}
            {bookingDetails.numberOfPets > 1 ? 'pets' : 'pet'}
          </p>
        </div>

        {/* BOOKED ROOMS */}
        <div className="space-y-3">
          <h4 className="text-deep-teal text-sm font-semibold uppercase tracking-wide">
            Booked Rooms
          </h4>

          <div className="space-y-3">
            {bookingDetails.bookingOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm"
              >
                <span className="text-gray-800 font-medium">
                  {order.roomCategory.name}
                </span>
                <span className="font-semibold text-gray-900">
                  {order.roomsBooked} {order.roomsBooked > 1 ? 'rooms' : 'room'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PRICE SUMMARY */}
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
    </div>
  )
}
