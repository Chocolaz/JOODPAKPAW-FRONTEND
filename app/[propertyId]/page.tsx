'use client'

import { getPropertyById } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { usePropertyLoader } from '@/app/_hooks/usePropertyLoader'
import { PropertyImageGallery } from '@/app/_components/property-detail/PropertyImageGallery'
import { PropertyHeader } from '@/app/_components/property-detail/PropertyHeader'
import { PropertyFacilities } from '@/app/_components/property-detail/PropertyFacilities'
import { PropertyLocation } from '@/app/_components/property-detail/PropertyLocation'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Share2 } from 'lucide-react'

export default function PropertyDetailPage() {
  const { property, loading, error } = usePropertyLoader(getPropertyById)
  const router = useRouter()

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href, // Current page URL
        })
        console.log('Shared successfully')
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log(
        'Web Share API not supported or property data not available. URL:',
        window.location.href
      )
      // Could implement a copy-to-clipboard or custom share modal here
    }
  }

  if (loading) {
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
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-gray-100 transition"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="fixed top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-gray-100 transition"
      >
        <Share2 className="w-6 h-6 text-gray-800" />
      </button>

      <PropertyImageGallery images={property.images} />

      <div className="px-4 sm:px-0">
        <PropertyHeader property={property} />
        <PropertyFacilities
          facilities={property.facilities}
          description={property.description}
        />
        <PropertyLocation property={property} />
      </div>
    </div>
  )
}
