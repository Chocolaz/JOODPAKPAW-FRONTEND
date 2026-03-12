import { RoomCategories } from '@/types'
import { RoomCategoryCard } from '@/app/_components/RoomCategoryCard'

interface PropertyRoomCategoriesProps {
  roomCategories: RoomCategories[]
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

  const handleDelete = () => {
    if (onDeleteSuccess) {
      onDeleteSuccess()
    }
  }

  return (
    <div className="border-t pt-8 mt-10">
      <h3 className="text-lg lg:text-xl font-semibold text-deep-teal mb-5">Room Categories</h3>
      <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
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
