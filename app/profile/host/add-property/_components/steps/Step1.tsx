'use client'

import { useAddProperty } from '../../_context/AddPropertyContext'
import { propertyTypes } from '../../_constants'
import { StepNavigation } from '../StepNavigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const propertyTypeGraphics = [
  { id: 1, name: 'House', icon: '/graphics/steps/house.svg' },
  { id: 2, name: 'Apartment/Condo', icon: '/graphics/steps/apartment.svg' },
  { id: 3, name: 'Pet Hotel', icon: '/graphics/steps/hotel.svg' },
]

export function Step1({ onNext }: { onNext: () => void }) {
  const { formData, updateField } = useAddProperty()

  return (
    <>
      <div className="w-full text-center mt-5">
        <h3 className="text-deep-teal">What type of place is this?</h3>
        <p className="mb-6 text-neutral-gray text-sm">
          Choose the kind of space where pets will stay
        </p>

        <div className="flex flex-wrap justify-center gap-8 pb-4">
          {propertyTypeGraphics.map((type) => {
            const propertyInfo = propertyTypes.find((p) => p.id === type.id)

            return (
              <button
                key={type.id}
                onClick={() => updateField('propertyTypeId', type.id)}
                className={cn(
                  'flex flex-col items-center justify-center p-4 border rounded-[20px] shadow-sm cursor-pointer transition-colors w-[150px] h-[150px]',
                  formData.propertyTypeId === type.id
                    ? 'border-positive-green bg-teal-50'
                    : 'border-[ECEFF2] bg-white hover:border-deep-teal/50'
                )}
              >
                <Image src={type.icon} alt={type.name} width={80} height={80} />
                <span className="mt-4 text-center font-medium text-neutral-dark">
                  {propertyInfo?.name || type.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
      <StepNavigation
        onNext={onNext}
        isNextDisabled={!formData.propertyTypeId}
      />
    </>
  )
}
