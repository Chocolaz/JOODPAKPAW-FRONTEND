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
  Phone,
  CheckCircle,
  Star,
} from 'lucide-react'
import { HostBookingDetail } from '@/types'
import { completeBooking } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/app/_components/ConfirmationModal'
import { toast } from 'sonner'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

interface HostBookingDetailDisplayProps {
  bookingDetails: HostBookingDetail
  refreshBooking: () => void
}

export default function HostBookingDetailDisplay({
  bookingDetails,
  refreshBooking,
}: HostBookingDetailDisplayProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const getStatusColorClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'text-green-600'
      case 'SUCCESSFUL':
        return 'text-green-600'
      case 'PENDING':
        return 'text-blue-600'
      case 'CANCELLED':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

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

  const handlePropertyClick = () => {
    // For host, maybe we want to go to the host property manage page?
    // /profile/host/[propertyId]
    if (bookingDetails.bookingOrders[0]?.property?.id) {
      router.push(
        `/profile/host/${bookingDetails.bookingOrders[0].property.id}`
      )
    }
  }

  const canComplete = useMemo(() => {
    if (bookingDetails.bookingStatus.toUpperCase() !== 'CONFIRMED') {
      return { allowed: false, reason: 'Booking is not confirmed' }
    }

    const checkOutDate = new Date(bookingDetails.checkOutDate)
    // Set time to 12:00 PM (noon)
    checkOutDate.setHours(12, 0, 0, 0)

    const now = new Date()

    if (now < checkOutDate) {
      return {
        allowed: false,
        reason: `Available after 12:00 PM on ${format(new Date(bookingDetails.checkOutDate), 'MMM d')}`,
      }
    }

    return { allowed: true, reason: '' }
  }, [bookingDetails])

  const handleCompleteBooking = async () => {
    setIsCompleting(true)
    try {
      await completeBooking(bookingDetails.id)
      toast.success('Booking marked as completed successfully.')
      setIsModalOpen(false)
      refreshBooking()
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to complete booking.'
      )
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <>
      <div className="container mx-auto max-w-[550px] px-6 pb-10 pt-6 space-y-10">
        {/* TITLE */}
        <div className="space-y-1">
          <h2
            className="text-xl text-gray-900 cursor-pointer underline"
            onClick={handlePropertyClick}
          >
            {bookingDetails.bookingOrders[0]?.property?.title}
          </h2>
          <p className="text-sm text-neutral-gray">
            {bookingDetails.bookingOrders[0]?.property?.address}
          </p>
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
                <span
                  className={cn(
                    'capitalize font-semibold',
                    getStatusColorClass(bookingDetails.bookingStatus)
                  )}
                >
                  {bookingDetails.bookingStatus}
                </span>
              </p>

              <p className="text-gray-600 text-sm">
                Confirmed at:{' '}
                <span className="font-medium">
                  {format(
                    new Date(
                      bookingDetails.confirmedAt || bookingDetails.createdAt
                    ),
                    'PPP p'
                  )}
                </span>
              </p>
            </div>
          </div>

          {/* GUEST INFO */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-deep-teal uppercase tracking-wide">
              GUEST INFO
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

              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                {bookingDetails.guest.phone}
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
            <span className="font-medium">Total nights:</span>{' '}
            {Math.max(1, Math.ceil(nights))}
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
                    {order.roomsBooked}{' '}
                    {order.roomsBooked > 1 ? 'rooms' : 'room'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PRICE SUMMARY */}
          <div className="space-y-3">
            <h4 className="text-deep-teal text-sm font-semibold uppercase tracking-wide">
              Price Summary ({Math.max(1, Math.ceil(nights))} nights)
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

        {/* GUEST REVIEW */}
        {bookingDetails.rating != null && bookingDetails.rating > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4">
            <h4 className="text-sm font-semibold text-deep-teal uppercase tracking-wide">
              Guest Review
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {bookingDetails.guest.firstName}{' '}
                  {bookingDetails.guest.lastName}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-5 h-5',
                      star <= bookingDetails.rating!
                        ? 'fill-yellow-400 text-yellow-500'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {bookingDetails.rating}/5
              </span>
            </div>
            {bookingDetails.comment && (
              <p className="text-sm text-gray-600 leading-relaxed border bg-off-white/80 border-gray-200 rounded-xl p-4">
                &quot;{bookingDetails.comment}&quot;
              </p>
            )}
          </div>
        )}

        {/* ACTION BUTTON */}
        {bookingDetails.bookingStatus.toUpperCase() === 'CONFIRMED' && (
          <div className="pt-4">
            <Button
              className="w-full h-12 text-lg"
              disabled={!canComplete.allowed || isCompleting}
              onClick={() => setIsModalOpen(true)}
            >
              {isCompleting ? (
                <Spinner className="size-5 mr-2" />
              ) : (
                <CheckCircle className="size-5 mr-2" />
              )}
              Mark as Completed
            </Button>
            {!canComplete.allowed && (
              <p className="text-center text-xs text-neutral-gray mt-2">
                {canComplete.reason}
              </p>
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCompleteBooking}
        title="Complete Booking"
        message="Are you sure you want to mark this booking as successful? This action cannot be undone."
        titleClassName="text-deep-teal"
        confirmButtonClassName="bg-deep-teal hover:bg-deep-teal/90"
      />
    </>
  )
}
