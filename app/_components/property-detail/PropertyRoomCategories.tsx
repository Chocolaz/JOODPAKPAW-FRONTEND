'use client'

import { RoomCategory } from '@/types'
import { RoomCategoryCard } from '@/app/profile/host/add-property/_components/RoomCategoryCard'

interface PropertyRoomCategoriesProps {
  roomCategories: RoomCategory[]
  propertyId: number
  onDeleteSuccess?: () => void
  showDeleteButton?: boolean
}

export function PropertyRoomCategories({
  roomCategories,
  propertyId,
  onDeleteSuccess,
  showDeleteButton,
}: PropertyRoomCategoriesProps) {
  if (!roomCategories || roomCategories.length === 0) {
    return null
  }

  return (
    <div className="border-t pt-8 mt-10">
      <h2 className="text-xl font-semibold mb-3 text-gray-900">
        Room Categories
      </h2>
      <div className="space-y-4">
        {roomCategories.map((category) => (
          <RoomCategoryCard
            key={category.id}
            category={category}
            propertyId={propertyId}
            onDeleteSuccess={onDeleteSuccess || (() => {})}
            showDeleteButton={showDeleteButton}
          />
        ))}
      </div>
    </div>
  )
}
