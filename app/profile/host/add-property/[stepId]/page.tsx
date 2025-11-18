'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { countries } from 'countries-list'

import { useFacilities, Facility } from '../_hooks/useFacilities'
import { Spinner } from '@/components/ui/spinner'

const propertyTypes = ['House', 'Apartment/Condo', 'Pet Hotel']
const countryNames = Object.values(countries).map(country => country.name).sort()

function Step1({ onNext }: { onNext: () => void }) {
  const [selectedType, setSelectedType] = useState<string | null>(null)

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
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              className="w-full justify-start p-6 text-lg"
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-2 left-0 right-0 bg-white py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-end">
        <Button
          disabled={!selectedType}
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
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

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
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="p-6 text-lg"
          />
          <Input
            type="number"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="p-6 text-lg"
          />
        </div>
      </div>
      <div className="fixed bottom-2 left-0 right-0 bg-white py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onBack}
          className="text-[16px] p-6 w-[100px]"
        >
          Back
        </Button>
        <Button
          disabled={!latitude || !longitude}
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
  const [address, setAddress] = useState({
    country: '',
    province: '',
    subdistrict: '',
    address: '',
    zipcode: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const isFormValid = () => {
    return Object.values(address).every(field => field.trim() !== '')
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">Confirm your address</h1>
        <div className="space-y-4">
          <select
            name="country"
            value={address.country}
            onChange={handleChange}
            className="w-full p-6 text-lg border rounded-md bg-background"
          >
            <option value="" disabled>Select your country</option>
            {countryNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <Input
            type="text"
            name="province"
            placeholder="Province"
            value={address.province}
            onChange={handleChange}
            className="p-6 text-lg"
          />
          <Input
            type="text"
            name="subdistrict"
            placeholder="Subdistrict"
            value={address.subdistrict}
            onChange={handleChange}
            className="p-6 text-lg"
          />
          <Input
            type="text"
            name="address"
            placeholder="Address"
            value={address.address}
            onChange={handleChange}
            className="p-6 text-lg"
          />
          <Input
            type="text"
            name="zipcode"
            placeholder="Zipcode"
            value={address.zipcode}
            onChange={handleChange}
            className="p-6 text-lg"
          />
        </div>
      </div>
      <div className="fixed bottom-2 left-0 right-0 bg-white py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
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
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const isFormValid = () => {
    return title.trim() !== '' && description.trim() !== ''
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">What's your property called?</h1>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Property Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-6 text-lg"
          />
          <textarea
            placeholder="Property Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-6 text-lg border rounded-md bg-background min-h-[120px]"
          />
        </div>
      </div>
      <div className="fixed bottom-2 left-0 right-0 bg-white py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
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
  const { facilities, loading, error } = useFacilities()
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([])

  const handleSelectFacility = (facilityId: number) => {
    setSelectedFacilities(prev =>
      prev.includes(facilityId)
        ? prev.filter(id => id !== facilityId)
        : [...prev, facilityId]
    )
  }

  const groupedFacilities = facilities.reduce((acc, facility) => {
    const category = facility.category.name
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(facility)
    return acc
  }, {} as Record<string, Facility[]>)

  if (loading) {
    return <Spinner className="mt-20" />
  }

  if (error) {
    return <div className="text-red-500 mt-20">{error}</div>
  }

  return (
    <>
      <div className="w-full text-left mt-10">
        <h1 className="text-2xl font-bold mb-6">What facilities does your property offer?</h1>
        <div className="space-y-6">
          {Object.entries(groupedFacilities).map(([category, facilities]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold capitalize mb-3">{category}</h3>
              <div className="space-y-2">
                {facilities.map(facility => (
                  <label key={facility.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFacilities.includes(facility.id)}
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
      <div className="fixed bottom-2 left-0 right-0 bg-white py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
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
      // Add other steps here
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