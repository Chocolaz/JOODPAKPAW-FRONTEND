'use client'

import { Booking, BookingOrder } from '@/types/booking'
import { Calendar, Clock, Home, PawPrint, Star, ArrowRight } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BookingCardProps {
  booking: Booking
  onClick?: (bookingId: number) => void
}

function getStatusAccent(status: string) {
  switch (status.toUpperCase()) {
    case 'CONFIRMED': return 'border-l-green-500'
    case 'SUCCESSFUL': return 'border-l-positive-green'
    case 'PENDING': return 'border-l-blue-400'
    case 'CANCELLED': return 'border-l-red-300'
    default: return 'border-l-gray-200'
  }
}

function getStatusBadge(status: string) {
  switch (status.toUpperCase()) {
    case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200'
    case 'SUCCESSFUL': return 'bg-positive-green/10 text-positive-green border-positive-green/30'
    case 'PENDING': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'CANCELLED': return 'bg-red-50 text-red-500 border-red-200'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

export function BookingCard({ booking, onClick }: BookingCardProps) {
  const router = useRouter()

  const checkInDate = format(new Date(booking.checkInDate), 'MMM dd, yyyy')
  const checkOutDate = format(new Date(booking.checkOutDate), 'MMM dd, yyyy')
  const createdAt = format(new Date(booking.createdAt), 'MMM dd, yyyy')
  const nights = differenceInDays(new Date(booking.checkOutDate), new Date(booking.checkInDate))

  let totalRoomsBooked = 0
  if (booking.property?.roomCategories) {
    totalRoomsBooked = booking.property.roomCategories.reduce((sum, c) => sum + (c.roomsBooked || 0), 0)
  } else if ('bookingOrders' in booking) {
    const orders = (booking as unknown as { bookingOrders: BookingOrder[] }).bookingOrders
    if (Array.isArray(orders)) {
      totalRoomsBooked = orders.reduce((sum, order) => sum + (order.roomsBooked || 0), 0)
    }
  }

  const propertyTitle = booking.property?.title || 'Unknown Property'
  const isCancelled = booking.bookingStatus.toUpperCase() === 'CANCELLED'
  const isSuccessful = booking.bookingStatus.toUpperCase() === 'SUCCESSFUL'

  const handleCardClick = () => {
    if (onClick) {
      onClick(booking.id)
    } else {
      router.push(`/profile/bookings/${booking.id}`)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'cursor-pointer group rounded-xl border border-gray-100 border-l-4 bg-white shadow-sm',
        'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.99]',
        getStatusAccent(booking.bookingStatus),
        isCancelled && 'opacity-70'
      )}
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className="text-sm sm:text-base font-semibold leading-tight text-deep-teal min-w-0 truncate">
            {propertyTitle}
          </h4>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={cn(
              'text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border whitespace-nowrap',
              getStatusBadge(booking.bookingStatus)
            )}>
              {booking.bookingStatus}
            </span>
            {isSuccessful && (
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      'w-3 h-3',
                      booking.rating && star <= booking.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    )}
                    strokeWidth={0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Metadata pills */}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs mb-3 text-gray-500">
          <div className="flex items-center gap-1">
            <Home className="w-3 h-3" />
            <span>{totalRoomsBooked} {totalRoomsBooked === 1 ? 'room' : 'rooms'}</span>
          </div>
          <span className="text-gray-200">·</span>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{nights} {nights === 1 ? 'night' : 'nights'}</span>
          </div>
          {booking.numberOfPets > 0 && (
            <>
              <span className="text-gray-200">·</span>
              <div className="flex items-center gap-1">
                <PawPrint className="w-3 h-3" />
                <span>{booking.numberOfPets} {booking.numberOfPets === 1 ? 'pet' : 'pets'}</span>
              </div>
            </>
          )}
        </div>

        {/* Date section */}
        <div className="flex items-center gap-2 bg-off-white rounded-lg px-3 py-2.5 mb-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-wide text-deep-teal">Check-in</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{checkInDate}</p>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
          <div className="flex-1 min-w-0 text-right">
            <p className="text-[10px] font-medium uppercase tracking-wide text-accent-orange">Check-out</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{checkOutDate}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1.5 text-[11px] text-neutral-gray min-w-0">
            <Clock className="w-3 h-3 shrink-0" />
            <span className="truncate">Booked {createdAt}</span>
          </div>
          <p className="text-sm sm:text-base font-bold text-deep-teal shrink-0 ml-2">
            ฿{booking.totalPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
