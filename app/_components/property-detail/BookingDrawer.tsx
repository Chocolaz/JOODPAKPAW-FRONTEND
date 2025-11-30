import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { searchRoomCategories } from '@/lib/api'
import { RoomCategories } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { normalizeRoomCategories } from '@/lib/utils'
import { BookingRoomTable } from './BookingRoomTable'
import { BookingSearchBar, SearchParams } from './BookingSearchBar'

interface BookingDrawerProps {
  propertyId: number
}

export function BookingDrawer({ propertyId }: BookingDrawerProps) {
  const [roomCategories, setRoomCategories] = React.useState<RoomCategories[]>(
    []
  )
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedRooms, setSelectedRooms] = React.useState<
    Record<number, number>
  >({})

  const handleSelectChange = (categoryId: number, value: number) => {
    setSelectedRooms((prev) => {
      const newSelectedRooms = { ...prev }
      if (value === 0) {
        delete newSelectedRooms[categoryId]
      } else {
        newSelectedRooms[categoryId] = value
      }
      return newSelectedRooms
    })
  }

  const handleSearch = async (params: SearchParams) => {
    if (!params.checkInDate || !params.checkOutDate) {
      toast.error('Please select check-in and check-out dates.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await searchRoomCategories(
        propertyId,
        params.checkInDate,
        params.checkOutDate,
        params.numberOfPets
      )
      const normalizedCategories = normalizeRoomCategories(
        response.roomCategories
      )
      setRoomCategories(normalizedCategories)
    } catch (err) {
      setError('Failed to search for rooms.')
      toast.error('Failed to search for rooms.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-off-white border-t p-4 flex items-center justify-between z-10 max-w-4xl mx-auto rounded-t-[20px] shadow-lg">
      <Drawer>
        <DrawerTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="p-2 border border-accent-orange rounded-full">
              <CalendarIcon className="h-6 w-6 text-accent-orange" />
            </div>
            <div>
              <h4 className="leading-none">Pick your date</h4>
              <p className="text-neutral-gray">When is your pet's stay?</p>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl h-[80vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>Select dates and rooms</DrawerTitle>
              <DrawerDescription>
                Find the perfect room for your pet's stay.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-5">
              <BookingSearchBar onSearch={handleSearch} />
              <h4 className="text-deep-teal">Select a Room</h4>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {/* Room selection - scrollable */}
              <div>
                {loading && (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                  <div>
                    <BookingRoomTable
                      categories={roomCategories}
                      selectedRooms={selectedRooms}
                      onSelectChange={handleSelectChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button className="bg-positive-green">Confirm</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
      <Button variant="default" className="p-5 bg-accent-orange">
        Book Now
      </Button>
    </div>
  )
}
