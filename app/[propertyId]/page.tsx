'use client'

import { getPropertyById } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { PropertyDetailView } from '@/app/_components/PropertyDetailView'
import { usePropertyLoader } from '@/app/_hooks/usePropertyLoader'

export default function PropertyDetailPage() {
  const { property, loading, error } = usePropertyLoader(getPropertyById)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  if (error) return <ErrorState error={error} />
  if (!property) return <ErrorState error="Property not found." />

  return <PropertyDetailView property={property} />
}