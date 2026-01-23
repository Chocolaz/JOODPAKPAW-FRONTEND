'use client'

import { getPropertyById } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { usePropertyLoader } from '@/app/_hooks/usePropertyLoader'
import { PropertyImageGallery } from '@/app/_components/property-detail/PropertyImageGallery'
import { PropertyHeader } from '@/app/_components/property-detail/PropertyHeader'
import { PropertyFacilities } from '@/app/_components/property-detail/PropertyFacilities'
import { PropertyLocation } from '@/app/_components/property-detail/PropertyLocation'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeaderButtons } from '@/app/_components/property-detail/PageHeaderButtons'
import { PropertyRoomCategories } from '@/app/_components/property-detail/PropertyRoomCategories'
import { normalizeRoomCategories } from '@/lib/utils'
import { BookingDrawer } from '@/app/_components/property-detail/BookingDrawer'

export default function PropertyDetailPage() {
  const { property, loading, error, refreshProperty } =
    usePropertyLoader(getPropertyById)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: `${window.location.origin}/${property.id}`,
        })
        console.log('Shared successfully')
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      console.log(
        'Web Share API not supported or property data not available. URL:',
        `${window.location.origin}/${property?.id}`
      )
    }
  }

  const handleBack = () => {
    const fromBookings = searchParams.get('fromBookings')
    const bookingId = searchParams.get('bookingId')
    const fromFavorites = searchParams.get('fromFavorites')
    const folderId = searchParams.get('folderId')

    if (fromBookings === 'true' && bookingId) {
      router.push(`/profile/bookings/${bookingId}`)
    } else if (fromBookings === 'true') {
      router.push('/profile/bookings')
    } else if (fromFavorites === 'true' && folderId) {
      router.push(`/favorites/${folderId}`)
    } else if (fromFavorites === 'true') {
      router.push('/favorites')
    } else {
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  if (error) return <ErrorState message={error} />
  if (!property) return <ErrorState message="Property not found." />

  const roomCategoriesArray = normalizeRoomCategories(property.roomCategories)

  return (
    <div className="max-w-4xl mx-auto pb-24 relative">
      <PageHeaderButtons onBackClick={handleBack} onShareClick={handleShare} />
      <PropertyImageGallery images={property.images} />

      <div className="px-4 sm:px-0">
        <PropertyHeader property={property} />
        <PropertyFacilities
          facilities={property.facilities}
          description={property.description}
        />
        <PropertyRoomCategories
          propertyId={property.id}
          roomCategories={roomCategoriesArray}
          onDeleteSuccess={refreshProperty}
          showDeleteButton={false}
        />
        <PropertyLocation property={property} />
      </div>

      {/* Sticky Footer */}
      <BookingDrawer propertyId={property.id} />
    </div>
  )
}
