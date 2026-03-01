'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { createProperty } from '@/lib/api'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { propertyTypes } from '../../_constants'
import { StepNavigation } from '../StepNavigation'
import { CreatePropertyResponse } from '@/types'

export function Step7({ onBack }: { onBack: () => void }) {
  const { formData, updateField, setHighestStepReached } = useAddProperty()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = (await createProperty(formData)) as CreatePropertyResponse
      const propertyId = res?.data?.id
      if (!propertyId) throw new Error('Property ID not returned from server')
      updateField('propertyId', propertyId)
      setHighestStepReached(7)
      router.push('/profile/host/add-property/8')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create property.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const address = [
    formData.address,
    formData.subdistrict,
    formData.district,
    formData.province,
    formData.country,
    formData.zipcode,
  ]
    .filter(Boolean)
    .join(', ')

  const sections = [
    {
      title: 'Basic Information',
      editStep: 4,
      items: [
        { label: 'Title', value: formData.title },
        { label: 'Description', value: formData.description },
        {
          label: 'Property Type',
          value: propertyTypes.find((p) => p.id === formData.propertyTypeId)?.name,
        },
      ],
    },
    {
      title: 'Location',
      editStep: 2,
      items: [
        { label: 'Address', value: address },
        { label: 'Coordinates', value: `${formData.latitude}, ${formData.longitude}` },
      ],
    },
    {
      title: 'Facilities & Media',
      editStep: 5,
      items: [
        { label: 'Facilities', value: `${formData.facilities.length} selected` },
        { label: 'Photos', value: `${formData.images.length} uploaded` },
      ],
    },
  ]

  return (
    <>
      <div className="w-full text-left mt-6 pb-24">
        <h3 className="font-bold mb-1 text-deep-teal">Review your listing</h3>
        <p className="text-neutral-gray text-sm mb-6">
          Tap any section to make changes before submitting.
        </p>

        <div className="space-y-4">
          {sections.map(({ title, editStep, items }) => (
            <section
              key={title}
              className="bg-white rounded-xl border border-neutral-200 px-5 py-4 cursor-pointer hover:bg-neutral-50 transition-colors group"
              onClick={() => {
                setHighestStepReached(editStep)
                router.push(`/profile/host/add-property/${editStep}`)
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-deep-teal">{title}</h4>
                <Pencil className="w-3.5 h-3.5 text-neutral-gray group-hover:text-deep-teal transition-colors" />
              </div>
              {items.map(({ label, value }) => (
                <ReviewItem key={label} label={label} value={value} />
              ))}
            </section>
          ))}
        </div>

        {error && (
          <div className="mt-5 p-3 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm">
            {error}
          </div>
        )}
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

function ReviewItem({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="mb-2.5 last:mb-0">
      <p className="text-xs text-neutral-gray uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-neutral-dark">
        {value || <span className="text-neutral-gray italic">Not set</span>}
      </p>
    </div>
  )
}
