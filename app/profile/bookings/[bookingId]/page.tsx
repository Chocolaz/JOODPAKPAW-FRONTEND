'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getBookingById } from '@/lib/api'
import { FullBookingDetail } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import BookingDetailDisplay from './_components/BookingDetailDisplay'
import { PageHeader } from '@/app/_components/PageHeader'

export default function BookingDetailPage() {
  const { bookingId } = useParams()
  const [bookingDetails, setBookingDetails] = useState<FullBookingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        <PageHeader title="Booking Details" />
        <p>{error}</p>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <PageHeader title="Booking Details" />
        <p>No booking details found.</p>
      </div>
    )
  }

  return (
    <>
      <PageHeader title="Booking Details" />
      <BookingDetailDisplay bookingDetails={bookingDetails} />
    </>
  )
}
