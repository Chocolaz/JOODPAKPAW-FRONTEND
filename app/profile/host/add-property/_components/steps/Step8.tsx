'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { useAddProperty } from '../../_context/AddPropertyContext'
import { createRoomCategory } from '@/lib/api'
import { useFacilities } from '../../_hooks/useFacilities'
import { RoomCategoryFormData } from '@/types'
import { cn } from '@/lib/utils'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const petTypes = [
  { id: 1, name: 'Dog' },
  { id: 2, name: 'Cat' },
  { id: 3, name: 'Bird' },
  { id: 4, name: 'Rabbit' },
  { id: 5, name: 'Other' },
]

const petSizeCategories = [
  { id: 1, name: 'Small' },
  { id: 2, name: 'Medium' },
  { id: 3, name: 'Large' },
  { id: 4, name: 'Any Size' },
]

const initialRoomState: RoomCategoryFormData = {
  name: '',
  basePrice: 0,
  totalRoom: 1,
  numberOfPets: 1,
  pets: [],
  facilities: [],
  petSizeCategoryId: 1,
}

export function Step8() {
  const router = useRouter()
  const { formData: propertyContextData } = useAddProperty()
  const {
    facilities: allFacilities,
    loading: facilitiesLoading,
    error: facilitiesError,
  } = useFacilities()

  const [roomData, setRoomData] = useState<RoomCategoryFormData>(initialRoomState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setRoomData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setRoomData((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const handleMultiSelectToggle = (
    listName: 'pets' | 'facilities',
    value: number
  ) => {
    setRoomData((prev) => {
      const list = prev[listName]
      const updatedList = list.includes(value)
        ? list.filter((id) => id !== value)
        : [...list, value]
      return { ...prev, [listName]: updatedList }
    })
  }

  const handleSubmit = async (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault()
    if (!propertyContextData.propertyId) {
      const msg = 'Property ID is missing. Cannot create room.'
      setError(msg)
      toast.error(msg)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createRoomCategory(propertyContextData.propertyId, roomData)
      toast.success('Room category created successfully!')
      if (onSuccess) {
        onSuccess()
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.'
      setError(errorMessage)
      toast.error(`Failed to create room category: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddAnother = () => {
    setRoomData(initialRoomState)
    setSubmitted(false)
    setError(null)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center mt-10">
        <h1 className="text-2xl font-bold mb-4 text-deep-teal">
          Room Category Added!
        </h1>
        <p className="text-neutral-gray mb-6">
          What would you like to do next?
        </p>
        <div className="flex gap-4 mt-2">
          <Button onClick={handleAddAnother} variant="outline">
            Add Another Room
          </Button>
          <Button onClick={() => router.push('/profile/host')}>
            Finish & Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const roomFacilities = allFacilities.filter(
    (f) => f.category.name === 'indoor'
  )

  return (
    <>
      <form
        id="room-category-form"
        onSubmit={handleSubmit}
        className="w-full text-left mt-6 pb-24"
      >
        <div className="w-full text-center">
          <h1 className="text-3xl font-bold mb-2 text-deep-teal">
            Add Room Categories
          </h1>
          <p className="text-neutral-gray mb-8">
            Congratulations on listing your property! Now, define the types of
            rooms or spaces available.
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="font-semibold text-lg text-neutral-dark mb-4">
              Basic Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-deep-teal">
                  Room Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Deluxe Double Room"
                  value={roomData.name}
                  onChange={handleChange}
                  required
                  className="p-6 text-base"
                />
              </div>
              <div>
                <Label htmlFor="basePrice" className="text-deep-teal">
                  Price per Night (THB)
                </Label>
                <Input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  placeholder="e.g., 1500"
                  value={roomData.basePrice}
                  onChange={handleChange}
                  required
                  className="p-6 text-base"
                />
              </div>
              <div>
                <Label htmlFor="totalRoom" className="text-deep-teal">
                  Total Rooms of this Category
                </Label>
                <Input
                  id="totalRoom"
                  name="totalRoom"
                  type="number"
                  placeholder="e.g., 5"
                  value={roomData.totalRoom}
                  onChange={handleChange}
                  required
                  className="p-6 text-base"
                />
              </div>
              <div>
                <Label htmlFor="numberOfPets" className="text-deep-teal">
                  Pet Capacity per Room
                </Label>
                <Input
                  id="numberOfPets"
                  name="numberOfPets"
                  type="number"
                  placeholder="e.g., 2"
                  value={roomData.numberOfPets}
                  onChange={handleChange}
                  required
                  className="p-6 text-base"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg text-neutral-dark mb-4">
              Pet Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <Label className="text-deep-teal mb-2 block">
                  Allowed Pet Types
                </Label>
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-white">
                  {petTypes.map((petType) => (
                    <button
                      key={petType.id}
                      type="button"
                      onClick={() => handleMultiSelectToggle('pets', petType.id)}
                      className={cn(
                        'flex items-center p-2 rounded-md text-left transition-colors text-sm',
                        roomData.pets.includes(petType.id)
                          ? 'bg-teal-50'
                          : 'hover:bg-gray-50'
                      )}
                    >
                      <div
                        className={cn(
                          'w-4 h-4 rounded mr-2 shrink-0 border flex items-center justify-center',
                          roomData.pets.includes(petType.id)
                            ? 'border-positive-green bg-positive-green'
                            : 'border-gray-300 bg-white'
                        )}
                      >
                        {roomData.pets.includes(petType.id) && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium text-neutral-dark">
                        {petType.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="petSizeCategoryId" className="text-deep-teal">
                  Max Pet Size
                </Label>
                <Select
                  value={String(roomData.petSizeCategoryId)}
                  onValueChange={(value) =>
                    handleSelectChange('petSizeCategoryId', value)
                  }
                >
                  <SelectTrigger className="p-6 text-base">
                    <SelectValue placeholder="Select max pet size" />
                  </SelectTrigger>
                  <SelectContent>
                    {petSizeCategories.map((size) => (
                      <SelectItem key={size.id} value={String(size.id)}>
                        {size.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-lg text-neutral-dark mb-4">
              In-Room Facilities
            </h3>
            {facilitiesLoading && <Spinner />}
            {facilitiesError && (
              <p className="text-red-500">{facilitiesError}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {roomFacilities.map((facility) => (
                <button
                  key={facility.id}
                  type="button"
                  onClick={() =>
                    handleMultiSelectToggle('facilities', facility.id)
                  }
                  className={cn(
                    'flex items-center p-4 rounded-lg border text-left transition-colors',
                    roomData.facilities.includes(facility.id)
                      ? 'border-positive-green bg-teal-50'
                      : 'bg-white hover:border-deep-teal/50'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full mr-3 shrink-0 border flex items-center justify-center',
                      roomData.facilities.includes(facility.id)
                        ? 'border-positive-green bg-positive-green'
                        : 'border-gray-300 bg-white'
                    )}
                  >
                    {roomData.facilities.includes(facility.id) && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-sm text-neutral-dark">
                    {facility.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {error && <p className="text-red-500 mt-6">{error}</p>}
      </form>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t">
        <div className="container mx-auto max-w-5xl p-4 flex justify-between items-center">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/profile/host')}
          >
            I'll Do This Later
          </Button>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, handleAddAnother)}
              disabled={isSubmitting}
              variant="outline"
              className="min-w-[180px]"
            >
              {isSubmitting ? <Spinner /> : 'Save & Add Another'}
            </Button>
            <Button
              type="submit"
              form="room-category-form"
              disabled={isSubmitting}
              className="min-w-[180px]"
            >
              {isSubmitting ? <Spinner /> : 'Save and Finish'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

