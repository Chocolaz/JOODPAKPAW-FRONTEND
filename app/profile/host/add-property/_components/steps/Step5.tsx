'use client'

import { useAddProperty } from '../../_context/AddPropertyContext'
import { useFacilities } from '../../_hooks/useFacilities'
import { Facility } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { StepNavigation } from '../StepNavigation'
import { cn } from '@/lib/utils'

export function Step5({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { formData, updateField } = useAddProperty()
  const { facilities, loading, error } = useFacilities()

  const handleToggle = (facilityId: number) => {
    const updated = formData.facilities.includes(facilityId)
      ? formData.facilities.filter((id) => id !== facilityId)
      : [...formData.facilities, facilityId]

    updateField('facilities', updated)
  }

  const groupedFacilities = facilities
    .filter((facility) => facility.category.name !== 'indoor')
    .reduce(
      (acc, facility) => {
        const category = facility.category.name
        if (!acc[category]) acc[category] = []
        acc[category].push(facility)
        return acc
      },
      {} as Record<string, Facility[]>
    )

  if (loading) return <Spinner className="mt-20" />
  if (error) return <div className="text-red-500 mt-20">{error}</div>

  return (
    <>
      <div className="w-full text-center mt-5">
        <h3 className="text-deep-teal">
          What facilities does your property offer?
        </h3>
        <p className="mb-6 text-neutral-gray text-sm">
          Select all the facilities available for pets
        </p>

        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-10 mb-25">
          {Object.entries(groupedFacilities).map(([category, facilities]) => (
            <div key={category}>
              <h4 className="text-left text-neutral-dark font-semibold capitalize mb-4">
                {category}
              </h4>

              <div className="grid grid-cols-2 gap-6">
                {facilities.map((facility) => {
                  const selected = formData.facilities.includes(facility.id)

                  return (
                    <button
                      key={facility.id}
                      onClick={() => handleToggle(facility.id)}
                      className={cn(
                        'flex items-center p-4 rounded-[20px] border shadow-sm text-left transition-all w-full h-20',
                        selected
                          ? 'border-positive-green bg-teal-50'
                          : 'border-[ECEFF2] bg-white hover:border-deep-teal/50'
                      )}
                    >
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full mr-3 shrink-0 border flex items-center justify-center transition-all',
                          selected
                            ? 'border-positive-green bg-positive-green'
                            : 'border-gray-300 bg-white'
                        )}
                      >
                        {selected && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>

                      <span className="font-medium text-neutral-dark">
                        {facility.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <StepNavigation onBack={onBack} onNext={onNext} />
    </>
  )
}
