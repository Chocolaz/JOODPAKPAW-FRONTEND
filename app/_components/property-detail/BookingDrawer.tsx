'use client'

import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { format } from 'date-fns'

interface BookingDrawerProps {
  propertyId: number
}

export function BookingDrawer({ propertyId }: BookingDrawerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

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

  const {
    roomCategories = [],
    selectedRooms = {},
    searchedNumberOfNights = 0,
  } = currentPropertyData

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  React.useEffect(() => {
    if (searchParams.get('drawer') === 'open') {
      setIsDrawerOpen(true);
    } else {
      setIsDrawerOpen(false);
    }
  }, [searchParams]);

  const handleOpenChange = (open: boolean) => {
    setIsDrawerOpen(open);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (open) {
      newSearchParams.set('drawer', 'open');
    } else {
      newSearchParams.delete('drawer');
    }
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  };


  // Calculate total selected rooms
  const totalSelectedRooms = React.useMemo(() => {
    return Object.values(selectedRooms).reduce(
      (sum: number, count: number) => sum + count,
      0
    );
  }, [selectedRooms]);

  // Determine if the continue button should be disabled
  const isContinueDisabled = React.useMemo(() => {
    return totalSelectedRooms === 0 || !date?.from || !date?.to;
  }, [totalSelectedRooms, date]);

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

  const handleContinue = () => {
    // The disable logic on the button will prevent this from being called if no rooms/dates are selected
    // but keep these checks for robustness or if the button state logic changes.
    if (totalSelectedRooms === 0) {
      toast.error('Please select at least one room.')
      return
    }

    if (!date?.from || !date?.to) {
      toast.error('Please select valid dates.')
      return
    }

    // 👉 Redirect to confirm page
    const currentSearchParams = new URLSearchParams(searchParams.toString());
    if (isDrawerOpen) {
      currentSearchParams.set('drawer', 'open');
    } else {
      currentSearchParams.delete('drawer');
    }
    
    router.push(
      `/booking/confirm?propertyId=${propertyId}` +
        `&start=${format(date.from, 'yyyy-MM-dd')}` +
        `&end=${format(date.to, 'yyyy-MM-dd')}` +
        `&pets=${numberOfPets}` +
        `&rooms=${encodeURIComponent(JSON.stringify(selectedRooms))}` +
        (currentSearchParams.toString() ? `&${currentSearchParams.toString()}` : '')
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-off-white border-t p-4 flex items-center justify-between z-10 max-w-4xl mx-auto rounded-t-[20px] shadow-lg">
      <Drawer open={isDrawerOpen} onOpenChange={handleOpenChange}>
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
                  : "When is your pet's stay?"}
              </p>
            </div>
          </div>
        </DrawerTrigger>

        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl h-[80vh] flex flex-col">
            <DrawerHeader>
              <DrawerTitle>Select Dates And Rooms</DrawerTitle>
              <DrawerDescription>
                Find the perfect room for your pet's stay.
              </DrawerDescription>
            </DrawerHeader>

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

            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>

              <Button
                className="bg-accent-orange"
                onClick={handleContinue}
                disabled={isContinueDisabled} // Disable button
              >
                Continue
              </Button>
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
