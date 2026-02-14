'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { assetPath } from '@/lib/utils'
import { PropertyList } from '@/app/_components/PropertyList'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { useProfileContext } from '../ProfileContext'
import { useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { HostBookingList } from './_components/HostBookingList'
import { useSearchParams } from 'next/navigation'

export default function HostPage() {
  const {
    hostProperties: { properties, loading, error, refetch },
  } = useProfileContext()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const defaultTab = tabParam === 'bookings' ? 'bookings' : 'properties'

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <Tabs defaultValue={defaultTab} className="w-full mt-2">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="properties">Properties</TabsTrigger>
        <TabsTrigger value="bookings">Bookings</TabsTrigger>
      </TabsList>
      <TabsContent value="properties">
        <div className="flex flex-col px-5">
          {/* Scrollable card section */}
          <div className="pb-24">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner />
              </div>
            ) : error ? (
              <ErrorState message={error} />
            ) : properties.length > 0 ? (
              <PropertyList
                properties={properties}
                className="grid grid-cols-2 gap-3 mt-4"
                buildHref={(property) => `/profile/host/${property.id}`}
                showRoomCount={true}
                showStatusIcon={true}
              />
            ) : (
              <div className="text-center mt-20 text-neutral-gray">
                <Image
                  src={assetPath('/graphics/no-host.svg')}
                  alt="No host listing"
                  width={300}
                  height={300}
                  className="w-full h-auto max-w-sm mx-auto"
                />
                <h2 className="mt-4 text-lg font-semibold">No host listing</h2>
                <p className="mt-1">
                  Open your home and heart to new furry friends
                </p>
              </div>
            )}
          </div>

          {/* Add Property Button fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 py-5 px-5 sm:px-10 z-10 max-w-[500px] mx-auto">
            <Link href="/profile/host/add-property">
              <Button className="interact-button w-full">Add Property</Button>
            </Link>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="bookings">
        <HostBookingList />
      </TabsContent>
    </Tabs>
  )
}
