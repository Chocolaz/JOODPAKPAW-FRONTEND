'use client'

import * as React from 'react'
import { DateRange } from 'react-day-picker'
import { RoomCategories } from '@/types'
import { searchRoomCategories } from '@/lib/api'
import { normalizeRoomCategories } from '@/lib/utils'
import { differenceInDays } from 'date-fns'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'
import { useAuth } from '@/app/_components/AuthContext'

interface BookingData {
  roomCategories: RoomCategories[]
  selectedRooms: Record<number, number>
  searchedNumberOfNights: number
}

interface BookingContextType {
  // Shared State
  date: DateRange | undefined
  numberOfPets: number
  loading: boolean
  error: string | null

  // Property-specific State (for the current property)
  currentPropertyData: Partial<BookingData>

  // Setters & Handlers
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  setNumberOfPets: React.Dispatch<React.SetStateAction<number>>
  handleSelectChange: (categoryId: number, value: number) => void
  handleSearch: (
    propertyId: number,
    checkInDate: string,
    checkOutDate: string,
    pets: number
  ) => Promise<void>
  clearBookingState: () => void
}

const BookingContext = React.createContext<BookingContextType | undefined>(
  undefined
)

const initialData: BookingData = {
  roomCategories: [],
  selectedRooms: {},
  searchedNumberOfNights: 0,
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  // Shared state across all properties
  const [date, setDate] = React.useState<DateRange | undefined>()
  const [numberOfPets, setNumberOfPets] = React.useState<number>(0)
  
  // Per-property state
  const [bookingData, setBookingData] = React.useState<
    Record<string, Partial<BookingData>>
  >({})

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const params = useParams()
  const { isAuthenticated } = useAuth()
  const currentPropertyId = params.propertyId as string | undefined

  const clearBookingState = () => {
    setBookingData({})
    setDate(undefined)
    setNumberOfPets(0)
    setError(null)
  }

  // Effect to clear state on logout
  React.useEffect(() => {
    if (!isAuthenticated) {
      clearBookingState()
    }
  }, [isAuthenticated])

  const handleSelectChange = (categoryId: number, value: number) => {
    if (!currentPropertyId) return

    setBookingData((prev) => {
      const currentPropertyBookingData = prev[currentPropertyId] ?? {}
      const currentSelectedRooms = currentPropertyBookingData.selectedRooms ?? {}
      
      const newSelectedRooms = { ...currentSelectedRooms }
      if (value === 0) {
        delete newSelectedRooms[categoryId]
      } else {
        newSelectedRooms[categoryId] = value
      }

      return {
        ...prev,
        [currentPropertyId]: {
          ...currentPropertyBookingData,
          selectedRooms: newSelectedRooms,
        },
      }
    })
  }

  const handleSearch = async (
    searchPropertyId: number,
    checkInDate: string,
    checkOutDate: string,
    pets: number
  ) => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await searchRoomCategories(
        searchPropertyId,
        checkInDate,
        checkOutDate,
        pets
      )
      const normalizedCategories = normalizeRoomCategories(
        response.roomCategories
      )
      
      const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0

      setBookingData(prev => ({
        ...prev,
        [searchPropertyId]: {
          ...prev[searchPropertyId],
          roomCategories: normalizedCategories,
          searchedNumberOfNights: nights,
        }
      }))

    } catch (err) {
      setError('Failed to search for rooms.')
      toast.error('Failed to search for rooms.')
    } finally {
      setLoading(false)
    }
  }

  const value: BookingContextType = {
    date,
    numberOfPets,
    loading,
    error,
    currentPropertyData: currentPropertyId ? bookingData[currentPropertyId] ?? {} : {},
    setDate,
    setNumberOfPets,
    handleSelectChange,
    handleSearch,
    clearBookingState,
  }

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  )
}

export function useBooking() {
  const context = React.useContext(BookingContext)
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}
