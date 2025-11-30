'use client'

import { RoomCategories } from '@/types'
import { getPetPolicy } from '@/lib/utils'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'

interface BookingRoomTableProps {
  categories: RoomCategories[]
  selectedRooms: Record<number, number> // key = categoryId, value = amount selected
  onSelectChange: (categoryId: number, value: number) => void
}

export function BookingRoomTable({
  categories,
  selectedRooms,
  onSelectChange,
}: BookingRoomTableProps) {
  const availableCategories = categories.filter((cat) => cat.isAvailable)

  if (categories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-neutral-500">
          Please select dates and number of pets to see available rooms.
        </p>
      </div>
    )
  }

  if (availableCategories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-neutral-500">
          No rooms available for the selected dates and pets.
        </p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="text-neutral-600 text-sm">
          <TableHead className="py-3 font-medium">Room</TableHead>
          <TableHead className="py-3 font-medium">Allowed</TableHead>
          <TableHead className="py-3 font-medium">Total Price</TableHead>
          <TableHead className="py-3 font-medium">Select</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {availableCategories.map((cat) => {
          const totalNights = cat.availability.dates.length
          const averagePricePerNight =
            totalNights > 0
              ? Math.round(cat.availability.totalPrice / totalNights)
              : 0 // Use 0 as fallback

          return (
            <TableRow key={cat.id}>
              {/* --- COL 1: Room Name --- */}
              <TableCell className="py-4 align-top">
                <p className="font-medium capitalize text-[#222]">{cat.name}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(cat.facilities || []).map((facility) => (
                    <div
                      key={facility.id}
                      className="bg-gray-200 rounded-full px-2.5 py-1 text-xs"
                    >
                      {facility.name}
                    </div>
                  ))}
                </div>
              </TableCell>

              {/* --- COL 2: Pets Allowed --- */}
              <TableCell className="py-4 align-top">
                <div className="flex flex-col gap-1.5 text-sm">
                  {/* Pets summary */}
                  <div className="flex items-center gap-2 font-medium text-sm">
                    {getPetPolicy(cat.pets)}
                  </div>

                  {/* Number of pets */}
                  <div className="flex items-center gap-2 text-neutral-600 text-xs">
                    <span>{cat.numberOfPets} pets / room</span>
                  </div>
                </div>
              </TableCell>

              {/* --- COL 3: Price --- */}
              <TableCell className="py-4 align-top">
                <p className=" font-medium">
                  {cat.availability.totalPrice.toLocaleString()} THB
                </p>
                {totalNights > 0 && (
                  <p className="text-neutral-600 text-xs mt-1">
                    {averagePricePerNight.toLocaleString()} THB / night
                  </p>
                )}
              </TableCell>

              {/* --- COL 4: Select --- */}
              <TableCell className="py-4 align-top">
                <Select
                  value={String(selectedRooms[cat.id] ?? 0)}
                  onValueChange={(v) => onSelectChange(cat.id, Number(v))}
                  // disabled={isRowDisabled} // Removed this line
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue>{selectedRooms[cat.id] ?? 0}</SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    {Array.from(
                      { length: cat.availability.availableRooms + 1 },
                      (_, i) => {
                        const num = i
                        const roomsNeeded = cat.availability.roomsNeeded
                        const isDisabled =
                          roomsNeeded > 0 ? num > 0 && num < roomsNeeded : false
                        return (
                          <SelectItem
                            key={num}
                            value={String(num)}
                            disabled={isDisabled}
                          >
                            {num}
                          </SelectItem>
                        )
                      }
                    )}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
