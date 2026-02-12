'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { StepNavigation } from '@/app/profile/host/add-property/_components/StepNavigation'
import { cn } from '@/lib/utils'
import { useAddPet } from '../../_context/AddPetContext'
import { Baby, Zap } from 'lucide-react'
import { Input } from '@/components/ui/input'


interface Step7Props {
  onNext: () => void
  onBack: () => void
}

export function Step7({ onNext, onBack }: Step7Props) {
  const { formData, updateField } = useAddPet()
  const petImageSrc = formData.petImage instanceof File ? URL.createObjectURL(formData.petImage) : null
  
  const activityLevels = [1, 2, 3, 4, 5]

  return (
    <div className="flex flex-col flex-grow w-full">
      <div className="w-full text-center mt-5">
        {/* Pet Image Display */}
        <div className="flex justify-center mb-8">
          <div
            className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border relative',
              petImageSrc ? 'border-positive-green' : 'border-deep-teal'
            )}
          >
            {petImageSrc ? (
              <Image
                src={petImageSrc}
                alt={formData.petName || 'Pet image'}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <Baby className="w-16 h-16 text-gray-500" />
            )}
          </div>
        </div>

        <h3 className="text-deep-teal text-2xl font-semibold">
          How active is your pet in daily life?
        </h3>
        <p className="mb-4 text-neutral-gray text-sm">
          How energetic is your pet on a daily basis? (calm, to very active)
        </p>

        {/* Activity Level Selection */}
        <div className="flex justify-center gap-2 mb-8">
          {activityLevels.map((level) => (
            <Zap // Changed from Lightning
              key={level}
              className={cn(
                'w-10 h-10 cursor-pointer transition-colors',
                formData.petActivityLevel && formData.petActivityLevel >= level
                  ? 'text-accent-orange'
                  : 'text-gray-300'
              )}
              onClick={() => updateField('petActivityLevel', level)}
              fill={formData.petActivityLevel && formData.petActivityLevel >= level ? 'currentColor' : 'none'}
            />
          ))}
        </div>
      </div>

      <StepNavigation
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={!formData.petActivityLevel}
      />
    </div>
  )
}
