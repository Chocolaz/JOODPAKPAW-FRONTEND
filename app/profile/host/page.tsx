'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { assetPath } from '@/lib/utils'
import { PropertyList } from '@/app/_components/PropertyList'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { useProfileContext } from '../ProfileContext'
import { useEffect, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { HostBookingList } from './_components/HostBookingList'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/app/_components/AuthContext'
import { HostBookingHistoryList } from './_components/HostBookingHistoryList'
import { Plus } from 'lucide-react'

export default function HostPage() {
  const { user } = useAuth()
  const isHost = user?.role?.some((role) => role.name === 'host')

  const {
    hostProperties: { properties, loading, error, refetch },
  } = useProfileContext()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')

  const defaultTab = useMemo(() => {
    if (isHost) {
      if (tabParam === 'bookings' || tabParam === 'history') {
        return tabParam
      }
      return 'properties'
    }
    return 'properties'
  }, [isHost, tabParam])

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <Tabs defaultValue={defaultTab} className="w-full flex flex-col">
      {isHost && (
        <TabsList className="grid w-full grid-cols-3 mx-auto sticky top-14 z-10 rounded-none h-11 bg-gray-50/80 backdrop-blur-sm md:max-w-md md:rounded-lg md:mt-2">
          <TabsTrigger value="properties" className="text-sm">
            Properties
          </TabsTrigger>
          <TabsTrigger value="bookings" className="text-sm">
            Bookings
          </TabsTrigger>
          <TabsTrigger value="history" className="text-sm">
            History
          </TabsTrigger>
        </TabsList>
      )}

      <TabsContent value="properties" className="mt-0 flex-1">
        <div className="flex flex-col px-4 md:px-6">
          <div className="pb-24 md:pb-8 pt-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner />
              </div>
            ) : error ? (
              <ErrorState message={error} />
            ) : properties.length > 0 ? (
              <PropertyList
                properties={properties}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5"
                buildHref={(property) => `/profile/host/${property.id}`}
                showRoomCount={true}
                showStatusIcon={true}
              />
            ) : (
              <div className="flex flex-col items-center text-center mt-16 px-6 text-neutral-gray">
                <Image
                  src={assetPath('/graphics/no-host.svg')}
                  alt="No host listing"
                  width={240}
                  height={240}
                  className="w-full h-auto max-w-[240px] mx-auto"
                />
                <h2 className="mt-5 text-lg font-semibold text-deep-teal">
                  No host listing yet
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed max-w-[260px]">
                  Open your home and heart to new furry friends
                </p>
              </div>
            )}
          </div>

          {/* Add Property Button — fixed on mobile, inline on desktop */}
          <div className="fixed bottom-0 left-0 right-0 px-4 pb-5 pt-3 z-10 max-w-[500px] mx-auto bg-gradient-to-t from-white via-white to-white/0 md:hidden">
            <Link href="/profile/host/add-property">
              <Button className="interact-button w-full h-12 text-base gap-2">
                <Plus className="w-5 h-5" />
                Add Property
              </Button>
            </Link>
          </div>
          <div className="hidden md:flex md:justify-end md:pb-6">
            <Link href="/profile/host/add-property">
              <Button className="interact-button h-11 px-6 text-sm gap-2">
                <Plus className="w-4 h-4" />
                Add Property
              </Button>
            </Link>
          </div>
        </div>
      </TabsContent>

      {isHost && (
        <TabsContent value="bookings" className="mt-0 flex-1">
          <HostBookingList />
        </TabsContent>
      )}

      {isHost && (
        <TabsContent value="history" className="mt-0 flex-1">
          <HostBookingHistoryList />
        </TabsContent>
      )}
    </Tabs>
  )
}
