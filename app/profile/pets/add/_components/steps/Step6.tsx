'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { StepNavigation } from '@/app/profile/host/add-property/_components/StepNavigation'
import { cn } from '@/lib/utils'
import { useAddPet } from '../../_context/AddPetContext'
import { Baby } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Step6Props {
  onNext: () => void
  onBack: () => void
}

export function Step6({ onNext, onBack }: Step6Props) {
  const { formData, updateField } = useAddPet()
  const petImageSrc = formData.petImage instanceof File ? URL.createObjectURL(formData.petImage) : null
  
  const [day, setDay] = useState<number | undefined>()
  const [month, setMonth] = useState<number | undefined>()
  const [year, setYear] = useState<number | undefined>()

  // Populate dropdowns
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)
  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('default', { month: 'long' }) }))
  const daysInMonth = year && month ? new Date(year, month, 0).getDate() : 31
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Update formData when all date components are selected
  useEffect(() => {
    if (year && month && day) {
      const date = new Date(year, month - 1, day)
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      updateField('petBirthDate', formattedDate)
    }
  }, [year, month, day, updateField])

  const isNextDisabled = !year || !month || !day
  
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
          How old is your pet?
        </h3>
        <p className="mb-4 text-neutral-gray text-sm">
          It doesn&apos;t have to be exact. just an estimate is fine!
        </p>

        {/* Date of Birth Dropdowns */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto">
          <Select onValueChange={(value) => setYear(parseInt(value, 10))}>
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setMonth(parseInt(value, 10))}>
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setDay(parseInt(value, 10))}>
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map(d => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
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
