'use client'

import { getHostPropertyById, updateHostPropertyIsActive } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { usePropertyLoader } from '@/app/_hooks/usePropertyLoader'
import { PropertyImageGallery } from '@/app/_components/property-detail/PropertyImageGallery'
import { PropertyHeader } from '@/app/_components/property-detail/PropertyHeader'
import { PropertyFacilities } from '@/app/_components/property-detail/PropertyFacilities'
import { PropertyLocation } from '@/app/_components/property-detail/PropertyLocation'
import { useRouter } from 'next/navigation'
import { PageHeaderButtons } from '@/app/_components/property-detail/PageHeaderButtons'
import { toast } from 'sonner'
import { useState } from 'react'
import { ConfirmationModal } from '@/app/_components/ConfirmationModal' // New import

export default function HostPropertyDetailPage() {
  const { property, loading, error, refreshProperty } =
    usePropertyLoader(getHostPropertyById)
  const router = useRouter()
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false) // New state for modal

  const handleShare = async () => {
    if (navigator.share && property) {
      const publicUrl = `${window.location.origin}/${property.id}`
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: publicUrl,
        })
        console.log('Shared successfully')
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      const publicUrl = `${window.location.origin}/${property?.id}`
      console.log(
        'Web Share API not supported or property data not available. Public URL:',
        publicUrl
      )
    }
  }

  // New function to handle the actual status update after confirmation
  const confirmGlobeAction = async () => {
    if (!property || isUpdatingStatus) return

    setShowConfirmationModal(false) // Close modal immediately
    setIsUpdatingStatus(true)
    try {
      const newStatus = !property.isActive
      await updateHostPropertyIsActive(property.id.toString(), newStatus)
      toast.success(
        `Property successfully ${newStatus ? 'published' : 'unpublished'}.`
      )
      refreshProperty() // Re-fetch property data to update UI
    } catch (err) {
      console.error('Failed to update property status:', err)
      toast.error('Failed to update property status. Please try again.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Modified handleGlobeClick to open modal
  const handleGlobeClick = () => {
    if (!property) return
    setShowConfirmationModal(true)
  }

  const handleBack = () => router.push('/profile/host')

  if (loading || isUpdatingStatus) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  if (error) return <ErrorState error={error} />
  if (!property) return <ErrorState error="Property not found." />

  const modalTitle = property.isActive
    ? 'Unpublish This Property?'
    : 'Publish This Property?'
  const modalMessage = property.isActive
    ? `Are you sure you want to unpublish "${property.title}"?<br />It will no longer be visible to the public.`
    : `Are you sure you want to publish "${property.title}"?<br />It will become visible to the public.`

  return (
    <div className="max-w-4xl mx-auto pb-24 relative">
      <PageHeaderButtons
        onBackClick={handleBack}
        onShareClick={handleShare}
        onEditClick={() => console.log('Edit clicked')}
        onGlobeClick={handleGlobeClick}
        isPropertyActive={property.isActive}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={confirmGlobeAction}
        title={modalTitle}
        message={modalMessage}
        titleClassName="text-deep-teal"
        confirmButtonClassName={
          property.isActive ? 'bg-accent-orange' : 'bg-positive-green'
        }
      />

      <PropertyImageGallery images={property.images} />

      <div className="px-4 sm:px-0">
        <PropertyHeader property={property} />
        <PropertyFacilities
          facilities={property.facilities}
          description={property.description}
        />

        {/* Host-specific content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-10 border-t pt-8">
          <div className="p-4 border rounded-xl shadow-sm bg-white">
            <p className="text-gray-500 text-sm">Base Price</p>
            <p className="text-xl font-semibold text-emerald-700">
              THB {property.roomCategory?.basePrice || 'N/A'} / night
            </p>
          </div>

          <div className="p-4 border rounded-xl shadow-sm bg-white">
            <p className="text-gray-500 text-sm">Property Type</p>
            <p className="text-lg font-medium mt-1 capitalize">
              {property.propertyType?.name.replace(/_/g, ' ')}
            </p>
          </div>

          <div className="p-4 border rounded-xl shadow-sm bg-white">
            <p className="text-gray-500 text-sm">Created At</p>
            <p className="text-lg mt-1">{property.createdAt}</p>
          </div>
        </div>

        <div className="border-t pt-8">
          <h2 className="text-xl font-semibold mb-3 text-gray-900">
            Host Information
          </h2>

          <p className="text-gray-700">
            Host ID: <span className="font-medium">{property.hostId}</span>
            <br />
          </p>
        </div>

        <PropertyLocation property={property} />
      </div>
    </div>
  )
}
