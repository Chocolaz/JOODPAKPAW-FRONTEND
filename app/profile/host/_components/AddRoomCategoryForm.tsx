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

  /** -------------------------
   *  Helpers
   -------------------------- */
  const updateRoom = <K extends keyof RoomCategoryFormData>(
    key: K,
    value: RoomCategoryFormData[K]
  ) => {
    setRoomData((prev) => ({ ...prev, [key]: value }))
  }

  const toggleMulti = (key: 'pets' | 'facilities', id: number) => {
    updateRoom(
      key as keyof RoomCategoryFormData,
      roomData[key].includes(id)
        ? roomData[key].filter((v) => v !== id)
        : [...roomData[key], id]
    )
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat('en-US').format(value)

  const renderPetIcon = (pet: Pet, selected: boolean) => {
    const Icon = pet.name.toLowerCase() === 'dog' ? Dog : Cat
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full w-10 h-10',
          selected ? 'bg-teal-50' : 'bg-[#EFF1F4]'
        )}
      >
        <Icon className={cn('h-7 w-7', selected && 'text-positive-green')} />
      </div>
    )
  }

  const renderSizeIcon = (name: string, selected: boolean) => {
    const Icon =
      name.toLowerCase() === 'small'
        ? SmallIcon
        : name.toLowerCase() === 'medium'
          ? MediumIcon
          : LargeIcon

    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full w-10 h-10',
          selected ? 'bg-teal-50' : 'bg-[#EFF1F4]'
        )}
      >
        <Icon
          className={cn(
            'h-5 w-5',
            selected ? 'text-positive-green' : 'text-gray-500'
          )}
        />
      </div>
    )
  }

  /** -------------------------
   *  Load Pets
   -------------------------- */
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
          updateRoom(
            'petSizeCategoryId',
            sizeRes.petSizeCategories[0]
              .id as RoomCategoryFormData['petSizeCategoryId']
          )
        }
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to load pet data'
        )
      } finally {
        setLoadingPetData(false)
      }
    }
    loadPets()
  }, [])

  const roomFacilities = allFacilities.filter(
    (f) => f.category.name === 'indoor'
  )

  /** -------------------------
   *  Input Handlers
   -------------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    if (name !== 'basePrice' && name in roomData) {
      updateRoom(
        name as keyof RoomCategoryFormData,
        type === 'number' ? Number(value) : value
      )
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (raw.length <= 6) {
      const numeric = raw ? parseInt(raw, 10) : 0
      updateRoom('basePrice', numeric as RoomCategoryFormData['basePrice'])
      setDisplayPrice(raw ? formatPrice(numeric) : '')
    }
  }

  /** -------------------------
   *  Submit
   -------------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createRoomCategory(propertyId, roomData)
      toast.success('Room category added!')
      onAddSuccess()
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to add room category.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  /** -------------------------
   *  UI
   -------------------------- */
  return (
    <form
      className="py-4 px-10 space-y-4 overflow-y-auto max-h-[80vh] relative"
      onSubmit={handleSubmit}
    >
      {/* Title */}
      <div>
        <Label htmlFor="name" className="text-deep-teal block mb-2">
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

      {/* Species */}
      <div>
        <Label className="text-deep-teal block mb-2">Species Allowed</Label>
        {loadingPetData ? (
          <Spinner />
        ) : (
          <div className="flex justify-center items-center gap-6">
            {petTypes.map((pet) => {
              const selected = roomData.pets.includes(pet.id)
              return (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => toggleMulti('pets', pet.id)}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-xl border shadow-sm transition aspect-square w-24 h-24 space-y-2',
                    selected
                      ? 'border-positive-green'
                      : 'bg-white hover:border-deep-teal/40'
                  )}
                >
                  {renderPetIcon(pet, selected)}
                  <span className="font-medium text-sm">{pet.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Pet Size */}
      <div>
        <Label className="text-deep-teal block mb-2">Size</Label>
        <div className="flex justify-center items-center gap-6">
          {petSizeCategories.map((size) => {
            const selected = roomData.petSizeCategoryId === size.id
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
                onClick={() => updateRoom('petSizeCategoryId', size.id)}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-xl border shadow-sm transition w-[100px] h-[125px] space-y-1',
                  selected
                    ? 'border-positive-green'
                    : 'bg-white hover:border-deep-teal/40'
                )}
              >
                {renderSizeIcon(size.name, selected)}
                <span
                  className={cn(
                    'font-medium',
                    selected && 'text-positive-green'
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

      {/* Facilities */}
      <div>
        <Label className="text-deep-teal block mb-2">Room Facilities</Label>
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

      {/* Max pets */}
      <div>
        <Label className="text-deep-teal block mb-2">Max pets allowed</Label>
        <div className="flex justify-center">
          <Select
            value={String(roomData.numberOfPets)}
            onValueChange={(v) => updateRoom('numberOfPets', Number(v))}
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

      {/* Price */}
      <div>
        <Label htmlFor="basePrice" className="text-deep-teal block mb-2">
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

      {/* Submit */}
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
