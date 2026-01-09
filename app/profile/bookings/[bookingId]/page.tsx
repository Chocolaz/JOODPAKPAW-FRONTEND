'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getBookingById, cancelBooking } from '@/lib/api'
import { FullBookingDetail } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import BookingDetailDisplay from './_components/BookingDetailDisplay'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/app/_components/ConfirmationModal'

export default function BookingDetailPage() {
  const { bookingId } = useParams()
  const [bookingDetails, setBookingDetails] =
    useState<FullBookingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleBookingUpdate = (updatedFields: Partial<FullBookingDetail>) => {
    setBookingDetails((prevDetails) =>
      prevDetails ? { ...prevDetails, ...updatedFields } : null
    )
  }

  const handleCancelBooking = async () => {
    setIsCancelling(true)
    try {
      if (bookingId) {
        await cancelBooking(bookingId as string)
        toast.success('Booking cancelled successfully.')
        handleBookingUpdate({ bookingStatus: 'cancelled' }) // Update local state
        setIsCancelModalOpen(false)
      }
    } catch (error) {
      toast.error('Failed to cancel booking.')
      console.error(error)
    } finally {
      setIsCancelling(false)
    }
  }

  useEffect(() => {
    if (bookingId) {
      const fetchBookingDetails = async () => {
        try {
          setIsLoading(true)
          const data = await getBookingById(bookingId as string)
          setBookingDetails(data)
        } catch (err) {
          console.error('Failed to fetch booking details:', err)
          setError('Failed to load booking details.')
          toast.error('Failed to load booking details.')
        } finally {
          setIsLoading(false)
        }
      }
      fetchBookingDetails()
    }
  }, [bookingId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>{error}</p>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p>No booking details found.</p>
      </div>
    )
  }

  const isCancellable =
    bookingDetails.bookingStatus.toUpperCase() !== 'CANCELLED'

  return (
    <>
      <BookingDetailDisplay bookingDetails={bookingDetails} />

      {isCancellable && (
        <div className="container mx-auto max-w-[550px] px-6 py-4">
          <Button
            className="w-full text-lg h-12 bg-white text-red-700 border border-red-200"
            onClick={() => setIsCancelModalOpen(true)}
            disabled={isCancelling}
          >
            {isCancelling ? <Spinner className="size-4 mr-2" /> : null}
            Cancel Booking
          </Button>
        </div>
      )}

      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelBooking}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        titleClassName="text-destructive"
        confirmButtonClassName="bg-destructive hover:bg-destructive/90"
      />
    </>
  )
}
