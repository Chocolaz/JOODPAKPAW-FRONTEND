'use client'

import React, { useState, useEffect } from 'react'
import { Dog, Cat } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  createRoomCategory,
  getPetTypes,
  getPetSizeCategories,
} from '@/lib/api'
import { useFacilities } from '../add-property/_hooks/useFacilities'
import { RoomCategoryFormData, Pet, PetSizeCategory } from '@/types'
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

const initialRoomState: RoomCategoryFormData = {
  name: '',
  basePrice: 0,
  totalRoom: 1,
  numberOfPets: 1,
  pets: [],
  facilities: [],
  petSizeCategoryId: 1,
}

export function AddRoomCategoryForm({
  propertyId,
  onAddSuccess,
}: {
  propertyId: number
  onAddSuccess: () => void
}) {
  const { facilities: allFacilities, loading: facilitiesLoading } =
    useFacilities()
  const [roomData, setRoomData] =
    useState<RoomCategoryFormData>(initialRoomState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [petTypes, setPetTypes] = useState<Pet[]>([])
  const [petSizeCategories, setPetSizeCategories] = useState<PetSizeCategory[]>(
    []
  )
  const [loadingPetData, setLoadingPetData] = useState(true)

  useEffect(() => {
    async function loadPets() {
      try {
        setLoadingPetData(true)
        const [petRes, sizeRes] = await Promise.all([
          getPetTypes(),
          getPetSizeCategories(),
        ])
        setPetTypes(petRes.pets)
        setPetSizeCategories(sizeRes.petSizeCategories)

        if (sizeRes.petSizeCategories.length > 0) {
          setRoomData((prev) => ({
            ...prev,
            petSizeCategoryId: sizeRes.petSizeCategories[0].id,
          }))
        }
      } catch (err) {
        toast.error('Failed to load pet data')
      } finally {
        setLoadingPetData(false)
      }
    }
    loadPets()
  }, [])

  const roomFacilities = allFacilities.filter(
    (f) => f.category.name === 'indoor'
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setRoomData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const toggleMulti = (key: 'pets' | 'facilities', id: number) => {
    setRoomData((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((v) => v !== id)
        : [...prev[key], id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createRoomCategory(propertyId, roomData)
      toast.success('Room category added!')
      onAddSuccess()
    } catch (err) {
      toast.error('Failed to add room category.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="py-4 px-10 space-y-8 overflow-y-auto max-h-[80vh]"
      onSubmit={handleSubmit}
    >
      {/* 1. Title */}
      <div className="space-y-1">
        <Label htmlFor="name" className="text-deep-teal">
          Title
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Room name"
          value={roomData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* 2. Species Allowed */}
      <div className="space-y-2">
        <Label className="text-deep-teal">Species Allowed</Label>
        {loadingPetData ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {petTypes.map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => toggleMulti('pets', pet.id)}
                className={cn(
                  'flex items-center p-4 rounded-xl border shadow-sm transition',
                  roomData.pets.includes(pet.id)
                    ? 'bg-teal-50 border-positive-green'
                    : 'bg-white hover:border-deep-teal/40'
                )}
              >
                {pet.name.toLowerCase() === 'dog' ? (
                  <Dog className="mr-3 h-7 w-7" />
                ) : (
                  <Cat className="mr-3 h-7 w-7" />
                )}
                <span className="font-medium">{pet.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Size */}
      <div className="space-y-2">
        <Label className="text-deep-teal">Size</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {petSizeCategories.map((size) => {
            const description =
              size.max === 14
                ? 'under 14kg'
                : size.min === 14 && size.max === 25
                  ? '14-25kg'
                  : 'over 25kg'
            return (
              <button
                key={size.id}
                type="button"
                onClick={() =>
                  setRoomData((prev) => ({
                    ...prev,
                    petSizeCategoryId: size.id,
                  }))
                }
                className={cn(
                  'p-4 rounded-xl border shadow-sm text-left transition',
                  roomData.petSizeCategoryId === size.id
                    ? 'bg-teal-50 border-positive-green'
                    : 'bg-white hover:border-deep-teal/40'
                )}
              >
                <span className="font-medium">{size.name}</span>
                <p className="text-xs text-gray-500">{description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Room Facilities */}
      <div className="space-y-2">
        <Label className="text-deep-teal">Room Facilities</Label>
        {facilitiesLoading && <Spinner />}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {roomFacilities.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => toggleMulti('facilities', f.id)}
              className={cn(
                'flex items-center p-4 rounded-xl border shadow-sm transition',
                roomData.facilities.includes(f.id)
                  ? 'bg-teal-50 border-positive-green'
                  : 'bg-white hover:border-deep-teal/40'
              )}
            >
              <span className="font-medium">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Max pets allowed */}
      <div className="space-y-1">
        <Label className="text-deep-teal">Max pets allowed</Label>
        <Select
          value={String(roomData.numberOfPets)}
          onValueChange={(v) =>
            setRoomData((prev) => ({ ...prev, numberOfPets: Number(v) }))
          }
        >
          <SelectTrigger className="p-4 text-base">
            <SelectValue placeholder="Select number" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((num) => (
              <SelectItem key={num} value={String(num)}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 6. Base price per night */}
      <div className="space-y-1">
        <Label htmlFor="basePrice" className="text-sm text-deep-teal">
          Base price per night
        </Label>
        <Input
          id="basePrice"
          name="basePrice"
          type="number"
          placeholder="1500"
          value={roomData.basePrice}
          onChange={handleChange}
        />
      </div>

      {/* Submit */}
      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Spinner /> : 'Save Room Category'}
        </Button>
      </div>
    </form>
  )
}
