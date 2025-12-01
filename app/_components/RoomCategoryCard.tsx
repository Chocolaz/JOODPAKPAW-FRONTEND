import { BedDouble, PawPrint, Minus } from 'lucide-react'
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
      onDeleteSuccess(category.id) 
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
          'relative rounded-2xl border border-neutral-200 bg-white shadow-md/20 hover:shadow-lg/30 transition-all duration-300 overflow-visible', // เพิ่ม overflow-visible
          className
        )}
      >
        {canDelete && (
          <button
            onClick={handleDeleteClick}
            disabled={isOnlyRoom || isDeleting}
            className="
        absolute -top-3 -right-3 z-20  /* เพิ่ม z-index สูง */
        p-2 rounded-full backdrop-blur-md
        bg-white/70 border border-neutral-300
        shadow-md hover:shadow-lg transition
        text-red-600 active:scale-95 disabled:opacity-40
      "
          >
            {isDeleting ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Minus className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 min-w-0">
            {/* Title */}
            <p className="font-semibold text-deep-teal text-lg leading-tight truncate">
              {category.name}
            </p>

            {/* Price */}
            <p className="shrink-0 text-right">
              <span className="text-xl font-semibold text-neutral-900">
                {category.basePrice.toLocaleString()}
              </span>
              <span className="text-neutral-500 ml-1 text-sm">THB / night</span>
            </p>
          </div>

          {/* Rooms + Pets */}
          <div className="flex items-start justify-between flex-wrap gap-3 text-sm text-neutral-700">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-accent-orange/80" />
                <span>
                  {category.totalRoom}{' '}
                  {category.totalRoom === 1 ? 'room' : 'rooms'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-accent-orange/80" />
                <span>{category.numberOfPets} pets max</span>
              </div>
            </div>

            {petPolicy && (
              <span
                className="
          inline-flex items-center px-2.5 py-1 rounded-full 
          text-xs bg-neutral-900 text-white font-medium shadow-sm
        "
              >
                {petPolicy}
              </span>
            )}
          </div>

          {/* Facilities */}
          {(category.facilities || []).length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {category.facilities?.map((facility) => (
                <span
                  key={facility.id}
                  className="
              inline-flex items-center px-2 py-1 rounded-full 
              text-xs bg-neutral-100 text-neutral-700 border border-neutral-200
            "
                >
                  {facility.name}
                </span>
              ))}
            </div>
          )}
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
