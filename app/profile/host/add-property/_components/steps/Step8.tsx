'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ArrowLeft } from 'lucide-react'

import { RoomCategoryCard } from '../RoomCategoryCard'

import { AddRoomCategoryForm } from '../../../_components/AddRoomCategoryForm'

import { useAddProperty } from '../../_context/AddPropertyContext'
import { getRoomCategories } from '@/lib/api'
import { RoomCategory } from '@/types'

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
  const {
    formData: propertyContextData,
    setHighestStepReached,
    clearAddPropertySession,
  } = useAddProperty()
  const propertyId = propertyContextData.propertyId

  const [rooms, setRooms] = useState<RoomCategory[]>([])
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
      setError(
        err instanceof Error ? err.message : 'Failed to fetch room categories.'
      )
    } finally {
      setLoading(false)
    }
  }, [propertyId])

  useEffect(() => {
    fetchRooms()
  }, [propertyId, fetchRooms])

  const handleAddSuccess = () => {
    fetchRooms()
    setIsDrawerOpen(false)
  }

  const handleNext = () => {
    setHighestStepReached(8)
    router.push('/profile/host/add-property/9')
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

      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <div className="space-y-4 text-left max-w-2xl mx-auto">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <DrawerTrigger asChild>
            <div className="mx-5 px-6 py-8 border-2 border-dashed border-positive-green rounded-xl cursor-pointer hover:bg-green-50/50 transition-colors">
              <div className="font-medium text-deep-teal text-lg flex items-center justify-between w-full">
                <span>Add Room</span>
                <Plus className="h-6 w-6 text-positive-green" />
              </div>
            </div>
          </DrawerTrigger>

          {rooms.length > 0 &&
            rooms.map((room) => (
              <RoomCategoryCard
                key={room.id}
                category={room}
                propertyId={propertyId!}
                onDeleteSuccess={fetchRooms}
              />
            ))}
        </div>

        <DrawerContent>
          <DrawerHeader className="relative">
            <DrawerTitle className="text-center">Add Room Category</DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-2"
              onClick={() => setIsDrawerOpen(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </DrawerHeader>
          {propertyId && (
            <AddRoomCategoryForm
              propertyId={propertyId}
              onAddSuccess={handleAddSuccess}
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
