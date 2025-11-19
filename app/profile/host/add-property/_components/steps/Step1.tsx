'use client'

import { Button } from '@/components/ui/button'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { propertyTypes } from '../../_constants'
import { StepNavigation } from '../StepNavigation'

export function Step1({ onNext }: { onNext: () => void }) {
  const { formData, updateField } = useAddProperty()

  return (
    <>
      <div className="w-full text-center mt-5">
        <h3 className="text-deep-teal">What type of place is this?</h3>
        <p className="mb-6 text-neutral-gray">
          Choose the kind of space where pets will stay
        </p>

        <div className="space-y-4">
          {propertyTypes.map((type) => (
            <Button
              key={type.id}
              variant={
                formData.propertyTypeId === type.id ? 'default' : 'outline'
              }
              className="w-full justify-start p-6 text-lg"
              onClick={() => updateField('propertyTypeId', type.id)}
            >
              {type.name}
            </Button>
          ))}
        </div>
      </div>
      <StepNavigation
        onNext={onNext}
        isNextDisabled={!formData.propertyTypeId}
      />
    </>
  )
}
