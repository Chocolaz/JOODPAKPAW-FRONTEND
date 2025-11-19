'use client'

import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { countryNames } from '../../_constants'
import { StepNavigation } from '../StepNavigation'

export function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateField } = useAddProperty()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    updateField(e.target.name as keyof typeof formData, e.target.value)
  }

  const isFormValid = () => {
    return (
      formData.country.trim() !== '' &&
      formData.province.trim() !== '' &&
      formData.district.trim() !== '' &&
      formData.subdistrict.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.zipcode.trim() !== ''
    )
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">Confirm your address</h1>
        <div className="space-y-4">
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-6 text-lg border rounded-md bg-background"
          >
            <option value="" disabled>
              Select your country
            </option>
            {countryNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Input
            type="text"
            name="province"
            placeholder="Province"
            value={formData.province}
            onChange={handleChange}
            className="p-6 text-lg"
          />
          <Input
            type="text"
            name="district"
            placeholder="District"
            value={formData.district}
            onChange={handleChange}
            className="p-6 text-lg"
          />
          <Input
            type="text"
            name="subdistrict"
            placeholder="Subdistrict"
            value={formData.subdistrict}
            onChange={handleChange}
            className="p-6 text-lg"
          />
          <Input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="p-6 text-lg"
          />
          <Input
            type="text"
            name="zipcode"
            placeholder="Zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            className="p-6 text-lg"
          />
        </div>
      </div>
      <StepNavigation onBack={onBack} onNext={onNext} isNextDisabled={!isFormValid()} />
    </>
  )
}
