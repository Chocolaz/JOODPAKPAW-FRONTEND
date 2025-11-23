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
import { toast } from 'sonner' // Added toast import
import { useState } from 'react' // Added useState import for isUpdating

export default function HostPropertyDetailPage() {
  const { property, loading, error, refreshProperty } =
    usePropertyLoader(getHostPropertyById) // Destructure refreshProperty
  const router = useRouter()
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false) // State for globe button loading

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

  const handleGlobeClick = async () => {
    if (!property || isUpdatingStatus) return

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

  const handleBack = () => router.push('/profile/host')

  if (loading || isUpdatingStatus) {
    // Check both loading states
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  if (error) return <ErrorState error={error} />
  if (!property) return <ErrorState error="Property not found." />

  return (
    <div className="max-w-4xl mx-auto pb-24 relative">
      <PageHeaderButtons
        onBackClick={handleBack}
        onShareClick={handleShare}
        onEditClick={() => console.log('Edit clicked')}
        onGlobeClick={handleGlobeClick}
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
          </p>
        </div>

        <PropertyLocation property={property} />
      </div>
    </div>
  )
}
