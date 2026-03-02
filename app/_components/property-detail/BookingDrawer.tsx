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
import { BookingRoomCard } from './BookingRoomCard'
import { BookingSearchBar, SearchParams } from './BookingSearchBar'
import { useBooking } from '@/app/_context/BookingContext'
import { useAuth } from '@/app/_components/AuthContext'
import { getAllPetProfiles, getPetSizeCategories } from '@/lib/api'
import { PetProfile, PetSizeCategory } from '@/types'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface BookingDrawerProps {
  propertyId: number
}

export function BookingDrawer({ propertyId }: BookingDrawerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { requireAuth, isAuthenticated } = useAuth()

  const {
    loading,
    error,
    date,
    setDate,
    selectedPetIds,
    setSelectedPetIds,
    numberOfPets,
    setNumberOfPets,
    petSizeId,
    setPetSizeId,
    handleSelectChange,
    handleSearch,
    currentPropertyData,
  } = useBooking()

  const {
    roomCategories = [],
    selectedRooms = {},
    searchedNumberOfNights = 0,
  } = currentPropertyData

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [petProfiles, setPetProfiles] = React.useState<PetProfile[]>([])
  const [petProfilesLoading, setPetProfilesLoading] = React.useState(false)
  const [petSizeCategories, setPetSizeCategories] = React.useState<PetSizeCategory[]>([])

  React.useEffect(() => {
    getPetSizeCategories()
      .then((res) => setPetSizeCategories(res.petSizeCategories))
      .catch(() => setPetSizeCategories([]))
  }, [])

  const handlePetSizeUpdated = (petId: number, newSizeCategoryId: number) => {
    setPetProfiles((prev) =>
      prev.map((p) =>
        p.id === petId ? { ...p, petSizeCategoryId: newSizeCategoryId } : p
      )
    )
  }

  // Fetch pet profiles when authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      setPetProfiles([])
      return
    }
    setPetProfilesLoading(true)
    getAllPetProfiles()
      .then((res) => setPetProfiles(res.petProfiles))
      .catch(() => setPetProfiles([]))
      .finally(() => setPetProfilesLoading(false))
  }, [isAuthenticated])

  React.useEffect(() => {
    if (searchParams.get('drawer') === 'open') {
      setIsDrawerOpen(true)
    } else {
      setIsDrawerOpen(false)
    }
  }, [searchParams])

  const handleOpenChange = (open: boolean) => {
    setIsDrawerOpen(open)
    const newSearchParams = new URLSearchParams(searchParams.toString())
    if (open) {
      newSearchParams.set('drawer', 'open')
    } else {
      newSearchParams.delete('drawer')
    }
    router.replace(`?${newSearchParams.toString()}`, { scroll: false })
  }

  const totalSelectedRooms = React.useMemo(() => {
    return Object.values(selectedRooms).reduce(
      (sum: number, count: number) => sum + count,
      0
    )
  }, [selectedRooms])

  const activePetCount = selectedPetIds.length > 0 ? selectedPetIds.length : numberOfPets

  const isContinueDisabled = React.useMemo(() => {
    return totalSelectedRooms === 0 || !date?.from || !date?.to || activePetCount === 0
  }, [totalSelectedRooms, date, activePetCount])

  const onSearch = (params: SearchParams) => {
    if (!params.checkInDate || !params.checkOutDate) {
      toast.error('Please select check-in and check-out dates.')
      return
    }
    handleSearch(
      propertyId,
      params.checkInDate,
      params.checkOutDate,
      params.petCount,
      params.petSizeId
    )
  }

  const handleContinue = () => {
    if (!requireAuth()) return

    if (activePetCount === 0) {
      toast.error('Please select at least one pet.')
      return
    }

    if (totalSelectedRooms === 0) {
      toast.error('Please select at least one room.')
      return
    }

    if (!date?.from || !date?.to) {
      toast.error('Please select valid dates.')
      return
    }

    const roomNames: { [key: string]: string } = {}
    Object.keys(selectedRooms).forEach((roomId) => {
      const roomCategory = roomCategories.find(
        (cat) => cat.id.toString() === roomId
      )
      if (roomCategory) {
        roomNames[roomId] = roomCategory.name
      }
    })

    const currentSearchParams = new URLSearchParams(searchParams.toString())
    if (isDrawerOpen) {
      currentSearchParams.set('drawer', 'open')
    } else {
      currentSearchParams.delete('drawer')
    }

    router.push(
      `/booking/confirm?propertyId=${propertyId}` +
        `&start=${format(date.from, 'yyyy-MM-dd')}` +
        `&end=${format(date.to, 'yyyy-MM-dd')}` +
        (selectedPetIds.length > 0
          ? `&petIds=${selectedPetIds.join(',')}`
          : `&pets=${numberOfPets}`) +
        `&rooms=${encodeURIComponent(JSON.stringify(selectedRooms))}` +
        `&roomNames=${encodeURIComponent(JSON.stringify(roomNames))}` +
        (currentSearchParams.toString()
          ? `&${currentSearchParams.toString()}`
          : '')
    )
  }

  const petCountText = React.useMemo(() => {
    if (selectedPetIds.length > 0) {
      const names = petProfiles
        .filter((p) => selectedPetIds.includes(p.id))
        .map((p) => p.name)
      if (names.length === 0) return `${selectedPetIds.length} pet${selectedPetIds.length > 1 ? 's' : ''}`
      if (names.length <= 2) return names.join(', ')
      return `${names[0]}, +${names.length - 1} more`
    }
    if (numberOfPets > 0) return `${numberOfPets} pet${numberOfPets > 1 ? 's' : ''}`
    return 'Select pets'
  }, [selectedPetIds, numberOfPets, petProfiles])

  const roomCountText = React.useMemo(() => {
    if (totalSelectedRooms > 0) {
      return `${totalSelectedRooms} room${totalSelectedRooms > 1 ? 's' : ''}`
    }
    return '0 rooms'
  }, [totalSelectedRooms])

  const combinedText = React.useMemo(() => {
    if (activePetCount === 0 && totalSelectedRooms === 0) {
      return "When is your pet's stay?"
    }
    return `${petCountText} • ${roomCountText}`
  }, [petCountText, roomCountText, activePetCount, totalSelectedRooms])

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
                  ? `${format(date.from, 'MMM dd')} - ${format(date.to, 'MMM dd')}`
                  : 'Pick your date'}
              </h4>
              <p className="text-neutral-gray">{combinedText}</p>
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

            <div className="px-5">
              <BookingSearchBar
                onSearch={onSearch}
                date={date}
                setDate={setDate}
                selectedPetIds={selectedPetIds}
                setSelectedPetIds={setSelectedPetIds}
                numberOfPets={numberOfPets}
                setNumberOfPets={setNumberOfPets}
                petSizeId={petSizeId}
                setPetSizeId={setPetSizeId}
                petProfiles={petProfiles}
                petProfilesLoading={petProfilesLoading}
                petSizeCategories={petSizeCategories}
                onPetSizeUpdated={handlePetSizeUpdated}
              />
              <h4 className="text-deep-teal mb-2">
                Select a Room{' '}
                {searchedNumberOfNights > 0 &&
                  `for ${searchedNumberOfNights} night${searchedNumberOfNights > 1 ? 's' : ''}`}
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
                <BookingRoomCard
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
                className="bg-positive-green"
                onClick={handleContinue}
                disabled={isContinueDisabled}
              >
                Continue
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <Button
        variant="default"
        className="p-5 bg-accent-orange"
        onClick={handleContinue}
        disabled={isContinueDisabled}
      >
        Book Now
      </Button>
    </div>
  )
}
