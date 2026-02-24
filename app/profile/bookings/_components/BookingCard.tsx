'use client'

import { Booking, BookingOrder } from '@/types/booking'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock, Home, PawPrint, Star } from 'lucide-react'
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

  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'SUCCESSFUL':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'PENDING':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-600 border-red-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className={cn('cursor-pointer active:scale-[0.98] transition-transform duration-150', {
        'opacity-60': booking.bookingStatus.toUpperCase() === 'CANCELLED',
      })}
    >
      <Card className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-5 bg-white/70 backdrop-blur-sm h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className="leading-tight text-deep-teal text-sm sm:text-base min-w-0 truncate">
            {propertyTitle}
          </h4>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={cn(
                'text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border whitespace-nowrap',
                getStatusStyle(booking.bookingStatus)
              )}
            >
              {booking.bookingStatus}
            </span>
            {booking.bookingStatus.toUpperCase() === 'SUCCESSFUL' && (
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-3.5 h-3.5',
                      booking.rating && star <= booking.rating
                        ? 'fill-yellow-400 text-yellow-500'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Row */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm mb-3 text-gray-700">
          <div className="flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-medium">{totalRoomsBooked}</span>
            <span className="text-gray-500">
              {totalRoomsBooked === 1 ? 'room' : 'rooms'}
            </span>
          </div>

          <span className="text-gray-300">·</span>

          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span className="font-medium">{nights}</span>
            <span className="text-gray-500">
              {nights === 1 ? 'night' : 'nights'}
            </span>
          </div>

          {booking.numberOfPets > 0 && (
            <>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-1">
                <PawPrint className="w-3.5 h-3.5 text-gray-500" />
                <span className="font-medium">{booking.numberOfPets}</span>
                <span className="text-gray-500">
                  {booking.numberOfPets === 1 ? 'pet' : 'pets'}
                </span>
              </div>
            </>
          )}
        </div>

        <CardContent className="space-y-4 p-0">
          {/* Date Section */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 bg-off-white rounded-lg p-3 sm:p-4">
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Calendar className="w-3.5 h-3.5 text-deep-teal mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-deep-teal font-medium uppercase tracking-wide">
                  Check-in
                </p>
                <p className="text-xs sm:text-sm font-medium truncate">{checkInDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-1.5 sm:gap-2">
              <Calendar className="w-3.5 h-3.5 text-accent-orange mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-accent-orange font-medium uppercase tracking-wide">
                  Check-out
                </p>
                <p className="text-xs sm:text-sm font-medium truncate">{checkOutDate}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-neutral-gray min-w-0">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Booked {createdAt}</span>
            </div>

            <p className="text-base sm:text-lg font-semibold text-end shrink-0 ml-2">
              ฿{booking.totalPrice.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
