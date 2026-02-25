'use client'

import * as React from 'react'
import { format, differenceInDays } from 'date-fns'
import { DateRange } from 'react-day-picker'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

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
import { PawPrint, CheckCircle2, Hash } from 'lucide-react'
import { PetProfile } from '@/types'

export interface SearchParams {
  checkInDate: string | undefined
  checkOutDate: string | undefined
  petCount: number
}

interface BookingSearchBarProps {
  onSearch: (params: SearchParams) => void
  date: DateRange | undefined
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  selectedPetIds: number[]
  setSelectedPetIds: React.Dispatch<React.SetStateAction<number[]>>
  numberOfPets: number
  setNumberOfPets: React.Dispatch<React.SetStateAction<number>>
  petProfiles: PetProfile[]
  petProfilesLoading: boolean
}

type PetMode = 'profiles' | 'count'

export function BookingSearchBar({
  onSearch,
  date,
  setDate,
  selectedPetIds,
  setSelectedPetIds,
  numberOfPets,
  setNumberOfPets,
  petProfiles,
  petProfilesLoading,
}: BookingSearchBarProps) {
  const [selectedDateRange, setSelectedDateRange] = React.useState<
    DateRange | undefined
  >(undefined)
  const [isDateDialogOpen, setIsDateDialogOpen] = React.useState(false)
  const [isPetsDialogOpen, setIsPetsDialogOpen] = React.useState(false)

  // Draft state inside the dialog — committed on "Confirm"
  const [draftPetIds, setDraftPetIds] = React.useState<number[]>([])
  const [draftNumberOfPets, setDraftNumberOfPets] = React.useState(0)
  const [petMode, setPetMode] = React.useState<PetMode>(
    petProfiles.length > 0 ? 'profiles' : 'count'
  )

  React.useEffect(() => {
    if (isDateDialogOpen) setSelectedDateRange(date)
  }, [isDateDialogOpen, date])

  React.useEffect(() => {
    if (isPetsDialogOpen) {
      setDraftPetIds(selectedPetIds)
      setDraftNumberOfPets(numberOfPets)
      if (selectedPetIds.length > 0) {
        setPetMode('profiles')
      } else if (numberOfPets > 0) {
        setPetMode('count')
      } else {
        setPetMode(petProfiles.length > 0 ? 'profiles' : 'count')
      }
    }
  }, [isPetsDialogOpen, selectedPetIds, numberOfPets, petProfiles.length])

  const handleConfirmDate = () => {
    if (selectedDateRange?.from && selectedDateRange?.to) {
      setDate(selectedDateRange)
      setIsDateDialogOpen(false)
    }
  }

  const handleConfirmPets = () => {
    if (petMode === 'profiles') {
      setSelectedPetIds(draftPetIds)
      setNumberOfPets(0)
    } else {
      setSelectedPetIds([])
      setNumberOfPets(draftNumberOfPets)
    }
    setIsPetsDialogOpen(false)
  }

  const toggleDraft = (id: number) => {
    setDraftPetIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const handleDraftNumberChange = (delta: number) => {
    setDraftNumberOfPets((prev) => Math.min(10, Math.max(0, prev + delta)))
  }

  const isConfirmDateDisabled = React.useMemo(() => {
    if (!selectedDateRange?.from || !selectedDateRange?.to) return true
    return differenceInDays(selectedDateRange.to, selectedDateRange.from) < 1
  }, [selectedDateRange])

  // Auto-search when dates + pets are all set
  React.useEffect(() => {
    const petCount = selectedPetIds.length > 0 ? selectedPetIds.length : numberOfPets
    if (date?.from && date?.to && petCount > 0) {
      onSearch({
        checkInDate: format(date.from, 'yyyy-MM-dd'),
        checkOutDate: format(date.to, 'yyyy-MM-dd'),
        petCount,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date?.from?.getTime(), date?.to?.getTime(), selectedPetIds.length, numberOfPets])

  const petButtonLabel = React.useMemo(() => {
    if (selectedPetIds.length > 0) {
      const names = petProfiles
        .filter((p) => selectedPetIds.includes(p.id))
        .map((p) => p.name)
      if (names.length <= 2) return names.join(', ')
      return `${names[0]}, +${names.length - 1} more`
    }
    if (numberOfPets > 0) return `${numberOfPets} pet${numberOfPets > 1 ? 's' : ''}`
    return 'Select pets'
  }, [selectedPetIds, numberOfPets, petProfiles])

  const confirmedCount =
    petMode === 'profiles' ? draftPetIds.length : draftNumberOfPets
  const isConfirmPetsDisabled = confirmedCount === 0

  return (
    <div className="flex items-center gap-2 p-2 rounded-full border bg-off-white shadow-sm mb-4">
      {/* Date Range Picker */}
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
                    {format(date.from, 'LLL dd')} -{' '}
                    {format(date.to, 'LLL dd')}
                  </span>
                ) : (
                  <span>{format(date.from, 'LLL dd, y')}</span>
                )
              ) : (
                <span className="text-neutral-gray">Add dates</span>
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
              disabled={isConfirmDateDisabled}
              className="bg-positive-green w-full"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pet Selector */}
      <Dialog open={isPetsDialogOpen} onOpenChange={setIsPetsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              'flex-1 justify-start text-left font-normal rounded-full h-14 px-6 text-base hover:bg-neutral-200',
              selectedPetIds.length === 0 && numberOfPets === 0 && 'text-neutral-gray'
            )}
          >
            <div className="flex flex-col items-start">
              <span className="font-semibold text-sm text-deep-teal">Pets</span>
              <span
                className={cn(
                  selectedPetIds.length === 0 && numberOfPets === 0 && 'text-neutral-gray'
                )}
              >
                {petButtonLabel}
              </span>
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-left">
            <DialogTitle className="text-accent-orange">
              Which pets are coming?
            </DialogTitle>
            <DialogDescription>
              Select the pet profiles joining this stay.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 space-y-3">
            {petProfilesLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-accent-orange border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* My Pets — primary accordion (only when profiles exist) */}
                {petProfiles.length > 0 && (
                  <div
                    className={cn(
                      'rounded-2xl border-2 overflow-hidden transition-all duration-200',
                      petMode === 'profiles'
                        ? 'border-deep-teal shadow-sm'
                        : 'border-gray-200'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setPetMode('profiles')}
                      className="w-full flex items-center justify-between px-5 py-4 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-xl transition-colors',
                            petMode === 'profiles' ? 'bg-deep-teal/10' : 'bg-gray-100'
                          )}
                        >
                          <PawPrint
                            className={cn(
                              'w-5 h-5 transition-colors',
                              petMode === 'profiles' ? 'text-deep-teal' : 'text-gray-400'
                            )}
                          />
                        </div>
                        <div className="text-left">
                          <p
                            className={cn(
                              'font-semibold text-sm',
                              petMode === 'profiles' ? 'text-deep-teal' : 'text-gray-700'
                            )}
                          >
                            My Pets
                          </p>
                          <p className="text-xs text-neutral-gray mt-0.5">
                            Select from your pet profiles
                          </p>
                        </div>
                      </div>

                      <div
                        className={cn(
                          'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                          petMode === 'profiles'
                            ? 'border-deep-teal bg-deep-teal'
                            : 'border-gray-300'
                        )}
                      >
                        {petMode === 'profiles' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {petMode === 'profiles' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: 'easeInOut' }}
                        >
                          <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-4 space-y-2">
                            {petProfiles.map((pet) => {
                              const isSelected = draftPetIds.includes(pet.id)
                              return (
                                <motion.button
                                  key={pet.id}
                                  type="button"
                                  onClick={() => toggleDraft(pet.id)}
                                  whileTap={{ scale: 0.98 }}
                                  className={cn(
                                    'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-150 text-left bg-white',
                                    isSelected
                                      ? 'border-accent-orange bg-accent-orange/5'
                                      : 'border-gray-200 hover:border-gray-300'
                                  )}
                                >
                                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                                    {pet.image ? (
                                      <Image
                                        src={pet.image}
                                        alt={pet.name}
                                        width={40}
                                        height={40}
                                        className="object-cover w-full h-full"
                                      />
                                    ) : (
                                      <PawPrint className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={cn(
                                        'font-semibold text-sm',
                                        isSelected ? 'text-accent-orange' : 'text-gray-800'
                                      )}
                                    >
                                      {pet.name}
                                    </p>
                                    {pet.petTypeName && (
                                      <p className="text-xs text-neutral-gray truncate">
                                        {pet.petTypeName}
                                        {pet.age ? ` · ${pet.age}y` : ''}
                                      </p>
                                    )}
                                  </div>

                                  <CheckCircle2
                                    className={cn(
                                      'w-5 h-5 shrink-0 transition-colors',
                                      isSelected ? 'text-accent-orange' : 'text-gray-200'
                                    )}
                                  />
                                </motion.button>
                              )
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Enter Number — secondary accordion */}
                <div
                  className={cn(
                    'rounded-xl border-2 overflow-hidden transition-all duration-200',
                    petMode === 'count'
                      ? 'border-accent-orange/50'
                      : 'border-gray-200'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setPetMode('count')}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3',
                      petMode === 'count'
                        ? 'bg-accent-orange/5'
                        : 'bg-white hover:bg-gray-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Hash
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          petMode === 'count' ? 'text-accent-orange' : 'text-gray-400'
                        )}
                      />
                      <div className="text-left">
                        <p
                          className={cn(
                            'text-sm font-medium transition-colors',
                            petMode === 'count' ? 'text-accent-orange' : 'text-gray-500'
                          )}
                        >
                          Enter number of pets
                        </p>
                        <p className="text-xs text-neutral-gray">
                          {petProfiles.length > 0
                            ? 'Without using pet profiles'
                            : 'How many pets are joining?'}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
                        petMode === 'count'
                          ? 'border-accent-orange bg-accent-orange'
                          : 'border-gray-300'
                      )}
                    >
                      {petMode === 'count' && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {petMode === 'count' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: 'easeInOut' }}
                      >
                        <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-deep-teal">
                              Number of pets
                            </span>
                            <div className="flex items-center gap-4">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleDraftNumberChange(-1)}
                                disabled={draftNumberOfPets === 0}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {draftNumberOfPets}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleDraftNumberChange(1)}
                                disabled={draftNumberOfPets === 10}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Hint to add profiles when none exist */}
                {petProfiles.length === 0 && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-accent-orange/5 border border-accent-orange/20">
                    <PawPrint className="w-4 h-4 text-accent-orange shrink-0" />
                    <p className="text-xs text-gray-600">
                      Add pet profiles for a better experience.{' '}
                      <Link
                        href="/profile/pets"
                        className="font-medium text-accent-orange hover:underline"
                      >
                        Add a profile →
                      </Link>
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleConfirmPets}
              disabled={isConfirmPetsDisabled}
              className="bg-accent-orange w-full"
            >
              {isConfirmPetsDisabled
                ? petMode === 'profiles'
                  ? 'Select at least one pet'
                  : 'Enter number of pets'
                : `Confirm ${confirmedCount} pet${confirmedCount > 1 ? 's' : ''}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
