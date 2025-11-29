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
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { getRoomCategories } from '@/lib/api'
import { RoomCategories } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { normalizeRoomCategories } from '@/lib/utils'
import { BookingRoomTable } from './BookingRoomTable'

interface BookingDrawerProps {
  propertyId: number
}

export function BookingDrawer({ propertyId }: BookingDrawerProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [roomCategories, setRoomCategories] = React.useState<RoomCategories[]>(
    []
  )
  const [loading, setLoading] = React.useState(true)
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

  React.useEffect(() => {
    const fetchRoomCategories = async () => {
      try {
        setLoading(true)
        const response = await getRoomCategories(propertyId)
        const normalizedCategories = normalizeRoomCategories(
          response.roomCategories
        )
        setRoomCategories(normalizedCategories)
      } catch (err) {
        setError('Failed to load room types.')
        toast.error('Failed to load room types.')
      } finally {
        setLoading(false)
      }
    }

    fetchRoomCategories()
  }, [propertyId])

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
          <div className="mx-auto w-full max-w-[500px] max-h-[80vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>Pick your date</DrawerTitle>
              <DrawerDescription>When is your pet's stay?</DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto px-5">
              {/* Calendar */}
              <div className="shrink-0">
                <div className="w-full max-w-[500px] px-10 pb-2 mx-auto">
                  <Calendar
                    mode="single"
                    selected={date} // state ของ selected date
                    onSelect={setDate} // update state เมื่อ user เลือก
                    className="rounded-md border text-sm" // compact style
                    fromDate={new Date()} // disable วันที่ก่อนวันนี้
                  />
                </div>
              </div>

              {/* Room selection - scrollable */}
              <div className=" flex-1">
                <h3 className="text-lg font-medium text-deep-teal mb-2">
                  Select a Room
                </h3>

                {loading && (
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && !error && (
                  <BookingRoomTable
                    categories={roomCategories}
                    selectedRooms={selectedRooms}
                    onSelectChange={handleSelectChange}
                  />
                )}
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
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
