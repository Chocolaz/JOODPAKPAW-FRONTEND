'use client'

import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { StepNavigation } from '../StepNavigation'

export function Step6({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateField } = useAddProperty()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      updateField('images', [...formData.images, ...filesArray])
    }
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">Upload photos of your property</h1>
        <div className="space-y-4">
          <Input
            type="file"
            multiple
            onChange={handleImageChange}
            className="p-6 text-lg"
            accept="image/*"
          />
          <div className="grid grid-cols-3 gap-4 mt-4">
            {formData.images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={formData.images.length === 0}
      />
    </>
  )
}
