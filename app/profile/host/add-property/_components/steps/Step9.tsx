'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'
import { useAddProperty } from '../../_context/AddPropertyContext'
import { useAuth } from '@/app/_components/AuthContext'
import { updateHostPropertyIsActive } from '@/lib/api'
import { cn, assetPath } from '@/lib/utils'
import { StepNavigation } from '../StepNavigation'

export function Step9() {
  const router = useRouter()
  const { refreshAuth } = useAuth()
  const { formData, clearAddPropertySession } = useAddProperty()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedOption, setSelectedOption] = useState<
    'publish' | 'later' | null
  >(null)

  const publishProperty = async () => {
    if (!formData.propertyId) {
      toast.error('Property ID not found.')
      return
    }

    setIsSubmitting(true)
    try {
      await updateHostPropertyIsActive(String(formData.propertyId), true)
      toast.success('Your property has been published successfully!')
      clearAddPropertySession()
      await refreshAuth()
      router.push('/profile/host')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to publish property.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const savePropertyLater = async () => {
    toast.info('Your property is saved as a draft.')
    clearAddPropertySession()
    await refreshAuth()
    router.push('/profile/host')
  }

  const handleNext = async () => {
    if (selectedOption === 'publish') await publishProperty()
    else if (selectedOption === 'later') await savePropertyLater()
  }

  return (
    <>
      <div className="w-full text-center mt-5">
        <h3 className="text-deep-teal">Ready to publish your place?</h3>
        <p className="mb-15 text-neutral-gray text-sm">
          Once published, pet owners can view and book your place.
          <br />
          You can still edit details anytime later.
        </p>

        <div className="flex flex-wrap justify-center gap-8 pb-4">
          {/* Publish Now */}
          <button
            onClick={() => setSelectedOption('publish')}
            disabled={isSubmitting}
            className={cn(
              'flex flex-col items-center justify-center p-4 border rounded-[20px] shadow-sm cursor-pointer transition-colors w-[150px] h-[150px]',
              selectedOption === 'publish'
                ? 'border-positive-green bg-teal-50'
                : 'border-[ECEFF2] bg-white hover:border-deep-teal/50',
              isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          >
            {/* FIX: Equal image height wrapper */}
            <div className="h-20 flex items-center justify-center">
              <Image
                src={assetPath("/graphics/public-it.svg")}
                alt="Publish it"
                width={80}
                height={80}
              />
            </div>

            <span className="mt-3 text-center font-medium text-neutral-dark">
              Yes, publish it
            </span>
          </button>

          {/* Publish Later */}
          <button
            onClick={() => setSelectedOption('later')}
            disabled={isSubmitting}
            className={cn(
              'flex flex-col items-center justify-center p-4 border rounded-[20px] shadow-sm cursor-pointer transition-colors w-[150px] h-[150px]',
              selectedOption === 'later'
                ? 'border-positive-green bg-teal-50'
                : 'border-[ECEFF2] bg-white hover:border-deep-teal/50',
              isSubmitting && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="h-20 flex items-center justify-center">
              <Image
                src={assetPath("/graphics/public-later.svg")}
                alt="Later"
                width={80}
                height={80}
              />
            </div>

            <span className="mt-3 text-center font-medium text-neutral-dark">
              Later
            </span>
          </button>
        </div>
      </div>

      <StepNavigation
        onBack={() => router.push('/profile/host/add-property/8')}
        onNext={handleNext}
        isNextDisabled={!selectedOption || isSubmitting}
        isSubmitting={isSubmitting}
        nextText="Confirm"
        backText="Back"
      />
    </>
  )
}
