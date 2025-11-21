'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { getHostPropertyById } from '@/lib/api'
import { Property } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'

export default function HostPropertyDetailPage() {
  const params = useParams()
  const propertyId = params.propertyId as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!propertyId) return

    const fetchProperty = async () => {
      try {
        setLoading(true)
        const response = await getHostPropertyById(propertyId)
        setProperty(response.property)
        setError(null)
      } catch (err) {
        setError('Failed to fetch property details. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      )
    }

    if (error) {
      return <ErrorState error={error} />
    }

    if (!property) {
      return <ErrorState error="Property not found." />
    }

    const imagePath = property.images?.[0]?.filePath
    let mainImage = '/graphics/no-image.svg'
    if (imagePath) {
      let url = imagePath
      if (url.startsWith('http://') || url.startsWith('https://')) {
        mainImage = url
      } else {
        url = url.replace(/^(https?:)?\/*/, '')
        mainImage = `http://${url}`
      }
      mainImage = mainImage.replace(/(?<!:)\/\//g, '/')
    }

    return (
      <div className="p-4">
        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
          <Image
            src={mainImage}
            alt={property.title}
            fill
            unoptimized={true}
            className="object-cover"
          />
        </div>
        <h1 className="text-2xl font-bold text-deep-teal mb-2">
          {property.title}
        </h1>
        <p className="text-neutral-gray mb-1">
          {property.district}, {property.province}
        </p>
        <p className="text-lg font-semibold text-deep-teal mb-4">
          THB {property.roomCategory?.basePrice || 'N/A'}
        </p>
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold text-deep-teal mb-2">
            Description
          </h2>
          <p className="text-neutral-dark">{property.description}</p>
        </div>
      </div>
    )
  }

  return <div>{renderContent()}</div>
}
