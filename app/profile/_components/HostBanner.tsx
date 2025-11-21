'use client'

import { useAuth } from '@/app/_components/AuthContext'

interface HostBannerProps {
  currentStep?: number
  totalSteps?: number
}

export function HostBanner({ currentStep, totalSteps }: HostBannerProps) {
  const { user } = useAuth()

  return (
    <div className="sticky top-14 z-9 bg-off-white p-10 rounded-bl-xl rounded-br-xl shadow-sm w-full">
      {currentStep && totalSteps ? (
        <div className="min-h-[60px]">
          <p className="text-lg text-accent-orange">
            Step {currentStep}/{totalSteps}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-accent-orange h-2.5 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="min-h-[60px]">
          <p className="text-lg text-accent-orange">
            Hello {user?.firstName} {user?.lastName}
          </p>
          <h4 className="text-deep-teal">Manage your host activities below!</h4>
        </div>
      )}
    </div>
  )
}
