import { BedDouble, Dog } from 'lucide-react'
import { RoomCategory } from '@/types'
import { cn } from '@/lib/utils'

export function RoomCategoryCard({ category }: { category: RoomCategory }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm text-left">
      <h3 className="font-bold text-lg text-deep-teal">{category.name}</h3>
      <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-neutral-dark">
        <p className="flex items-center gap-2">
          <BedDouble className="w-4 h-4 text-neutral-gray" />{' '}
          {category.totalRoom} rooms
        </p>
        <p className="font-semibold text-lg text-right text-positive-green">
          {category.basePrice} THB
        </p>
        <p className="flex items-center gap-2">
          <Dog className="w-4 h-4 text-neutral-gray" /> {category.numberOfPets}{' '}
          pets/room
        </p>
      </div>
      {category.pets.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-neutral-gray">
            Allowed Pets:
          </p>
          <div className="flex flex-wrap gap-2 mt-1">
            {category.pets.map((p) => (
              <span
                key={p.id}
                className="text-xs bg-gray-100 rounded-full px-2 py-1"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
