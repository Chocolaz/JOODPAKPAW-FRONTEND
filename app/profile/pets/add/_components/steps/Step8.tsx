'use client'

import { useState } from 'react'
import Image from 'next/image'
import { StepNavigation } from '@/app/profile/host/add-property/_components/StepNavigation'
import { cn } from '@/lib/utils'
import { useAddPet } from '../../_context/AddPetContext'
import { Baby } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea' // Added Textarea

interface Step8Props {
  onNext: () => void
  onBack: () => void
}

export function Step8({ onNext, onBack }: Step8Props) {
  const { formData, updateField } = useAddPet()
  const petImageSrc =
    formData.petImage instanceof File
      ? URL.createObjectURL(formData.petImage)
      : null

  const handleContactNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField('contactName', e.target.value)
  }

  const handleContactPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Basic phone number formatting (e.g., xxx-xxx-xxxx)
    let value = e.target.value.replace(/\D/g, '') // Remove non-digits
    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + '-' + value.slice(3)
    } else if (value.length > 6) {
      value =
        value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10)
    }
    updateField('contactPhone', value)
  }

  const handlePetNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateField('petNote', e.target.value)
  }

  const isNextDisabled = !formData.contactName || !formData.contactPhone

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
          Who to contact with?
        </h3>
        <p className="mb-4 text-neutral-gray text-sm">
          Add details of the person who takes care of your pet, so others know
          who to contact if needed.
        </p>

        {/* Input Fields */}
        <div className="w-full max-w-xs mx-auto space-y-4">
          <Input
            type="text"
            placeholder="Person name*"
            value={formData.contactName || ''}
            onChange={handleContactNameChange}
          />
          <Input
            type="tel"
            placeholder="Your telephone number*"
            value={formData.contactPhone || ''}
            onChange={handleContactPhoneChange}
            maxLength={12} // xxx-xxx-xxxx
          />
          <Textarea
            placeholder="Anything about the pet (optional)"
            value={formData.petNote || ''}
            onChange={handlePetNoteChange}
            rows={4}
          />
        </div>
      </div>

      <StepNavigation
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={isNextDisabled}
      />
    </div>
  )
}
