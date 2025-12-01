import { BedDouble, Dog, Minus } from 'lucide-react'
import { RoomCategories } from '@/types'
import { useState, useMemo } from 'react'
import { deleteRoomCategory } from '@/lib/api'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { ConfirmationModal } from '@/app/_components/ConfirmationModal'
import { cn } from '@/lib/utils'
import { getPetPolicy } from '@/lib/utils'

interface RoomCategoryCardProps {
  category: RoomCategories
  propertyId?: number
  onDeleteSuccess?: (deletedCategoryId: number) => void
  showDeleteButton?: boolean
  className?: string
  isOnlyRoom?: boolean
}

export function RoomCategoryCard({
  category,
  propertyId,
  onDeleteSuccess,
  showDeleteButton = false,
  className,
  isOnlyRoom = false,
}: RoomCategoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const canDelete =
    showDeleteButton && propertyId !== undefined && onDeleteSuccess

  const petPolicy = useMemo(() => getPetPolicy(category.pets), [category.pets])

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setIsModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!canDelete || !propertyId || !onDeleteSuccess) return

    setIsModalOpen(false)
    setIsDeleting(true)
    try {
      await deleteRoomCategory(propertyId, category.id)
      toast.success('Room Category Deleted')
      onDeleteSuccess(category.id) // Pass the ID here
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to delete room category'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          'relative rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition',
          className
        )}
      >
        {/* Delete Button */}
        {canDelete && ( // Conditionally render
          <button
            onClick={handleDeleteClick}
            disabled={isOnlyRoom || isDeleting}
            title={
              isOnlyRoom
                ? 'Cannot delete the only room'
                : 'Delete room category'
            }
            className="
                          absolute -top-4 -right-2 z-10
                          p-2 rounded-full
                          bg-white/80 border border-neutral-300
                          shadow-sm
                         text-red-600
                          active:scale-95
                          transition-all
                          disabled:opacity-50
                        "
            aria-label="Delete room category"
          >
            {isDeleting ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Minus className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <p className="font-medium text-deep-teal">
              {category.name.length > 25
                ? category.name.substring(0, 25) + '...'
                : category.name}
            </p>

            <p className="text-right ">
              <span className="font-semibold text-neutral-900">
                {category.basePrice.toLocaleString()}
              </span>
              <span className="text-neutral-500 ml-1">THB / night</span>
            </p>
          </div>

          {/* Middle row: rooms + pets/room + allowed pets (right aligned) */}
          <div className="flex items-center justify-between flex-wrap gap-y-3 text-sm text-neutral-700">
            {/* Left side: rooms + pets per room */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-accent-orange" />
                <span>
                  {category.totalRoom}{' '}
                  {category.totalRoom === 1 ? 'room' : 'rooms'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Dog className="w-4 h-4 text-accent-orange" />
                <span>{category.numberOfPets} pets max</span>
              </div>
            </div>

            {/* Pet Policy Chip */}
            {petPolicy && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-neutral-900 text-white font-medium">
                {petPolicy}
              </span>
            )}

            {/* Facilities */}
            {(category.facilities || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {category.facilities?.map((facility) => (
                  <span
                    key={facility.id}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-neutral-100 text-neutral-700"
                  >
                    {facility.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {canDelete && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Room Category"
          message={`Are you sure you want to delete the <strong>${category.name}</strong> room category? This action cannot be undone.`}
          confirmButtonClassName="bg-accent-orange hover:bg-red-700"
          titleClassName="text-accent-orange"
        />
      )}
    </>
  )
}
