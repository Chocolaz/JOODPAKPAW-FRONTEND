'use client'

import { Booking, BookingOrder } from '@/types/booking'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, Home, PawPrint } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { useRouter } from 'next/navigation' // Import useRouter
import { cn } from '@/lib/utils'

interface BookingCardProps {
  booking: Booking
  onClick?: (bookingId: number) => void
}

export function BookingCard({ booking, onClick }: BookingCardProps) {
  const router = useRouter() // Initialize useRouter

  const checkInDate = format(new Date(booking.checkInDate), 'MMM dd, yyyy')
  const checkOutDate = format(new Date(booking.checkOutDate), 'MMM dd, yyyy')
  const createdAt = format(new Date(booking.createdAt), 'MMM dd, yyyy')

  const nights = differenceInDays(
    new Date(booking.checkOutDate),
    new Date(booking.checkInDate)
  )

  let totalRoomsBooked = 0

  // Try to calculate from property.roomCategories (standard API response)
  if (booking.property?.roomCategories) {
    totalRoomsBooked = booking.property.roomCategories.reduce(
      (sum, c) => sum + (c.roomsBooked || 0),
      0
    )
  }
  // Fallback: Try to calculate from bookingOrders if available (Host API response might have this)
  else if ('bookingOrders' in booking) {
    const orders = (booking as unknown as { bookingOrders: BookingOrder[] })
      .bookingOrders
    if (Array.isArray(orders)) {
      totalRoomsBooked = orders.reduce(
        (sum, order) => sum + (order.roomsBooked || 0),
      0
      )
    }
  }

  const propertyTitle = booking.property?.title || 'Unknown Property'

  const handleCardClick = () => {
    if (onClick) {
      onClick(booking.id)
    } else {
      router.push(`/profile/bookings/${booking.id}`)
    }
  }

  const getStatusColorClass = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'text-green-600'
      case 'SUCCESSFUL': // Changed from COMPLETED to SUCCESSFUL
        return 'text-green-600'
      case 'PENDING':
        return 'text-blue-600'
      case 'CANCELLED':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className={cn('cursor-pointer', {
        'opacity-60': booking.bookingStatus.toUpperCase() === 'CANCELLED',
      })}
    >
      <Card className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 mb-4 bg-white/70 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="leading-tight text-deep-teal">{propertyTitle}</h4>
          <span
            className={cn(
              'text-xs font-semibold uppercase',
              getStatusColorClass(booking.bookingStatus)
            )}
          >
            {booking.bookingStatus}
          </span>
        </div>

        {/* Info Row */}
        <div className="flex items-center gap-4 text-sm mb-4 text-gray-700">
          <div className="flex items-center gap-1.5">
            <Home className="w-4 h-4 text-gray-600" />
            <span className="font-medium">{totalRoomsBooked}</span>
            <span className="text-gray-500">
              {totalRoomsBooked === 1 ? 'room' : 'rooms'}
            </span>
          </div>

          <span className="text-gray-300">•</span>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="font-medium">{nights}</span>
            <span className="text-gray-500">
              {nights === 1 ? 'night' : 'nights'}
            </span>
          </div>

          {booking.numberOfPets > 0 && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <PawPrint className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{booking.numberOfPets}</span>
                <span className="text-gray-500">
                  {booking.numberOfPets === 1 ? 'pet' : 'pets'}
                </span>
              </div>
            </>
          )}
        </div>

        <CardContent className="space-y-5 p-0">
          {/* Date Section */}
          <div className="grid grid-cols-2 gap-6 bg-off-white rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-deep-teal mt-0.5" />
              <div>
                <p className="text-xs text-deep-teal font-medium uppercase tracking-wide">
                  Check-in
                </p>
                <p className="text-sm font-medium">{checkInDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-accent-orange mt-0.5" />
              <div>
                <p className="text-xs text-accent-orange font-medium uppercase tracking-wide">
                  Check-out
                </p>
                <p className="text-sm font-medium">{checkOutDate}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-4 ">
            <div className="flex items-center gap-2 text-xs text-neutral-gray">
              <Clock className="w-3.5 h-3.5" />
              <span>Booked on {createdAt}</span>
            </div>

            <p className="text-lg font-medium text-end">
              ฿{booking.totalPrice.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
