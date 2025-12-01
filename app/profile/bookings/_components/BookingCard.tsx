import { Booking } from '@/types/booking'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

interface BookingCardProps {
  booking: Booking
}

export function BookingCard({ booking }: BookingCardProps) {
  const checkInDate = format(new Date(booking.checkInDate), 'MMM dd, yyyy')
  const checkOutDate = format(new Date(booking.checkOutDate), 'MMM dd, yyyy')
  const createdAt = format(new Date(booking.createdAt), 'MMM dd, yyyy HH:mm')

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Booking ID: {booking.id}</span>
          <Badge
            className={`capitalize ${
              booking.bookingStatus === 'pending'
                ? 'bg-yellow-500'
                : booking.bookingStatus === 'confirmed'
                  ? 'bg-green-500'
                  : 'bg-red-500'
            }`}
          >
            {booking.bookingStatus}
          </Badge>
        </CardTitle>
        <p className="text-sm text-gray-500">Property: {booking.property.title}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p>
              <strong>Check-in:</strong> {checkInDate}
            </p>
            <p>
              <strong>Check-out:</strong> {checkOutDate}
            </p>
            <p>
              <strong>Number of Pets:</strong> {booking.numberOfPets}
            </p>
          </div>
          <div>
            <p>
              <strong>Total Price:</strong> ฿{booking.totalPrice.toLocaleString()}
            </p>
            <p>
              <strong>Booked On:</strong> {createdAt}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <strong>Room Categories:</strong>
          <ul className="list-disc pl-5">
            {booking.property.roomCategories.map((room) => (
              <li key={room.id}>
                {room.name} (Rooms Booked: {room.roomsBooked})
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
