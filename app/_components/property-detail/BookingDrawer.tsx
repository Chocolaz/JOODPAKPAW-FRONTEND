import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
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
import { Spinner } from '@/components/ui/spinner'
import { BookingRoomTable } from './BookingRoomTable'
import { BookingSearchBar, SearchParams } from './BookingSearchBar'
import { useBooking } from '@/app/_context/BookingContext'
import { toast } from 'sonner'
import { format } from 'date-fns' // Import format
import { BookingRequestBody } from '@/types/api'
import { createBooking } from '@/lib/api'

interface BookingDrawerProps {
  propertyId: number
}

export function BookingDrawer({ propertyId }: BookingDrawerProps) {
  const router = useRouter()
  const [view, setView] = React.useState<'selection' | 'summary'>('selection')
  const [isBooking, setIsBooking] = React.useState(false)
  const {
    loading,
    error,
    date,
    setDate,
    numberOfPets,
    setNumberOfPets,
    handleSelectChange,
    handleSearch,
    currentPropertyData,
  } = useBooking()

  // Extract property-specific data with defaults
  const {
    roomCategories = [],
    selectedRooms = {},
    searchedNumberOfNights = 0,
  } = currentPropertyData

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setTimeout(() => setView('selection'), 500) // Reset view after drawer closes
    }
  }
  const onSearch = (params: SearchParams) => {
    if (!params.checkInDate || !params.checkOutDate) {
      toast.error('Please select check-in and check-out dates.')
      return
    }

    handleSearch(
      propertyId,
      params.checkInDate,
      params.checkOutDate,
      params.numberOfPets
    )
  }

  const handleProceedToSummary = () => {
    const totalSelectedRooms = Object.values(selectedRooms).reduce(
      (sum, count) => sum + count,
      0
    )
    if (totalSelectedRooms === 0) {
      toast.error('Please select at least one room.')
      return
    }
    setView('summary')
  }

  const handleConfirmBooking = async () => {
    if (!date?.from || !date?.to) {
      toast.error('Date range is not selected.')
      return
    }

    const bookingOrders = Object.entries(selectedRooms)
      .filter(([, roomsBooked]) => roomsBooked > 0)
      .map(([roomCategoryId, roomsBooked]) => ({
        roomCategoryId: Number(roomCategoryId),
        checkInDate: format(date.from!, 'yyyy-MM-dd'),
        checkOutDate: format(date.to!, 'yyyy-MM-dd'),
        roomsBooked,
      }))

    if (bookingOrders.length === 0) {
      toast.error('No rooms selected for booking.')
      return
    }

    const bookingData: BookingRequestBody = {
      propertyId,
      numberOfPets,
      bookingOrders,
    }

    setIsBooking(true)
    try {
      const response = await createBooking(bookingData)
      if (response) {
        toast.success('Booking confirmed successfully!')
        // Optionally, you can redirect the user to a booking success page
        // router.push('/booking-success');
        // For now, we just close the drawer and maybe refresh data.
        // This part depends on how you want the UX to be post-booking.
      }
    } catch (error) {
      console.error('Booking failed:', error)
      toast.error('Failed to confirm booking. Please try again.')
    } finally {
      setIsBooking(false)
      // The drawer will be closed by the DrawerClose button.
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-off-white border-t p-4 flex items-center justify-between z-10 max-w-4xl mx-auto rounded-t-[20px] shadow-lg">
      <Drawer onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="p-2 border border-accent-orange rounded-full">
              <CalendarIcon className="h-6 w-6 text-accent-orange" />
            </div>
            <div>
              <h4 className="leading-none">
                {date?.from && date?.to
                  ? `${format(date.from, 'MMM dd')} - ${format(
                      date.to,
                      'MMM dd'
                    )}`
                  : 'Pick your date'}
              </h4>
              <p className="text-neutral-gray">
                {numberOfPets > 0
                  ? `${numberOfPets} pet${numberOfPets > 1 ? 's' : ''}`
                  : 'When is your pet&apos;s stay?'}
              </p>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl h-[80vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>Select Dates And Rooms</DrawerTitle>
              <DrawerDescription>
                Find the perfect room for your pet&apos;s stay.
              </DrawerDescription>
            </DrawerHeader>

            {view === 'selection' && (
              <>
                <div className="px-5">
                  <BookingSearchBar
                    onSearch={onSearch}
                    date={date}
                    setDate={setDate}
                    numberOfPets={numberOfPets}
                    setNumberOfPets={setNumberOfPets}
                  />
                  <h4 className="text-deep-teal">
                    Select a Room{' '}
                    {searchedNumberOfNights > 0 &&
                      `for ${searchedNumberOfNights} night${
                        searchedNumberOfNights > 1 ? 's' : ''
                      }`}
                  </h4>
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
                  <Button
                    className="bg-positive-green"
                    onClick={handleProceedToSummary}
                  >
                    Confirm
                  </Button>
                </DrawerFooter>
              </>
            )}

            {view === 'summary' && (
              <>
                <div className="flex-1 overflow-y-auto px-5 space-y-4">
                  <h3 className="text-lg font-semibold">Booking Summary</h3>
                  <div className="p-4 border rounded-lg space-y-2">
                    <p>
                      <strong>Check-in:</strong>{' '}
                      {date?.from ? format(date.from, 'PPP') : 'N/A'}
                    </p>
                    <p>
                      <strong>Check-out:</strong>{' '}
                      {date?.to ? format(date.to, 'PPP') : 'N/A'}
                    </p>
                    <p>
                      <strong>Total nights:</strong> {searchedNumberOfNights}
                    </p>
                    <p>
                      <strong>Number of pets:</strong> {numberOfPets}
                    </p>
                  </div>
                  <h4 className="font-semibold">Selected Rooms:</h4>
                  <div className="border rounded-lg">
                    <BookingRoomTable
                      categories={roomCategories.filter(
                        (cat) => selectedRooms[cat.id] > 0
                      )}
                      selectedRooms={selectedRooms}
                      onSelectChange={handleSelectChange}
                      isSummary={true} // Make table read-only
                    />
                  </div>
                </div>
                <DrawerFooter>
                  <Button
                    variant="outline"
                    onClick={() => setView('selection')}
                  >
                    Back
                  </Button>
                  <DrawerClose asChild>
                    <Button
                      className="bg-positive-green"
                      onClick={handleConfirmBooking}
                      disabled={isBooking}
                    >
                      {isBooking ? <Spinner /> : 'Confirm Booking'}
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>
      <Button variant="default" className="p-5 bg-accent-orange">
        Book Now
      </Button>
    </div>
  )
}
