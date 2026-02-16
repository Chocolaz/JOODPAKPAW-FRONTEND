'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { createBooking, confirmPayment } from '@/lib/api'
import { ApiError } from '@/lib/errorHandling'
import { BookingDetail } from '@/types'
import { cn } from '@/lib/utils'
import { CheckCircle, CreditCard, Clock } from 'lucide-react'

interface PaymentSectionProps {
  bookingDetails: BookingDetail
  isBookingLoading: boolean
  setIsBookingLoading: (loading: boolean) => void
}

const mockCreditCards = [
  {
    id: 1,
    brand: 'Visa',
    last4: '1234',
    cardholderName: 'John Doe',
    expiryDate: '12/25',
  },
  {
    id: 2,
    brand: 'MasterCard',
    last4: '5678',
    cardholderName: 'Jane Smith',
    expiryDate: '08/26',
  },
]

export default function PaymentSection({
  bookingDetails,
  isBookingLoading,
  setIsBookingLoading,
}: PaymentSectionProps) {
  const router = useRouter()
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [paymentState, setPaymentState] = useState<
    'idle' | 'booking' | 'processing' | 'success'
  >('idle')

  const handlePayLater = async () => {
    setIsBookingLoading(true)
    setPaymentState('booking')

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

      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPaymentState('success')
      toast.success('Booking created! You can pay later.')

      setTimeout(() => {
        router.push('/profile/bookings')
      }, 1500)
    } catch (err) {
      console.error('Booking failed:', err)
      let errorMessage = 'Booking failed. Please try again.'
      if (err instanceof ApiError) {
        errorMessage = err.message
      }
      toast.error(errorMessage)
      setPaymentState('idle')
    } finally {
      if (paymentState !== 'success') {
        setIsBookingLoading(false)
      }
    }
  }

  const handlePayment = async () => {
    if (!selectedCard) return
    setIsBookingLoading(true)
    setPaymentState('processing')

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

      const booking = await createBooking(body)
      const bookingId = booking.id

      await confirmPayment(bookingId)

      // Add a simulated delay to make the loader appear longer
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setPaymentState('success')
      toast.success('Payment successful and booking confirmed!')

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/profile/bookings')
      }, 1500)
    } catch (err) {
      console.error('Payment failed:', err)
      let errorMessage = 'Payment failed. Please try again.'
      if (err instanceof ApiError) {
        errorMessage = err.message
      }
      toast.error(errorMessage)
      setPaymentState('idle')
    } finally {
      if (paymentState !== 'success') {
        setIsBookingLoading(false)
      }
    }
  }

  return (
    <div className="relative">
      <>
        {paymentState !== 'idle' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center flex flex-col items-center gap-4">
              {paymentState === 'booking' && (
                <>
                  <Spinner className="w-16 h-16" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Creating Booking...
                  </h3>
                  <p className="text-gray-600">
                    Please wait, we&apos;re reserving your spot.
                  </p>
                </>
              )}
              {paymentState === 'processing' && (
                <>
                  <Spinner className="w-16 h-16" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Processing Payment...
                  </h3>
                  <p className="text-gray-600">
                    Please wait, we&apos;re securing your transaction.
                  </p>
                </>
              )}
              {paymentState === 'success' && (
                <>
                  <div>
                    <CheckCircle className="w-16 h-16 text-positive-green" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Booking Confirmed!
                  </h3>
                  <p className="text-gray-600">Redirecting to your bookings...</p>
                </>
              )}
            </div>
          </div>
        )}
      </>

      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="text-deep-teal text-sm font-semibold uppercase tracking-wide">
            Payment Method
          </h4>
          <div className="grid gap-4">
            {mockCreditCards.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card.id)}
                className={cn(
                  'p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer bg-white shadow-sm',
                  {
                    'border-positive-green scale-105 shadow-lg':
                      selectedCard === card.id,
                    'border-gray-200 hover:border-gray-300 hover:shadow-md':
                      selectedCard !== card.id,
                  }
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{card.brand}</p>
                    <p className="text-sm text-neutral-gray">
                      **** **** **** {card.last4}
                    </p>
                  </div>
                  <CreditCard className="w-6 h-6 text-gray-400" />
                </div>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-neutral-gray">Card Holder</p>
                    <p className="font-medium text-sm text-gray-700">
                      {card.cardholderName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-gray">Expires</p>
                    <p className="font-medium text-sm text-gray-700">
                      {card.expiryDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 backdrop-blur-xl bg-white/85 border-t shadow-2xl rounded-t-3xl py-5 px-6 z-40">
          <div className="max-w-[500px] mx-auto flex gap-3">
            <Button
              onClick={handlePayLater}
              disabled={isBookingLoading}
              variant="outline"
              className="h-14 flex-1 text-base font-semibold border-gray-300"
            >
              {isBookingLoading ? (
                <Spinner />
              ) : (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Pay Later
                </>
              )}
            </Button>
            <Button
              onClick={handlePayment}
              disabled={!selectedCard || isBookingLoading}
              className="bg-positive-green h-14 flex-[2] text-base text-white font-semibold"
            >
              {isBookingLoading ? <Spinner /> : 'Pay Now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
