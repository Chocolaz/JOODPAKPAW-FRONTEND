'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { countryNames } from '../../_constants'
import { StepNavigation } from '../StepNavigation'

export function Step3({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const { formData, updateField } = useAddProperty()
  const [open, setOpen] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateField(e.target.name as keyof typeof formData, e.target.value)
  }

  const isFormValid = () => {
    return (
      formData.country.trim() !== '' &&
      formData.province.trim() !== '' &&
      formData.district.trim() !== '' &&
      formData.subdistrict.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.zipcode.trim() !== ''
    )
  }

  return (
    <>
      <div className="w-full max-w-[500px] mx-auto text-center mt-5">
        <h3 className="text-deep-teal">Confirm your address</h3>
        <p className="mb-6 text-neutral-gray text-sm">
          We’ve auto-filled your address based on the location you picked.
          <br /> You can make adjustments if needed.
        </p>
        <div className="space-y-4">
          <div className="text-left">
            <p className="text-sm font-medium text-deep-teal mb-1">Country</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full rounded-lg justify-between p-6 text-lg font-normal"
                >
                  {formData.country
                    ? countryNames.find(
                        (country) => country === formData.country
                      )
                    : 'Select your country'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[460px] p-0">
                <Command>
                  <CommandInput
                    placeholder="Search country..."
                    className="text-lg"
                  />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countryNames.map((country) => (
                        <CommandItem
                          key={country}
                          value={country}
                          onSelect={(currentValue) => {
                            updateField(
                              'country',
                              currentValue === formData.country
                                ? ''
                                : currentValue
                            )
                            setOpen(false)
                          }}
                          className="text-lg"
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              formData.country === country
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {country}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-deep-teal mb-1">Province</p>
            <Input
              type="text"
              name="province"
              placeholder="Province"
              value={formData.province}
              onChange={handleChange}
              className="p-6 text-lg"
              maxLength={60}
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-deep-teal mb-1">District</p>
            <Input
              type="text"
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleChange}
              className="p-6 text-lg"
              maxLength={60}
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-deep-teal mb-1">
              Subdistrict
            </p>
            <Input
              type="text"
              name="subdistrict"
              placeholder="Subdistrict"
              value={formData.subdistrict}
              onChange={handleChange}
              className="p-6 text-lg"
              maxLength={60}
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-deep-teal mb-1">Address</p>
            <Input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="p-6 text-lg"
              maxLength={60}
            />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-deep-teal mb-1">Zipcode</p>
            <Input
              type="text"
              name="zipcode"
              placeholder="Zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="p-6 text-lg"
              maxLength={60}
            />
          </div>
        </div>
      </div>
      <StepNavigation
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={!isFormValid()}
      />
    </>
  )
}
