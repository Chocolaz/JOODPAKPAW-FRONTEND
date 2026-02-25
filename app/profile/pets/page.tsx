'use client'

import Image from 'next/image'
import { assetPath } from '@/lib/utils'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { useProfileContext } from '../ProfileContext'
import { useEffect } from 'react'
import { PetCard } from './_components/PetCard'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PetsPage() {
  const {
    petProfiles: { pets, loading, error, refetch },
  } = useProfileContext()
  const router = useRouter()

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div className="flex flex-col px-5">
      <div className="pb-24">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 gap-3 mt-4"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square w-full bg-gray-200 rounded-xl relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
                      <div className="h-4 bg-gray-300/60 rounded w-2/3" />
                      <div className="h-3 bg-gray-300/40 rounded w-1/2" />
                    </div>
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
          ) : pets.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="grid grid-cols-2 gap-3 mt-4"
            >
              {/* Add Pet Card */}
              <button
                onClick={() => router.push('/profile/pets/add/1')}
                className="block w-full cursor-pointer text-left group"
              >
                <div className="aspect-square w-full rounded-xl border-2 border-dashed border-gray-300 group-hover:border-deep-teal flex flex-col items-center justify-center transition-colors bg-gray-50 group-hover:bg-teal-50/50">
                  <div className="w-12 h-12 rounded-full bg-deep-teal/10 group-hover:bg-deep-teal/20 flex items-center justify-center transition-colors mb-2">
                    <Plus className="w-6 h-6 text-deep-teal" />
                  </div>
                  <span className="text-sm font-medium text-deep-teal">
                    Add Pet
                  </span>
                </div>
              </button>

              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onClick={() => router.push(`/profile/pets/${pet.id}`)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-center mt-20 text-neutral-gray"
            >
              <Image
                src={assetPath('/graphics/no-pet.png')}
                alt="No pets found"
                width={200}
                height={200}
                className="w-auto h-auto max-w-sm mx-auto"
              />
              <h2 className="mt-4 text-lg font-semibold text-deep-teal">
                Uh Oh!
              </h2>
              <p className="mt-1">
                Looks like you have no profiles set up at this moment, add your
                pet now
              </p>
              <button
                onClick={() => router.push('/profile/pets/add/1')}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-orange text-white hover:bg-accent-orange/80 text-base font-semibold transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Your First Pet
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
