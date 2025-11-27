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
import { FacilityCard } from './FacilityCard'
import SmallIcon from '/public/icons/small.svg'
import MediumIcon from '/public/icons/medium.svg'
import LargeIcon from '/public/icons/large.svg'

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
  const [displayPrice, setDisplayPrice] = useState('')
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
    if (name === 'basePrice') return
    setRoomData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    if (value === '' || value.length <= 6) {
      const numericValue = value === '' ? 0 : parseInt(value, 10)
      setRoomData((prev) => ({ ...prev, basePrice: numericValue }))
      setDisplayPrice(
        value === '' ? '' : new Intl.NumberFormat('en-US').format(numericValue)
      )
    }
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
      className="py-4 px-10 space-y-4 overflow-y-auto max-h-[80vh] relative"
      onSubmit={handleSubmit}
    >
      {/* 1. Title */}
      <div className="space-y-2">
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
      <div className="space-y-3">
        <Label className="text-deep-teal">Species Allowed</Label>
        {loadingPetData ? (
          <Spinner />
        ) : (
          <div className="flex justify-center items-center gap-6">
            {petTypes.map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => toggleMulti('pets', pet.id)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-xl border shadow-sm transition aspect-square w-24 h-24 space-y-2',
                  roomData.pets.includes(pet.id)
                    ? 'border-positive-green'
                    : 'bg-white hover:border-deep-teal/40'
                )}
              >
                {pet.name.toLowerCase() === 'dog' ? (
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-full w-10 h-10',
                      roomData.pets.includes(pet.id)
                        ? 'bg-teal-50'
                        : 'bg-[#EFF1F4]'
                    )}
                  >
                    <Dog
                      className={cn(
                        'h-7 w-7',
                        roomData.pets.includes(pet.id)
                          ? 'text-positive-green'
                          : ''
                      )}
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-full w-10 h-10',
                      roomData.pets.includes(pet.id)
                        ? 'bg-teal-50'
                        : 'bg-[#EFF1F4]'
                    )}
                  >
                    <Cat
                      className={cn(
                        'h-7 w-7',
                        roomData.pets.includes(pet.id)
                          ? 'text-positive-green'
                          : ''
                      )}
                    />
                  </div>
                )}
                <span className="font-medium text-sm">{pet.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Size */}
      <div className="space-y-3">
        <Label className="text-deep-teal">Size</Label>
        <div className="flex justify-center items-center gap-6">
          {petSizeCategories.map((size) => {
            const description =
              size.max === 14
                ? 'under 14kg'
                : size.min === 14 && size.max === 25
                  ? '14-25kg'
                  : 'over 25kg'

            const getSizeIcon = (sizeName: string, isSelected: boolean) => {
              let IconComponent
              if (sizeName.toLowerCase() === 'small') {
                IconComponent = SmallIcon
              } else if (sizeName.toLowerCase() === 'medium') {
                IconComponent = MediumIcon
              } else {
                IconComponent = LargeIcon
              }

              return (
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full w-10 h-10',
                    isSelected ? 'bg-teal-50' : 'bg-[#EFF1F4]'
                  )}
                >
                  <IconComponent
                    className={cn(
                      'h-5 w-5',
                      isSelected ? 'text-positive-green' : 'text-gray-500'
                    )}
                  />
                </div>
              )
            }

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
                  'flex flex-col items-center justify-center p-4 rounded-xl border shadow-sm transition w-[100px] h-[125px] space-y-1',
                  roomData.petSizeCategoryId === size.id
                    ? 'border-positive-green'
                    : 'bg-white hover:border-deep-teal/40'
                )}
              >
                {getSizeIcon(size.name, roomData.petSizeCategoryId === size.id)}
                <span
                  className={cn(
                    'font-medium',
                    roomData.petSizeCategoryId === size.id
                      ? 'text-positive-green'
                      : ''
                  )}
                >
                  {size.name}
                </span>
                <p className="text-xs text-gray-500">{description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Room Facilities */}
      <div className="space-y-3">
        <Label className="text-deep-teal">Room Facilities</Label>
        {facilitiesLoading && <Spinner />}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {roomFacilities.map((f) => (
            <FacilityCard
              key={f.id}
              facility={f}
              selected={roomData.facilities.includes(f.id)}
              onToggle={(id) => toggleMulti('facilities', id)}
            />
          ))}
        </div>
      </div>

      {/* 5. Max pets allowed */}
      <div className="space-y-2">
        <Label className="text-deep-teal">Max pets allowed</Label>
        <div className="flex justify-center">
          <Select
            value={String(roomData.numberOfPets)}
            onValueChange={(v) =>
              setRoomData((prev) => ({ ...prev, numberOfPets: Number(v) }))
            }
          >
            <SelectTrigger className="py-5 px-4 text-lg w-max">
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
      </div>

      {/* 6. Base price per night */}
      <div className="space-y-2">
        <Label htmlFor="basePrice" className="text-sm text-deep-teal">
          Base price per night
        </Label>
        <div className="flex justify-center">
          <Input
            id="basePrice"
            name="basePrice"
            type="text"
            placeholder="000"
            value={displayPrice}
            onChange={handlePriceChange}
            className="text-2xl font-medium p-2 w-[150px] text-center placeholder:text-2xl"
          />
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 p-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6 text-lg bg-positive-green shadow-xl"
        >
          {isSubmitting ? <Spinner /> : 'Create Room Category'}
        </Button>
      </div>
    </form>
  )
}
