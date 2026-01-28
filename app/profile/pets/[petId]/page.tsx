'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getPetProfileById } from '@/lib/api'
import { PetProfile } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import PetDetailDisplay from './_components/PetDetailDisplay'

export default function PetDetailPage() {
  const { petId } = useParams()
  const [petProfile, setPetProfile] = useState<PetProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (petId) {
      const fetchPetProfile = async () => {
        try {
          setIsLoading(true)
          const data = await getPetProfileById(petId as string)
          setPetProfile(data)
        } catch (err) {
          console.error('Failed to fetch pet profile:', err)
          setError('Failed to load pet profile.')
          toast.error('Failed to load pet profile.')
        } finally {
          setIsLoading(false)
        }
      }
      fetchPetProfile()
    }
  }, [petId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>{error}</p>
      </div>
    )
  }

  if (!petProfile) {
    return (
      <div className="text-center text-gray-500 mt-10">
        <p>No pet profile found.</p>
      </div>
    )
  }

  return <PetDetailDisplay pet={petProfile} />
}
