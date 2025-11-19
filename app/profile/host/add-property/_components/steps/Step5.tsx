'use client'

import { useAddProperty } from '../../_context/AddPropertyContext'
import { useFacilities } from '../../_hooks/useFacilities'
import { Facility } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { StepNavigation } from '../StepNavigation'

export function Step5({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateField } = useAddProperty()
  const { facilities, loading, error } = useFacilities()

  const handleSelectFacility = (facilityId: number) => {
    const newFacilities = formData.facilities.includes(facilityId)
      ? formData.facilities.filter((id) => id !== facilityId)
      : [...formData.facilities, facilityId]
    updateField('facilities', newFacilities)
  }

  const groupedFacilities = facilities
    .filter((facility) => facility.category.name !== 'indoor')
    .reduce(
      (acc, facility) => {
        const category = facility.category.name
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(facility)
        return acc
      },
      {} as Record<string, Facility[]>
    )

  if (loading) {
    return <Spinner className="mt-20" />
  }

  if (error) {
    return <div className="text-red-500 mt-20">{error}</div>
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">
          What facilities does your property offer?
        </h1>
        <div className="space-y-6">
          {Object.entries(groupedFacilities).map(([category, facilities]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold capitalize mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {facilities.map((facility) => (
                  <label
                    key={facility.id}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility.id)}
                      onChange={() => handleSelectFacility(facility.id)}
                      className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>{facility.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <StepNavigation onBack={onBack} onNext={onNext} />
    </>
  )
}
