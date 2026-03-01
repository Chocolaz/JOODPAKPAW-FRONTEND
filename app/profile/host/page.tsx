'use client'

import Image from 'next/image'
import { assetPath } from '@/lib/utils'
import { PropertyList } from '@/app/_components/PropertyList'
import { motion, AnimatePresence } from 'framer-motion'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { useProfileContext } from '../ProfileContext'
import { useEffect, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { HostBookingList } from './_components/HostBookingList'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/app/_components/AuthContext'
import { HostBookingHistoryList } from './_components/HostBookingHistoryList'
import { Plus } from 'lucide-react'

export default function HostPage() {
  const { user } = useAuth()
  const isHost = user?.role?.some((role) => role.name === 'host')

  const {
    hostProperties: { properties, loading, error, refetch },
  } = useProfileContext()
  const router = useRouter()
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
        <TabsList className="grid w-full grid-cols-3 mx-auto sticky top-14 rounded-none h-11 bg-gray-50/80 backdrop-blur-sm md:max-w-md md:rounded-lg md:mt-2">
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
          <div className="pb-8 pt-3">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5"
                >
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square w-full bg-gray-200 rounded-[20px]" />
                      <div className="mt-2 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ErrorState message={error} />
                </motion.div>
              ) : properties.length > 0 ? (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5"
                >
                  {/* Add Property Card */}
                  <button
                    onClick={() => router.push('/profile/host/add-property')}
                    className="block w-full cursor-pointer text-left group"
                  >
                    <div className="aspect-square w-full rounded-[20px] border-2 border-dashed border-gray-300 group-hover:border-deep-teal flex flex-col items-center justify-center transition-colors bg-gray-50 group-hover:bg-teal-50/50">
                      <div className="w-12 h-12 rounded-full bg-deep-teal/10 group-hover:bg-deep-teal/20 flex items-center justify-center transition-colors mb-2">
                        <Plus className="w-6 h-6 text-deep-teal" />
                      </div>
                      <span className="text-sm font-medium text-deep-teal">
                        Add Property
                      </span>
                    </div>
                  </button>

                  {/* Property Cards — rendered inline to share the grid */}
                  <PropertyList
                    properties={properties}
                    className="contents"
                    buildHref={(property) => `/profile/host/${property.id}`}
                    showRoomCount={true}
                    showStatusIcon={true}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex flex-col items-center text-center mt-16 px-6 text-neutral-gray"
                >
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
                  <button
                    onClick={() => router.push('/profile/host/add-property')}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-orange text-white hover:bg-accent-orange/80 text-base font-semibold transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Property
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
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
