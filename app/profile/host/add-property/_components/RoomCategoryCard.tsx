import { BedDouble, Dog, Minus } from 'lucide-react'
import { RoomCategory } from '@/types'
import { useState } from 'react'
import { deleteRoomCategory } from '@/lib/api'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'

interface RoomCategoryCardProps {
  category: RoomCategory
  propertyId: number
  onDeleteSuccess: () => void
}

export function RoomCategoryCard({
  category,
  propertyId,
  onDeleteSuccess,
}: RoomCategoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (window.confirm('Are you sure you want to delete this room category?')) {
      setIsDeleting(true)
      try {
        await deleteRoomCategory(propertyId, category.id)
        toast.success('Room Category Deleted')
        onDeleteSuccess()
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
  }

  return (
    <div className="relative mx-5 rounded-2xl border border-neutral-200 bg-white shadow-sm hover:shadow-md transition">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="
    absolute -top-4 -right-2 z-10 
    p-2 rounded-full
    bg-white/80 border border-neutral-300 
    shadow-sm
   text-red-600
    active:scale-95 
    transition-all
  "
        aria-label="Delete room category"
      >
        {isDeleting ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <Minus className="h-5 w-5" />
        )}
      </button>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <p className="font-medium text-deep-teal pr-10">{category.name}</p>

          <p className="text-right leading-tight">
            <span className="text-xl font-semibold text-neutral-900">
              {category.basePrice.toLocaleString()}
            </span>
            <span className="text-sm text-neutral-500 ml-1">THB / night</span>
          </p>
        </div>

        {/* Middle row: rooms + pets/room + allowed pets (right aligned) */}
        <div className="flex items-center justify-between flex-wrap gap-y-3 text-sm text-neutral-700">
          {/* Left side: rooms + pets per room */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <BedDouble className="w-4 h-4 text-accent-orange" />
              <span>{category.totalRoom} rooms</span>
            </div>

            <div className="flex items-center gap-2">
              <Dog className="w-4 h-4 text-accent-orange" />
              <span>{category.numberOfPets} pets / room</span>
            </div>
          </div>

          {/* Right side: allowed pets */}
          {category.pets.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {category.pets.map((p) => (
                  <span
                    key={p.id}
                    className="px-2 py-1 text-xs bg-black text-white rounded-full"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
