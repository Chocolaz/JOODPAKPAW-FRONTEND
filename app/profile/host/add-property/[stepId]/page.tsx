'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { countries } from 'countries-list'
import { createProperty } from '@/lib/api'
import Link from 'next/link'
import { useFacilities } from '../_hooks/useFacilities'
import { Facility } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { useAddProperty } from '../_context/AddPropertyContext'

const propertyTypes = [
  { id: 1, name: 'House' },
  { id: 2, name: 'Apartment/Condo' },
  { id: 3, name: 'Pet Hotel' },
]
const countryNames = Object.values(countries)
  .map((country) => country.name)
  .sort()

function Step1({ onNext }: { onNext: () => void }) {
  const { formData, updateField } = useAddProperty()

  return (
    <>
      <div className="w-full text-left mt-10">
        <h2 className="text-lg font-semibold text-neutral-gray mb-2">
          Tell us about your space
        </h2>
        <h1 className="text-2xl font-bold mb-6">What type of place is this?</h1>
        <div className="space-y-4">
          {propertyTypes.map((type) => (
            <Button
              key={type.id}
              variant={formData.propertyTypeId === type.id ? 'default' : 'outline'}
              className="w-full justify-start p-6 text-lg"
              onClick={() => updateField('propertyTypeId', type.id)}
            >
              {type.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-2 left-0 right-0 py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-end">
        <Button
          disabled={!formData.propertyTypeId}
          onClick={onNext}
          className="text-[16px] w-[100px] p-6 bg-positive-green"
        >
          Continue
        </Button>
      </div>
    </>
  )
}

function Step2({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateField } = useAddProperty()

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">
          Where is your property located?
        </h1>
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Latitude"
            value={formData.latitude}
            onChange={(e) => updateField('latitude', e.target.value)}
            className="p-6 text-lg"
          />
          <Input
            type="number"
            placeholder="Longitude"
            value={formData.longitude}
            onChange={(e) => updateField('longitude', e.target.value)}
            className="p-6 text-lg"
          />
        </div>
      </div>
      <div className="fixed bottom-2 left-0 right-0 py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-[16px] p-6 w-[100px]"
        >
          Back
        </Button>
        <Button
          disabled={!formData.latitude || !formData.longitude}
          onClick={onNext}
          className="text-[16px] w-[100px] p-6 bg-positive-green"
        >
          Continue
        </Button>
      </div>
    </>
  )
}

function Step3({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
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
      <div className="fixed bottom-2 left-0 right-0 py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-[16px] p-6 w-[100px]"
        >
          Back
        </Button>
        <Button
          disabled={!isFormValid()}
          onClick={onNext}
          className="text-[16px] w-[100px] p-6 bg-positive-green"
        >
          Continue
        </Button>
      </div>
    </>
  )
}

function Step4({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateField } = useAddProperty()

  const isFormValid = () => {
    return formData.title.trim() !== '' && formData.description.trim() !== ''
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">
          What's your property called?
        </h1>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Property Title"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="p-6 text-lg"
          />
          <textarea
            placeholder="Property Description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className="w-full p-6 text-lg border rounded-md bg-background min-h-[120px]"
          />
        </div>
      </div>
      <div className="fixed bottom-2 left-0 right-0 py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-[16px] p-6 w-[100px]"
        >
          Back
        </Button>
        <Button
          disabled={!isFormValid()}
          onClick={onNext}
          className="text-[16px] w-[100px] p-6 bg-positive-green"
        >
          Continue
        </Button>
      </div>
    </>
  )
}

function Step5({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
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
      <div className="fixed bottom-2 left-0 right-0 py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-[16px] p-6 w-[100px]"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          className="text-[16px] w-[100px] p-6 bg-positive-green"
        >
          Continue
        </Button>
      </div>
    </>
  )
}

function Step6({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData, updateField } = useAddProperty()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      updateField('images', [...formData.images, ...filesArray])
    }
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">Upload photos of your property</h1>
        <div className="space-y-4">
          <Input
            type="file"
            multiple
            onChange={handleImageChange}
            className="p-6 text-lg"
            accept="image/*"
          />
          <div className="grid grid-cols-3 gap-4 mt-4">
            {formData.images.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview ${index}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fixed bottom-2 left-0 right-0 py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-[16px] p-6 w-[100px]"
        >
          Back
        </Button>
        <Button
          disabled={formData.images.length === 0}
          onClick={onNext}
          className="text-[16px] w-[100px] p-6 bg-positive-green"
        >
          Continue
        </Button>
      </div>
    </>
  )
}

function Step7({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { formData } = useAddProperty()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      await createProperty(formData)
      router.push('/profile/host/add-property/8')
    } catch (err: any) {
      setError(err.message || 'Failed to create property.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">Review your listing</h1>
        <div className="space-y-4">
          <div><strong>Title:</strong> {formData.title}</div>
          <div><strong>Description:</strong> {formData.description}</div>
          <div><strong>Property Type:</strong> {propertyTypes.find(p => p.id === formData.propertyTypeId)?.name}</div>
          <div><strong>Address:</strong> {`${formData.address}, ${formData.subdistrict}, ${formData.district}, ${formData.province}, ${formData.country} ${formData.zipcode}`}</div>
          <div><strong>Location:</strong> Lat: {formData.latitude}, Long: {formData.longitude}</div>
          <div><strong>Facilities:</strong> {formData.facilities.length} selected</div>
          <div><strong>Images:</strong> {formData.images.length} selected</div>
        </div>
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
      <div className="fixed bottom-2 left-0 right-0 py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-[16px] p-6 w-[100px]"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          className="text-[16px] w-[100px] p-6 bg-positive-green"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner /> : 'Submit'}
        </Button>
      </div>
    </>
  )
}

function Step8() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-2xl font-bold mb-4">Congratulations!</h1>
      <p>Your property has been listed successfully.</p>
      <Link href="/profile/host">
        <Button className="mt-6">Go to Host Dashboard</Button>
      </Link>
    </div>
  )
}

export default function AddPropertyDynamicStepsPage() {
  const params = useParams()
  const router = useRouter()
  const stepId = parseInt(params.stepId as string, 10)

  const handleNext = () => {
    router.push(`/profile/host/add-property/${stepId + 1}`)
  }

  const handleBack = () => {
    router.push(`/profile/host/add-property/${stepId - 1}`)
  }

  const renderStep = () => {
    switch (stepId) {
      case 1:
        return <Step1 onNext={handleNext} />
      case 2:
        return <Step2 onNext={handleNext} onBack={handleBack} />
      case 3:
        return <Step3 onNext={handleNext} onBack={handleBack} />
      case 4:
        return <Step4 onNext={handleNext} onBack={handleBack} />
      case 5:
        return <Step5 onNext={handleNext} onBack={handleBack} />
      case 6:
        return <Step6 onNext={handleNext} onBack={handleBack} />
      case 7:
        return <Step7 onNext={handleNext} onBack={handleBack} />
      case 8:
        return <Step8 />
      default:
        return <div>Invalid Step</div>
    }
  }

  return (
    <div className="flex flex-col items-center h-full px-5 max-w-[500px] mx-auto">
      {renderStep()}
    </div>
  )
}
