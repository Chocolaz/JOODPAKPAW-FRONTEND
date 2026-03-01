'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ChevronLeft } from 'lucide-react'

import { RoomCategoryCard } from '@/app/_components/RoomCategoryCard'
import { AddRoomCategoryForm } from '../../../_components/AddRoomCategoryForm'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { getRoomCategories } from '@/lib/api'
import { RoomCategories } from '@/types'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { StepNavigation } from '../StepNavigation'

export function Step8() {
  const router = useRouter()
  const { formData, setHighestStepReached, clearAddPropertySession } = useAddProperty()
  const propertyId = formData.propertyId

  const [rooms, setRooms] = useState<RoomCategories[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const fetchRooms = useCallback(async () => {
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
      setError(err instanceof Error ? err.message : 'Failed to fetch room categories.')
    } finally {
      setLoading(false)
    }
  }, [propertyId])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const handleNext = () => {
    setHighestStepReached(8)
    router.push('/profile/host/add-property/9')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center pt-20">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="w-full text-center mt-6 pb-24">
      <h3 className="mb-1 text-deep-teal">Set up your rooms</h3>
      <p className="text-neutral-gray text-sm mb-8">
        Add at least one room type for pets to stay in.
      </p>

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <div className="space-y-3 text-left max-w-2xl mx-auto">
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <DrawerTrigger asChild>
            <button className="w-full px-5 py-6 border-2 border-dashed border-positive-green rounded-xl cursor-pointer hover:bg-green-50/50 transition-colors flex items-center justify-between">
              <span className="font-medium text-deep-teal">Add Room Type</span>
              <Plus className="h-5 w-5 text-positive-green" />
            </button>
          </DrawerTrigger>

          {rooms.map((room) => (
            <RoomCategoryCard
              key={room.id}
              category={room}
              propertyId={propertyId!}
              showDeleteButton
              onDeleteSuccess={fetchRooms}
              isOnlyRoom={rooms.length === 1}
            />
          ))}
        </div>

        <DrawerContent>
          <DrawerHeader className="relative">
            <DrawerTitle className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="-ml-2"
                onClick={() => setIsDrawerOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              Add Room Category
            </DrawerTitle>
          </DrawerHeader>

          {propertyId && (
            <AddRoomCategoryForm
              propertyId={propertyId}
              onAddSuccess={() => {
                fetchRooms()
                setIsDrawerOpen(false)
              }}
            />
          )}
        </DrawerContent>
      </Drawer>

      <StepNavigation
        onBack={() => {
          clearAddPropertySession()
          router.push('/profile/host')
        }}
        backText="Later"
        onNext={handleNext}
        nextText="Continue"
        isNextDisabled={rooms.length === 0}
      />
    </div>
  )
}
