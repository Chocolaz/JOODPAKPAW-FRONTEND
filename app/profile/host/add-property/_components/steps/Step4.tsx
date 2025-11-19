'use client'

import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { StepNavigation } from '../StepNavigation'

export function Step4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateField } = useAddProperty()

  const isFormValid = () => {
    return formData.title.trim() !== '' && formData.description.trim() !== ''
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">
          What's your property called?
        </h1>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Property Title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="p-6 text-lg"
          />
          <textarea
            placeholder="Property Description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full p-6 text-lg border rounded-md bg-background min-h-[120px]"
          />
        </div>
      </div>
      <StepNavigation onBack={onBack} onNext={onNext} isNextDisabled={!isFormValid()} />
    </>
  )
}
