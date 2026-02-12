'use client'

import { useState } from 'react'
import Image from 'next/image'
import { StepNavigation } from '@/app/profile/host/add-property/_components/StepNavigation'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAddPet } from '../../_context/AddPetContext'
import { CameraIcon, Dog, Cat } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Step3Props {
  onNext: () => void
  onBack: () => void
}

export function Step3({ onNext, onBack }: Step3Props) {
  const { formData, updateField } = useAddPet()
  const [imagePreview, setImagePreview] = useState<string | null>(
    formData.petImage instanceof File
      ? URL.createObjectURL(formData.petImage)
      : null
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      updateField('petImage', file)
      setImagePreview(URL.createObjectURL(file))
    } else {
      updateField('petImage', null)
      setImagePreview(null)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('petName', e.target.value)
  }

  const isNextDisabled = !formData.petName || !formData.petImage

  const renderDefaultIcon = () => {
    if (formData.petTypeId === 1) {
      return <Dog className="w-16 h-16 text-neutral-gray" />
    } else if (formData.petTypeId === 2) {
      return <Cat className="w-16 h-16 text-neutral-gray" />
    } else {
      return <CameraIcon className="w-16 h-16 text-gray-500" />
    }
  }

  return (
    <div className="flex flex-col grow w-full">
      <div className="w-full text-center mt-5">
        <div className="flex justify-center mb-8">
          <label htmlFor="pet-image-upload" className="relative cursor-pointer">
            <div
              className={cn(
                'w-40 h-40 rounded-full flex items-center justify-center overflow-hidden border relative',
                imagePreview ? 'border-positive-green' : 'border-gray-300'
              )}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Pet preview"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                renderDefaultIcon()
              )}
            </div>
            <input
              id="pet-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Button
              type="button"
              size="icon"
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-deep-teal flex items-center justify-center"
              onClick={() =>
                document.getElementById('pet-image-upload')?.click()
              }
            >
              <CameraIcon className="w-5 h-5" />
            </Button>
          </label>
        </div>

        <h4 className="text-deep-teal text-lg font-semibold mb-2">
          What's your pet's name?
        </h4>
        <Input
          placeholder="Your pet's name"
          value={formData.petName || ''}
          onChange={handleNameChange}
          className="max-w-xs mx-auto"
        />
      </div>

      <StepNavigation
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={isNextDisabled}
      />
    </div>
  )
}
