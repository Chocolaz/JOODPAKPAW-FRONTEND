'use client'

import { useAuth } from '@/app/_components/AuthContext'
import { Progress } from '@/components/ui/progress' // Import the Progress component

interface HostBannerProps {
  currentStep?: number
  totalSteps?: number
}

export function HostBanner({ currentStep, totalSteps }: HostBannerProps) {
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
    <div className="sticky top-14 z-9 bg-off-white p-10 rounded-bl-xl rounded-br-xl shadow-sm w-full">
      {currentStep && totalSteps ? (
        <div className="min-h-[80px]">
          {/* Row หลัก: Step อยู่ขวาสุด, Title อยู่กลาง */}
          <div className="relative flex items-center justify-center">
            {/* Title & Subtitle ตรงกลางจริง ๆ */}
            <div className="text-center mb-2">
              <p className="text-lg text-deep-teal">{getStepTitle(currentStep)}</p>
              <p className="text-base text-deep-teal">
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
        <div className="min-h-[60px] text-center">
          <p className="text-lg text-accent-orange">
            Hello {user?.firstName} {user?.lastName}
          </p>
          <h4 className="text-deep-teal">Manage your host activities below!</h4>
        </div>
      )}
    </div>
  )
}
