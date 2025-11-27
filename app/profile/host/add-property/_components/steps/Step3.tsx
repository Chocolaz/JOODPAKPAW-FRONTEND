'use client'

import * as React from 'react'
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

  // Auto fill on load
  React.useEffect(() => {
    if (formData.latitude && formData.longitude) {
      updateField('country', 'Thailand')
      updateField('province', formData.province || '')

      let districtToSet = formData.district || ''
      if (!districtToSet && formData.subdistrict) {
        districtToSet = formData.subdistrict.replace(/Khet/gi, '').trim()
      }

      updateField('district', districtToSet)
      updateField('subdistrict', formData.subdistrict || '')
      updateField('address', formData.address || '')
      updateField('zipcode', formData.zipcode || '')
    }
  }, [
    formData.latitude,
    formData.longitude,
    formData.province,
    formData.district,
    formData.subdistrict,
    formData.address,
    formData.zipcode,
    updateField,
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Allow only numbers for zipcode
    if (name === 'zipcode') {
      const numeric = value.replace(/\D/g, '') // remove non-digits
      updateField('zipcode', numeric.slice(0, 5)) // limit to 5 digits
      return
    }

    updateField(name as keyof typeof formData, value)
  }

  const isFormValid = () => {
    return (
      formData.country.trim() !== '' &&
      formData.province.trim() !== '' &&
      formData.district.trim() !== '' &&
      formData.subdistrict.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.zipcode.trim().length === 5
    )
  }

  return (
    <>
      <div className="w-full text-center mt-10 pb-24">
        <h3 className="text-deep-teal">Confirm your address</h3>
        <p className="mb-6 text-neutral-gray text-sm">
          We’ve auto-filled your address based on the location you picked.
          <br /> You can make adjustments if needed.
        </p>

        <div className="space-y-4 text-left pb-4">
          {/* Country */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">Country</p>
            <Input value="Thailand" disabled className="cursor-not-allowed" />
          </div>

          {/* Province */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">Province</p>
            <Input
              value={formData.province || ''}
              disabled
              className="cursor-not-allowed"
            />
          </div>

          {/* District */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">District</p>
            <Input
              name="district"
              placeholder="District"
              value={formData.district}
              maxLength={50}
              onChange={handleChange}
            />
          </div>

          {/* Subdistrict */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">
              Subdistrict
            </p>
            <Input
              name="subdistrict"
              placeholder="Subdistrict"
              value={formData.subdistrict}
              maxLength={50}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">Address</p>
            <Input
              name="address"
              placeholder="Address"
              value={formData.address}
              maxLength={120}
              onChange={handleChange}
            />
          </div>

          {/* Zipcode */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">Zipcode</p>
            <Input
              name="zipcode"
              placeholder="Zipcode"
              value={formData.zipcode}
              inputMode="numeric"
              maxLength={5}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={!isFormValid()}
      />
    </>
  )
}
