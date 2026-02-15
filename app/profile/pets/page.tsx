'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { useProfileContext } from '../ProfileContext'
import { useEffect } from 'react'
import { PetCard } from './_components/PetCard'
import { useRouter } from 'next/navigation'

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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        ) : error ? (
          <ErrorState message={error} />
        ) : pets.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onClick={() => router.push(`/profile/pets/${pet.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20 text-neutral-gray">
            <Image
              src="/graphics/search-room.png"
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
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 py-5 px-5 sm:px-10 z-10 max-w-[500px] mx-auto">
        <Link href="/profile/pets/add/1">
          <Button className="interact-button w-full">Add Pet</Button>
        </Link>
      </div>
    </div>
  )
}
