'use client'

import { ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { StepNavigation } from '../StepNavigation'

export function Step3({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { formData, updateField } = useAddProperty()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'zipcode') {
      updateField('zipcode', value.replace(/\D/g, '').slice(0, 5))
      return
    }
    updateField(name as keyof typeof formData, value)
  }

  const isFormValid =
    formData.country.trim() !== '' &&
    formData.province.trim() !== '' &&
    formData.district.trim() !== '' &&
    formData.subdistrict.trim() !== '' &&
    formData.address.trim() !== '' &&
    formData.zipcode.trim().length === 5

  const fields = [
    { name: 'district', label: 'District', maxLength: 50 },
    { name: 'subdistrict', label: 'Subdistrict', maxLength: 50 },
    { name: 'address', label: 'Address', maxLength: 120 },
    { name: 'zipcode', label: 'Zipcode', maxLength: 5, inputMode: 'numeric' as const },
  ]

  return (
    <>
      <div className="w-full text-center mt-10 pb-24">
        <h3 className="text-deep-teal">Confirm your address</h3>
        <p className="mb-6 text-neutral-gray text-sm">
          We&apos;ve auto-filled your address based on the location you picked.
          You can make adjustments if needed.
        </p>

        <div className="space-y-4 text-left pb-4">
          <div>
            <label className="text-sm font-medium text-deep-teal mb-1 block">Country</label>
            <Input value="Thailand" disabled className="cursor-not-allowed" />
          </div>

          <div>
            <label className="text-sm font-medium text-deep-teal mb-1 block">Province</label>
            <Input value={formData.province || ''} disabled className="cursor-not-allowed" />
          </div>

          {fields.map(({ name, label, maxLength, inputMode }) => (
            <div key={name}>
              <label className="text-sm font-medium text-deep-teal mb-1 block">{label}</label>
              <Input
                name={name}
                placeholder={label}
                value={formData[name as keyof typeof formData] as string}
                maxLength={maxLength}
                inputMode={inputMode}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      </div>

      <StepNavigation onBack={onBack} onNext={onNext} isNextDisabled={!isFormValid} />
    </>
  )
}
