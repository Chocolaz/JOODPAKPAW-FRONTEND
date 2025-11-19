'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProperty } from '@/lib/api'
import { useAddProperty }
from '../../_context/AddPropertyContext'
import { propertyTypes } from '../../_constants'
import { StepNavigation } from '../StepNavigation'

export function Step7({ onBack }: { onBack: () => void }) {
  const { formData } = useAddProperty()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await createProperty(formData)
      router.push('/profile/host/add-property/8')
    } catch (err: any) {
      setError(err.message || 'Failed to create property.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">Review your listing</h1>
        <div className="space-y-4">
          <div><strong>Title:</strong> {formData.title}</div>
          <div><strong>Description:</strong> {formData.description}</div>
          <div><strong>Property Type:</strong> {propertyTypes.find(p => p.id === formData.propertyTypeId)?.name}</div>
          <div><strong>Address:</strong> {`${formData.address}, ${formData.subdistrict}, ${formData.district}, ${formData.province}, ${formData.country} ${formData.zipcode}`}</div>
          <div><strong>Location:</strong> Lat: {formData.latitude}, Long: {formData.longitude}</div>
          <div><strong>Facilities:</strong> {formData.facilities.length} selected</div>
          <div><strong>Images:</strong> {formData.images.length} selected</div>
        </div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
      <StepNavigation
        onBack={onBack}
        onNext={handleSubmit}
        isSubmitting={isSubmitting}
        nextText="Submit"
      />
    </>
  )
}
