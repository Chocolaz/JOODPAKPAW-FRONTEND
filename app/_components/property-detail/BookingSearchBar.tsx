'use client'

import * as React from 'react'
import { format } from 'date-fns'
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
} from '@/components/ui/dialog'

export function BookingSearchBar() {
  const [date, setDate] = React.useState<DateRange | undefined>()
  const [numberOfPets, setNumberOfPets] = React.useState<number>(1)
  const [isDateDialogOpen, setIsDateDialogOpen] = React.useState(false)
  const [isPetsDialogOpen, setIsPetsDialogOpen] = React.useState(false)

  const handleSearch = () => {
    console.log({
      checkInDate: date?.from,
      checkOutDate: date?.to,
      numberOfPets: numberOfPets,
    })
  }

  return (
    <div className="flex items-center gap-2 p-2 rounded-full border shadow-lg bg-neutral-100 mb-4">
      {/* --- Date Range Picker --- */}
      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogTrigger asChild>
          <Button
            id="date"
            variant={'ghost'}
            className={cn(
              'flex-1 justify-start text-left font-normal rounded-full h-14 px-6 text-base hover:bg-neutral-200',
              !date && 'text-muted-foreground'
            )}
          >
            <div className="flex flex-col items-start">
              <span className="font-semibold text-xs">Dates</span>
              {date?.from ? (
                date.to ? (
                  <span className="text-sm">
                    {format(date.from, 'LLL dd')} - {format(date.to, 'LLL dd')}
                  </span>
                ) : (
                  <span className="text-sm">
                    {format(date.from, 'LLL dd, y')}
                  </span>
                )
              ) : (
                <span className="text-sm">Add dates</span>
              )}
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-auto p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-accent-orange">
              Select Dates
            </DialogTitle>
            <DialogDescription>
              Choose your check-in and check-out dates.
            </DialogDescription>
          </DialogHeader>
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            startMonth={new Date()}
            hidden={[{ before: new Date() }]}
            className="min-w-[280px] md:min-w-[500px]"
          />
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
              <span className="font-semibold text-xs">Pets</span>
              <span className="text-sm">
                {numberOfPets} pet
                {numberOfPets > 1 || numberOfPets === 0 ? 's' : ''}
              </span>
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle>Number of pets</DialogTitle>
            <DialogDescription>
              How many pets are you bringing?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-between p-4">
            <span className="font-medium">Pets</span>
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
        >
          <Search className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
