'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

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
  DrawerDescription,
  DrawerTrigger,
} from '@/components/ui/drawer'

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
