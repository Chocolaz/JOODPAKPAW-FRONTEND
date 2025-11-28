'use client'

import { useAddProperty } from '../../_context/AddPropertyContext'
import { StepNavigation } from '../StepNavigation'
import { ImageManager } from '@/app/_components/ImageManager'
import { PropertyImage } from '@/types'

export function Step6({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { formData, updateField } = useAddProperty()

  const handleImagesChange = (files: File[]) => {
    updateField('images', files)
  }

  const handleExistingImagesChange = (images: PropertyImage[]) => {
    // Not used in Step 6 as we only have new files
  }

  return (
    <>
      <div className="w-full text-center mt-5">
        <h3 className="text-deep-teal text-2xl font-semibold">
          Upload photos of your property
        </h3>
        <p className="mb-4 text-neutral-gray text-sm">
          Add clear photos that help pet parents understand your space
        </p>

        <ImageManager
          existingImages={[]}
          newFiles={formData.images}
          onExistingImagesChange={handleExistingImagesChange}
          onNewFilesChange={handleImagesChange}
        />
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={formData.images.length === 0}
      />
    </>
  )
}
