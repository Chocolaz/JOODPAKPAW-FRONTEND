'use client'

import { RoomCategories } from '@/types'
import { RoomCategoryCard } from '@/app/profile/host/add-property/_components/RoomCategoryCard'
import { getRoomCategories } from '@/lib/api'
import { useCallback, useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

interface PropertyRoomCategoriesProps {
  propertyId: number
  onDeleteSuccess?: () => void
  showDeleteButton?: boolean
}

export function PropertyRoomCategories({
  propertyId,
  onDeleteSuccess,
  showDeleteButton,
}: PropertyRoomCategoriesProps) {
  const [roomCategories, setRoomCategories] = useState<RoomCategories[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getRoomCategories(propertyId)
      setRoomCategories(res.roomCategories)
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
  }, [fetchRooms])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  if (!roomCategories || roomCategories.length === 0) {
    return null
  }

  const handleDelete = () => {
    fetchRooms()
    if (onDeleteSuccess) {
      onDeleteSuccess()
    }
  }

  return (
    <div className="border-t pt-8 mt-10">
      <h3 className="mb-3 text-deep-teal">Room Categories</h3>
      <div className="space-y-4">
        {roomCategories.map((category) => (
          <RoomCategoryCard
            key={category.id}
            category={category}
            propertyId={propertyId}
            onDeleteSuccess={handleDelete}
            showDeleteButton={showDeleteButton}
          />
        ))}
      </div>
    </div>
  )
}
