'use client'

import * as React from 'react'
import { format, differenceInDays } from 'date-fns'
import { Calendar as CalendarIcon, PawPrint, Search } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export interface SearchParams {
  checkInDate: string | undefined
  checkOutDate: string | undefined
  numberOfPets: number
}

interface BookingSearchBarProps {
  onSearch: (params: SearchParams) => void
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  numberOfPets: number
  setNumberOfPets: React.Dispatch<React.SetStateAction<number>>
}

export function BookingSearchBar({
  onSearch,
  date,
  setDate,
  numberOfPets,
  setNumberOfPets,
}: BookingSearchBarProps) {
  const [selectedDateRange, setSelectedDateRange] = React.useState<
    DateRange | undefined
  >(undefined)
  const [isDateDialogOpen, setIsDateDialogOpen] = React.useState(false)
  const [isPetsDialogOpen, setIsPetsDialogOpen] = React.useState(false)

  React.useEffect(() => {
    if (isDateDialogOpen) {
      setSelectedDateRange(date)
    }
  }, [isDateDialogOpen, date])

  const handleConfirmDate = () => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      setDate(selectedDateRange)
      setIsDateDialogOpen(false)
    }
  }

  const isConfirmButtonDisabled = React.useMemo(() => {
    if (!selectedDateRange?.from || !selectedDateRange?.to) return true
    return differenceInDays(selectedDateRange.to, selectedDateRange.from) < 1
  }, [selectedDateRange])

  const handleSearch = () => {
    onSearch({
      checkInDate: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
      checkOutDate: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
      numberOfPets: numberOfPets,
    })
  }

  return (
    <div className="flex items-center gap-2 p-2 rounded-full border bg-off-white shadow-sm mb-4">
      {/* --- Date Range Picker --- */}
      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogTrigger asChild>
          <Button
            id="date"
            variant="ghost"
            className={cn(
              'flex-1 justify-start text-left font-normal rounded-full h-14 px-6 text-base hover:bg-neutral-200',
              !date && 'text-muted-foreground'
            )}
          >
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm text-deep-teal">
                Dates
              </span>
              {date?.from ? (
                date.to ? (
                  <span>
                    {format(date.from, 'LLL dd')} - {format(date.to, 'LLL dd')}
                  </span>
                ) : (
                  <span>{format(date.from, 'LLL dd, y')}</span>
                )
              ) : (
                <span>Add dates</span>
              )}
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="w-auto max-h-[90vh] p-6 flex flex-col gap-2 overflow-y-auto">
          <DialogHeader className="text-left">
            <DialogTitle className="text-accent-orange">
              Select Dates
            </DialogTitle>
            <DialogDescription>
              Choose your check-in and check-out dates.
            </DialogDescription>
          </DialogHeader>

          {/* Calendar wrapper */}
          <div className="flex justify-center">
            <Calendar
              mode="range"
              defaultMonth={selectedDateRange?.from}
              selected={selectedDateRange}
              onSelect={setSelectedDateRange}
              numberOfMonths={2}
              startMonth={new Date()}
              hidden={[{ before: new Date() }]}
              fixedWeeks
              className="min-w-[280px] md:min-w-[400px]"
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleConfirmDate}
              disabled={isConfirmButtonDisabled}
              className="bg-positive-green w-full"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Pets Selector --- */}
      <Dialog open={isPetsDialogOpen} onOpenChange={setIsPetsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant={'ghost'}
            className="flex-1 justify-start text-left font-normal rounded-full h-14 px-6 text-base hover:bg-neutral-200"
          >
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm text-deep-teal">Pets</span>
              <span>
                {numberOfPets} pet
                {numberOfPets > 1 || numberOfPets === 0 ? 's' : ''}
              </span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle className="text-accent-orange">
              Number of pets
            </DialogTitle>
            <DialogDescription>
              How many pets are you bringing?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between p-4">
            <span className="font-medium text-deep-teal">Pets</span>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setNumberOfPets(Math.max(0, numberOfPets - 1))}
                disabled={numberOfPets === 0}
              >
                -
              </Button>
              <span className="w-8 text-center">{numberOfPets}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setNumberOfPets(Math.min(5, numberOfPets + 1))}
                disabled={numberOfPets === 5}
              >
                +
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- Search Button --- */}
      <div className="p-1">
        <Button
          onClick={handleSearch}
          className="h-12 w-12 rounded-full bg-accent-orange hover:bg-accent-orange/90"
          size="icon"
          disabled={!date?.from || !date?.to || numberOfPets === 0}
        >
          <Search className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
