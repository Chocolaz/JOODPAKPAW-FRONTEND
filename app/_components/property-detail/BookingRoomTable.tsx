'use client'

import { getPetPolicy } from '@/lib/utils'
import { RoomCategories } from '@/types'
import { Home } from 'lucide-react'
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
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-neutral-600 text-sm">
          <TableHead className="py-3 font-medium">Room</TableHead>
          <TableHead className="py-3 font-medium">Pets Allowed</TableHead>
          <TableHead className="py-3 font-medium">Price / night</TableHead>
          <TableHead className="py-3 font-medium w-[70px]">Rooms</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.map((cat) => (
          <TableRow key={cat.id}>
            {/* --- COL 1: Room Name --- */}
            <TableCell className="py-4 align-top">
              <p className="font-semibold text-[15px] capitalize text-[#222]">
                {cat.name}
              </p>
              <div className="flex items-center mt-1 text-sm text-neutral-600 gap-2">
                {cat.totalRoom} rooms
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
              <p className="font-semibold text-[16px] text-[#111]">
                {cat.basePrice.toLocaleString()} THB
              </p>
            </TableCell>

            {/* --- COL 4: Select --- */}
            <TableCell className="py-4 align-top">
              <Select
                value={String(selectedRooms[cat.id] ?? 1)}
                onValueChange={(v) => onSelectChange(cat.id, Number(v))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {Array.from({ length: cat.totalRoom }, (_, index) => {
                    const value = index + 1
                    return (
                      <SelectItem key={value} value={String(value)}>
                        {value}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
