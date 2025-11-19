'use client'

import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { StepNavigation } from '../StepNavigation'

export function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateField } = useAddProperty()

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">
          Where is your property located?
        </h1>
        <div className="space-y-4">
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
