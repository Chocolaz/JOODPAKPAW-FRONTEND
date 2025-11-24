'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

import { RoomCategoryCard } from '../RoomCategoryCard'

import { useAddProperty } from '../../_context/AddPropertyContext'
import {
  getRoomCategories,
  createRoomCategory,
  getPetTypes,
  getPetSizeCategories,
} from '@/lib/api'
import { useFacilities } from '../../_hooks/useFacilities'
import {
  RoomCategory,
  RoomCategoryFormData,
  Pet,
  PetSizeCategory,
} from '@/types'
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerFooter,
} from '@/components/ui/drawer'

const initialRoomState: RoomCategoryFormData = {
  name: '',
  basePrice: 0,
  totalRoom: 1,
  numberOfPets: 1,
  pets: [],
  facilities: [],
  petSizeCategoryId: 1,
}

function AddRoomCategoryForm({
  propertyId,
  onAddSuccess,
}: {
  propertyId: number
  onAddSuccess: () => void
}) {
  const {
    facilities: allFacilities,
    loading: facilitiesLoading,
    error: facilitiesError,
  } = useFacilities()
  const [roomData, setRoomData] =
    useState<RoomCategoryFormData>(initialRoomState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [petTypes, setPetTypes] = useState<Pet[]>([])
  const [petSizeCategories, setPetSizeCategories] = useState<PetSizeCategory[]>(
    []
  )
  const [loadingPetData, setLoadingPetData] = useState(true)

  useEffect(() => {
    async function fetchPetData() {
      try {
        setLoadingPetData(true)
        const [petsRes, sizesRes] = await Promise.all([
          getPetTypes(),
          getPetSizeCategories(),
        ])
        setPetTypes(petsRes.pets)
        setPetSizeCategories(sizesRes.petSizeCategories)
        if (sizesRes.petSizeCategories.length > 0) {
          setRoomData((prev) => ({
            ...prev,
            petSizeCategoryId: sizesRes.petSizeCategories[0].id,
          }))
        }
      } catch (error) {
        toast.error('Failed to load pet data.')
        console.error(error)
      } finally {
        setLoadingPetData(false)
      }
    }
    fetchPetData()
  }, [])

  const roomFacilities = allFacilities.filter(
    (f) => f.category.name === 'indoor'
  )

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createRoomCategory(propertyId, roomData)
      toast.success('Room category added successfully!')
      onAddSuccess()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to add room category.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 overflow-y-auto max-h-[80vh]">
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
          {loadingPetData ? (
            <Spinner />
          ) : (
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
                      onClick={() =>
                        handleMultiSelectToggle('pets', petType.id)
                      }
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
          )}
        </section>

        <section>
          <h3 className="font-semibold text-lg text-neutral-dark mb-4">
            In-Room Facilities
          </h3>
          {facilitiesLoading && <Spinner />}
          {facilitiesError && <p className="text-red-500">{facilitiesError}</p>}
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
      <DrawerFooter className="pt-8">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : 'Save Room Category'}
        </Button>
      </DrawerFooter>
    </form>
  )
}

export function Step8() {
  const router = useRouter()
  const { formData: propertyContextData } = useAddProperty()
  const propertyId = propertyContextData.propertyId

  const [rooms, setRooms] = useState<RoomCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const fetchRooms = async () => {
    if (!propertyId) {
      setLoading(false)
      setError('Property ID not found.')
      return
    }
    try {
      setLoading(true)
      const res = await getRoomCategories(propertyId)
      setRooms(res.roomCategories)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch room categories.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [propertyId])

  const handleAddSuccess = () => {
    fetchRooms()
    setIsDrawerOpen(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full pt-20">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="w-full text-center mt-6 pb-24">
      <h3 className="mb-2 text-deep-teal">Set up your room for pets </h3>
      <p className="text-neutral-gray mb-8">
        Describe this specific type of room for pets to stay.
      </p>

      <div className="space-y-4 text-left max-w-2xl mx-auto">
        {error && <p className="text-red-500 text-center">{error}</p>}
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <RoomCategoryCard key={room.id} category={room} />
          ))
        ) : (
          <div className="mx-5 px-6 py-8 border-2 border-dashed border-positive-green rounded-xl">
            <div className="font-medium text-deep-teal text-lg flex items-center justify-between w-full">
              <span>Add Room</span>
              <Plus className="h-6 w-6 text-positive-green" />
            </div>
          </div>
        )}
      </div>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button className="mt-6">
            <Plus className="mr-2 h-4 w-4" /> Add Room Category
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add a New Room Category</DrawerTitle>
            <DrawerDescription>
              Fill in the details for the new room category.
            </DrawerDescription>
          </DrawerHeader>
          {propertyId && (
            <AddRoomCategoryForm
              propertyId={propertyId}
              onAddSuccess={handleAddSuccess}
            />
          )}
        </DrawerContent>
      </Drawer>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t">
        <div className="container mx-auto max-w-5xl p-4 flex justify-end items-center">
          <Button onClick={() => router.push('/profile/host')}>Finish</Button>
        </div>
      </div>
    </div>
  )
}
