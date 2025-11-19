'use client'

import { Button } from '@/components/ui/button'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { propertyTypes } from '../../_constants'
import { StepNavigation } from '../StepNavigation'

export function Step1({ onNext }: { onNext: () => void }) {
  const { formData, updateField } = useAddProperty()

  return (
    <>
      <div className="w-full text-left mt-10">
        <h2 className="text-lg font-semibold text-neutral-gray mb-2">
          Tell us about your space
        </h2>
        <h1 className="text-2xl font-bold mb-6">What type of place is this?</h1>
        <div className="space-y-4">
          {propertyTypes.map((type) => (
            <Button
              key={type.id}
              variant={formData.propertyTypeId === type.id ? 'default' : 'outline'}
              className="w-full justify-start p-6 text-lg"
              onClick={() => updateField('propertyTypeId', type.id)}
            >
              {type.name}
            </Button>
          ))}
        </div>
      </div>
      <StepNavigation onNext={onNext} isNextDisabled={!formData.propertyTypeId} />
    </>
  )
}
