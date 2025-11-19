'use client'

import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { StepNavigation } from '../StepNavigation'

export function Step2({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { formData, updateField } = useAddProperty()

  return (
    <>
      <div className="w-full text-center mt-5">
        <h3 className="text-deep-teal">Where is your property located?</h3>
        <p className="mb-6 text-neutral-gray text-sm">
          Drag the marker or search to your property’s location on the map.
        </p>

        <div className="space-y-4 pb-4">
          <Input
            type="number"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={(e) => updateField('latitude', e.target.value)}
            className="p-6 text-lg"
          />
          <Input
            type="number"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={(e) => updateField('longitude', e.target.value)}
            className="p-6 text-lg"
          />
        </div>
      </div>
      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={!formData.latitude || !formData.longitude}
      />
    </>
  )
}
