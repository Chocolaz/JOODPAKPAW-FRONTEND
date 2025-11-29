'use client'

import { getPropertyById } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { usePropertyLoader } from '@/app/_hooks/usePropertyLoader'
import { PropertyImageGallery } from '@/app/_components/property-detail/PropertyImageGallery'
import { PropertyHeader } from '@/app/_components/property-detail/PropertyHeader'
import { PropertyFacilities } from '@/app/_components/property-detail/PropertyFacilities'
import { PropertyLocation } from '@/app/_components/property-detail/PropertyLocation'
import { useRouter } from 'next/navigation'
import { PageHeaderButtons } from '@/app/_components/property-detail/PageHeaderButtons'
import { PropertyRoomCategories } from '@/app/_components/property-detail/PropertyRoomCategories'
import { normalizeRoomCategories } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
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

export default function PropertyDetailPage() {
  const { property, loading, error, refreshProperty } =
    usePropertyLoader(getPropertyById)
  const router = useRouter()
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href, // Current page URL
        })
        console.log('Shared successfully')
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      console.log(
        'Web Share API not supported or property data not available. URL:',
        window.location.href
      )
      // Could implement a copy-to-clipboard or custom share modal here
    }
  }

  const handleBack = () => router.push('/')

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  if (error) return <ErrorState error={error} />
  if (!property) return <ErrorState error="Property not found." />

  const roomCategoriesArray = normalizeRoomCategories(property.roomCategories)

  return (
    <div className="max-w-4xl mx-auto pb-24 relative">
      <PageHeaderButtons onBackClick={handleBack} onShareClick={handleShare} />
      <PropertyImageGallery images={property.images} />

      <div className="px-4 sm:px-0">
        <PropertyHeader property={property} />
        <PropertyFacilities
          facilities={property.facilities}
          description={property.description}
        />
        <PropertyRoomCategories
          propertyId={property.id}
          roomCategories={roomCategoriesArray}
          onDeleteSuccess={refreshProperty}
          showDeleteButton={false}
        />
        <PropertyLocation property={property} />
      </div>

      {/* Sticky Footer */}
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
              <div className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
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
    </div>
  )
}
