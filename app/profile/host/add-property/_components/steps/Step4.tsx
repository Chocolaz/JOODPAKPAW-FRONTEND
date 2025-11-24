'use client'

import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { StepNavigation } from '../StepNavigation'

export function Step4({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { formData, updateField } = useAddProperty()

  const isFormValid = () => {
    return formData.title.trim() !== '' && formData.description.trim() !== ''
  }

  return (
    <>
      <div className="w-full text-center mt-10">
        <h3 className="text-deep-teal">What’s your property called?</h3>
        <p className="mb-6 text-neutral-gray text-sm">
          Make it easy for pet parents to recognize your space
        </p>

        <div className="space-y-4 pb-4 text-left">
          <p className="text-sm font-medium text-deep-teal mb-1">Title</p>
          <Input
            type="text"
            placeholder="Property Title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="p-6 text-lg w-full"
          />

          <p className="font-medium text-deep-teal mb-1">Description</p>
          <Textarea
            placeholder="Property Description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="p-6 text-lg min-h-40 w-full resize-none"
          />
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={!isFormValid()}
      />
    </>
  )
}
