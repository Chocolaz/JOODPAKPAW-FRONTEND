'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createProperty } from '@/lib/api'
import { useAddProperty } from '../../_context/AddPropertyContext'
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to create property.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const address = `${formData.address}, ${formData.subdistrict}, ${formData.district}, ${formData.province}, ${formData.country} ${formData.zipcode}`

  return (
    <>
      <div className="w-full text-left mt-6 pb-24">
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-3 text-deep-teal">
          Review your listing
        </h1>
        <p className="text-neutral-gray mb-6">
          Make sure all details below are correct before publishing.
        </p>

        {/* CARD WRAPPER */}
        <div className="space-y-5">
          {/* Card */}
          <section className="bg-white rounded-xl shadow-sm border border-neutral-200 px-5 py-4">
            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
            <ReviewItem label="Title" value={formData.title} />
            <ReviewItem label="Description" value={formData.description} />
            <ReviewItem
              label="Property Type"
              value={
                propertyTypes.find((p) => p.id === formData.propertyTypeId)
                  ?.name
              }
            />
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-neutral-200 px-5 py-4">
            <h3 className="text-lg font-semibold mb-3">Location</h3>
            <ReviewItem label="Full Address" value={address} />
            <ReviewItem label="Latitude" value={formData.latitude} />
            <ReviewItem label="Longitude" value={formData.longitude} />
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-neutral-200 px-5 py-4">
            <h3 className="text-lg font-semibold mb-3">Facilities & Media</h3>
            <ReviewItem
              label="Facilities"
              value={`${formData.facilities.length} selected`}
            />
            <ReviewItem
              label="Images"
              value={`${formData.images.length} selected`}
            />
          </section>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 p-3 rounded-lg bg-red-50 text-red-600 border border-red-300 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <StepNavigation
        onBack={onBack}
        onNext={handleSubmit}
        isSubmitting={isSubmitting}
        nextText="Submit"
      />
    </>
  )
}

/* -------------------------- COMPONENT -------------------------- */

function ReviewItem({
  label,
  value,
}: {
  label: string
  value: string | undefined
}) {
  return (
    <div className="mb-3">
      <p className="text-sm text-neutral-gray">{label}</p>
      <p className="text-base font-medium text-deep-teal">{value}</p>
    </div>
  )
}
