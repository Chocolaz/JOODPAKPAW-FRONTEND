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

  // Auto fill triggered on step load
  React.useEffect(() => {
    if (formData.latitude && formData.longitude) {
      // กำหนด country เป็น Thailand ตลอด
      updateField('country', 'Thailand')

      // province, district, subdistrict, address, zipcode อิงจาก Google Maps API (reverse geocode)
      updateField('province', formData.province || '')
      updateField('district', formData.district || '')
      updateField('subdistrict', formData.subdistrict || '')
      updateField('address', formData.address || '')
      updateField('zipcode', formData.zipcode || '')
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="w-full text-center mt-10">
        <h3 className="text-deep-teal">Confirm your address</h3>
        <p className="mb-6 text-neutral-gray text-sm">
          We’ve auto-filled your address based on the location you picked.
          <br /> You can make adjustments if needed.
        </p>

        <div className="space-y-4 text-left pb-4">
          {/* Country */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">Country</p>
            <Input
              value="Thailand"
              disabled
              className="p-6 text-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Province */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">Province</p>
            <Input
              value={formData.province || ''}
              disabled
              className="p-6 text-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* District */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">District</p>
            <Input
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleChange}
              className="p-6 text-lg"
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
              onChange={handleChange}
              className="p-6 text-lg"
            />
          </div>

          {/* Address */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">Address</p>
            <Input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="p-6 text-lg"
            />
          </div>

          {/* Zipcode */}
          <div>
            <p className="text-sm font-medium text-deep-teal mb-1">Zipcode</p>
            <Input
              name="zipcode"
              placeholder="Zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="p-6 text-lg"
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
