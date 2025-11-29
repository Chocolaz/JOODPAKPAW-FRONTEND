import { RoomCategories } from '@/types'
import { RoomCategoryCard } from '@/app/profile/host/add-property/_components/RoomCategoryCard'

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
    // Since roomCategories are now passed as a prop,
    // any deletion would need to be handled by re-fetching
    // in the parent component, which is triggered by onDeleteSuccess.
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
