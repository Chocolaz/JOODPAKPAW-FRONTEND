'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAddPet } from '../_context/AddPetContext'
import { Step1 } from '../_components/steps/Step1'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/app/_components/AuthContext'

export default function AddPetDynamicStepsPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, loading: authLoading, logout } = useAuth()
  const stepId = parseInt(params.stepId as string, 10)
  const { highestStepReached, setHighestStepReached, isLoading } = useAddPet()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      logout()
      router.push('/authen')
    }
  }, [authLoading, isAuthenticated, router, logout])

  useEffect(() => {
    if (!isLoading) {
      if (stepId > highestStepReached + 1) {
        router.push('/profile/pets/add/1')
      }
    }
  }, [stepId, highestStepReached, isLoading, router])

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="flex grow items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const handleNext = () => {
    setHighestStepReached(stepId)
    // For now, there is no step 2, so we can just log it.
    // In the future, this would be: router.push(`/profile/pets/add/${stepId + 1}`)
    console.log('Go to next step')
  }

  const handleBack = () => {
    router.push(`/profile/pets/add/${stepId - 1}`)
  }

  const steps = [<Step1 key="step-1" onNext={handleNext} />]

  const renderStep = () => {
    if (stepId > 0 && stepId <= steps.length) {
      return steps[stepId - 1]
    }
    return <div>Invalid Step</div>
  }

  if (isLoading || authLoading || stepId > highestStepReached + 1) {
    return (
      <div className="flex grow items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex flex-col max-w-[500px] mx-auto w-full px-8">
      {renderStep()}
    </div>
  )
}
