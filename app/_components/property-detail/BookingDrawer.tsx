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
import { normalizeRoomCategories, cn } from '@/lib/utils'
import { RoomCategoryCard } from '@/app/_components/RoomCategoryCard'

interface BookingDrawerProps {
  propertyId: number
}

export function BookingDrawer({ propertyId }: BookingDrawerProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [roomCategories, setRoomCategories] = React.useState<RoomCategories[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = React.useState<number | null>(null)

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
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Pick your date</DrawerTitle>
              <DrawerDescription>When is your pet's stay?</DrawerDescription>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>

            <div className="p-4">
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
                <div className="space-y-2">
                  {roomCategories.map((room) => (
                    <label key={room.id} className="cursor-pointer">
                      <input
                        type="radio"
                        name="roomCategory"
                        value={room.id}
                        checked={selectedRoom === room.id}
                        onChange={() => setSelectedRoom(room.id)}
                        className="sr-only" // Hide the actual radio button
                      />
                      <RoomCategoryCard
                        category={room}
                        className={cn(
                          'shadow-none hover:shadow-none',
                          selectedRoom === room.id
                            ? 'border-positive-green ring-2 ring-positive-green'
                            : 'border-neutral-200 hover:border-deep-teal/40'
                        )}
                      />
                    </label>
                  ))}
                </div>
              )}
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
