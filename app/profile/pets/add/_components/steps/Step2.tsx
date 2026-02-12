'use client'

import { useEffect, useState } from 'react'
import { useAddPet } from '../../_context/AddPetContext'
import { StepNavigation } from '@/app/profile/host/add-property/_components/StepNavigation'
import { cn } from '@/lib/utils'
import { getPetBreeds } from '@/lib/api'
import { PetBreed } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

interface Step2Props {
  onNext: () => void
  onBack: () => void
}

export function Step2({ onNext, onBack }: Step2Props) {
  const { formData, updateField } = useAddPet()
  const [breeds, setBreeds] = useState<PetBreed[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!formData.petTypeId) {
      setError('Pet type not selected.')
      setLoading(false)
      return
    }

    const fetchBreeds = async () => {
      try {
        setLoading(true)
        const response = await getPetBreeds(formData.petTypeId!)
        setBreeds(response.petBreeds)
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch pet breeds.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchBreeds()
  }, [formData.petTypeId])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const filteredBreeds = breeds.filter((breed) =>
    breed.breed.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="flex flex-col grow w-full">
      <div className="w-full text-center mt-5">
        <h3 className="text-deep-teal text-2xl font-semibold">
          What breed is your pet?
        </h3>
        <p className="mb-4 text-neutral-gray text-sm">
          Select the breed of your pet.
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search for a breed..."
            className="pl-10 rounded-full"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="overflow-y-auto hide-scrollbar mt-4 grow h-[450px]">
        <div className="grid grid-cols-2 gap-4 p-1 pb-4">
          {filteredBreeds.map((breed) => {
            const isSelected = formData.petBreedId === breed.id
            return (
              <button
                key={breed.id}
                onClick={() => updateField('petBreedId', breed.id)}
                className={cn(
                  'flex items-center justify-center p-4 border rounded-lg shadow-sm cursor-pointer transition-colors bg-white h-24',
                  isSelected
                    ? 'border-positive-green'
                    : 'border-gray-200 hover:border-deep-teal/50'
                )}
              >
                <span
                  className={cn(
                    'text-center font-medium',
                    isSelected ? 'text-positive-green' : 'text-neutral-dark'
                  )}
                >
                  {breed.breed}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <StepNavigation
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={!formData.petBreedId}
      />
    </div>
  )
}
