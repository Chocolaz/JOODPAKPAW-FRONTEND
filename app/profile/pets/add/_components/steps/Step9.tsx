'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { StepNavigation } from '@/app/profile/host/add-property/_components/StepNavigation'
import { cn } from '@/lib/utils'
import { useAddPet } from '../../_context/AddPetContext'
import { createPetProfile } from '@/lib/api'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { Baby } from 'lucide-react'

interface Step9Props {
  onBack: () => void
}

export function Step9({ onBack }: Step9Props) {
  const { formData, clearAddPetSession } = useAddPet()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const petImageSrc = formData.petImage instanceof File ? URL.createObjectURL(formData.petImage) : null

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    
    // Create FormData
    const apiFormData = new FormData()
    if (formData.petName) apiFormData.append('name', formData.petName)
    if (formData.petImage) apiFormData.append('image', formData.petImage)
    if (formData.petBirthDate) apiFormData.append('birthDate', formData.petBirthDate)
    if (formData.petGender) apiFormData.append('sex', formData.petGender)
    if (formData.petTypeId) apiFormData.append('petId', String(formData.petTypeId))
    if (formData.petBreedId) apiFormData.append('petBreedId', String(formData.petBreedId))
    if (formData.petSizeCategoryId) apiFormData.append('petSizeId', String(formData.petSizeCategoryId))
    if (formData.petActivityLevel) apiFormData.append('petEnergyId', String(formData.petActivityLevel))
    if (formData.contactName) apiFormData.append('contactName', formData.contactName)
    if (formData.contactPhone) apiFormData.append('contactPhone', formData.contactPhone)
    if (formData.petNote) apiFormData.append('note', formData.petNote)
    
    try {
      await createPetProfile(apiFormData)
      toast.success('Pet profile created successfully!')
      clearAddPetSession()
      router.push('/profile/pets')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const summaryData = [
    { label: 'Name', value: formData.petName },
    { label: 'Birth Date', value: formData.petBirthDate },
    { label: 'Gender', value: formData.petGender },
    { label: 'Contact Name', value: formData.contactName },
    { label: 'Contact Phone', value: formData.contactPhone },
    { label: 'Activity Level', value: `${formData.petActivityLevel}/5` },
    { label: 'Note', value: formData.petNote },
  ]
  
  return (
    <div className="flex flex-col flex-grow w-full">
      <div className="w-full text-center mt-5">
        <h3 className="text-deep-teal text-2xl font-semibold">
          Review and Submit
        </h3>
        <p className="mb-4 text-neutral-gray text-sm">
          Please review the details below before submitting.
        </p>

        {/* Pet Image */}
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

        {/* Summary Data */}
        <div className="text-left max-w-sm mx-auto space-y-2">
          {summaryData.map(item => item.value ? (
            <div key={item.label} className="flex justify-between">
              <span className="font-semibold text-neutral-gray">{item.label}:</span>
              <span className="text-neutral-dark">{item.value}</span>
            </div>
          ) : null)}
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}
        
        {isLoading && (
          <div className="flex justify-center mt-4">
            <Spinner />
          </div>
        )}

      </div>

      <StepNavigation
        onNext={handleSubmit}
        onBack={onBack}
        isNextDisabled={isLoading}
        nextText="Submit"
      />
    </div>
  )
}
