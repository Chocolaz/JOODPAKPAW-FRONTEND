'use client'

import { useAuth } from '@/app/_components/AuthContext'
import { Progress } from '@/components/ui/progress' // Import the Progress component

interface HostBannerProps {
  currentStep?: number
  totalSteps?: number
  summary?: {
    total: number
    published: number
    draft: number
  }
}

export function HostBanner({
  currentStep,
  totalSteps,
  summary,
}: HostBannerProps) {
  const { user } = useAuth()

  const getStepTitle = (step: number) => {
    if (step >= 1 && step <= 4) {
      return 'Tell us about your space'
    } else if (step >= 5 && step <= 7) {
      return 'Make it stand Out'
    } else if (step >= 8 && step <= 9) {
      return 'Publish your listing'
    }
    return ''
  }

  const getStepSubtitle = (step: number) => {
    switch (step) {
      case 1:
        return 'Property Type'
      case 2:
      case 3:
        return 'Address'
      case 4:
        return 'Title and description'
      case 5:
        return 'Facilities'
      case 6:
        return 'Picture'
      case 7:
        return 'Review'
      case 8:
        return 'Room'
      case 9:
        return 'Publish'
      default:
        return ''
    }
  }

  return (
    <div className="sticky top-14 z-9 bg-off-white p-6 sm:p-10 rounded-bl-4xl rounded-br-4xl shadow-sm border-b w-full">
      {currentStep && totalSteps ? (
        <div className="min-h-20">
          {/* Row หลัก: Step อยู่ขวาสุด, Title อยู่กลาง */}
          <div className="relative flex items-center justify-center">
            {/* Title & Subtitle ตรงกลางจริง ๆ */}
            <div className="text-center mb-2">
              <h5 className="text-deep-teal">{getStepTitle(currentStep)}</h5>
              <p className="text-base text-neutral-gray">
                {getStepSubtitle(currentStep)}
              </p>
            </div>

            {/* Step ที่ขวาสุด แบบแนวตั้ง */}
            <div className="absolute right-0 flex flex-col items-center text-center mb-3">
              <span className="text-sm">Step</span>
              <div className="text-sm font-medium">
                {currentStep}
                <span className="text-neutral-gray">/{totalSteps}</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <Progress value={(currentStep / totalSteps) * 100} className="mt-3" />
        </div>
      ) : (
        <div className="min-h-[60px]">
          <p className="text-lg text-accent-orange">
            Hello {user?.firstName} {user?.lastName}
          </p>
          <h4 className="text-deep-teal mb-3">
            Manage your host activities below!
          </h4>

          {summary && summary.total > 0 && (
            <div className="flex flex-wrap gap-2">
              {/* Total */}
              <div className="px-3 py-1 rounded-full bg-deep-teal/10 text-deep-teal text-sm font-medium">
                {summary.total} total
              </div>

              {/* Published (show only if > 0) */}
              {summary.published > 0 && (
                <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  {summary.published} published
                </div>
              )}

              {/* Draft (show only if > 0) */}
              {summary.draft > 0 && (
                <div className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                  {summary.draft} draft
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
