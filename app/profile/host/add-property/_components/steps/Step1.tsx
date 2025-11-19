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
      <div className="w-full max-w-2xl mx-auto text-center mt-5">
        <h3 className="text-deep-teal">What type of place is this?</h3>
        <p className="mb-6 text-neutral-gray">
          Choose the kind of space where pets will stay
        </p>

        <div className="grid grid-cols-2 gap-8 pb-4">
          {propertyTypeGraphics.map((type, index) => {
            // The original propertyTypes from your constants might have different names.
            // This finds the matching type to ensure we use the correct name.
            const propertyInfo = propertyTypes.find((p) => p.id === type.id)
            const isLastItem = index === propertyTypeGraphics.length - 1

            return (
              <div
                key={type.id}
                className={cn('col-span-1', {
                  'col-span-2 justify-self-center': isLastItem,
                })}
              >
                <button
                  onClick={() => updateField('propertyTypeId', type.id)}
                  className={cn(
                    'flex flex-col items-center justify-center p-4 border-1 rounded-[20px] shadow-sm cursor-pointer transition-colors w-[150px] h-[150px]',
                    formData.propertyTypeId === type.id
                      ? 'border-positive-green bg-teal-50'
                      : 'border-[ECEFF2] bg-white hover:border-deep-teal/50'
                  )}
                >
                  <Image
                    src={type.icon}
                    alt={type.name}
                    width={80}
                    height={80}
                  />
                  <span className="mt-4 text-center font-medium text-neutral-dark">
                    {/* Use name from original propertyTypes if available, otherwise fallback */}
                    {propertyInfo?.name || type.name}
                  </span>
                </button>
              </div>
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
