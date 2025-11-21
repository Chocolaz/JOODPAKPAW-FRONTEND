'use client'

import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { StepNavigation } from '../StepNavigation'
import { X } from 'lucide-react'

export function Step6({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { formData, updateField } = useAddProperty()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      updateField('images', [...formData.images, ...files])
    }
  }

  const handleRemoveImage = (index: number) => {
    const updated = formData.images.filter((_, i) => i !== index)
    updateField('images', updated)
  }

  return (
    <>
      <div className="w-full text-center mt-5">
        <h3 className="text-deep-teal text-2xl font-semibold">
          Upload photos of your property
        </h3>
        <p className="mb-6 text-neutral-gray text-sm">
          Add clear photos that help pet parents understand your space
        </p>

        {/* Upload Card */}
        <div className="flex justify-center mb-6">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full max-w-xs aspect-square border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-deep-teal/50 transition-colors bg-white"
          >
            <Image
              src="/graphics/steps/add-photo.svg"
              alt="Add photo icon"
              width={190}
              height={190}
              className="mb-4"
            />
            <span className="text-deep-teal font-medium">
              Click to upload or drag files here
            </span>
            <Input
              id="file-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Preview Grid */}
        {formData.images.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pb-4 max-h-[50vh] overflow-y-auto">
            {formData.images.map((file, index) => (
              <div
                key={index}
                className="relative w-full aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`preview ${index}`}
                  fill
                  className="object-cover"
                />
                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition"
                >
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={formData.images.length === 0}
      />
    </>
  )
}
