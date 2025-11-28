'use client'

import { useAddProperty } from '../../_context/AddPropertyContext'
import { useGroupedFacilities } from '../../../_hooks/useGroupedFacilities'
import { FacilityCard } from '../../../_components/FacilityCard'
import { StepNavigation } from '../StepNavigation'
import { Spinner } from '@/components/ui/spinner'

export function Step5({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { formData, updateField } = useAddProperty()
  const { groupedFacilities, loading, error } = useGroupedFacilities()

  const handleToggle = (facilityId: number) => {
    const updated = formData.facilities.includes(facilityId)
      ? formData.facilities.filter((id) => id !== facilityId)
      : [...formData.facilities, facilityId]

    updateField('facilities', updated)
  }

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

        <div className="max-h-[57vh] overflow-y-auto pr-2 space-y-10 mb-20">
          {Object.entries(groupedFacilities).map(([category, facilities]) => (
            <div key={category}>
              <h4 className="text-left text-neutral-dark font-semibold capitalize mb-4">
                {category}
              </h4>

              <div className="grid grid-cols-2 gap-6">
                {facilities.map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    selected={formData.facilities.includes(facility.id)}
                    onToggle={handleToggle}
                  />
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
