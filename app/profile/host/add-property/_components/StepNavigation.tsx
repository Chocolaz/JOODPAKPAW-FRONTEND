'use client'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

type StepNavigationProps = {
  onBack?: () => void
  onNext?: () => void
  isNextDisabled?: boolean
  isSubmitting?: boolean
  backText?: string
  nextText?: string
}

export function StepNavigation({
  onBack,
  onNext,
  isNextDisabled = false,
  isSubmitting = false,
  backText = 'Back',
  nextText = 'Continue',
}: StepNavigationProps) {
  return (
    <div className="fixed bottom-2 left-0 right-0 py-5 px-10 z-10 max-w-[500px] mx-auto flex justify-between items-center">
      {onBack ? (
        <Button
          variant="outline"
          onClick={onBack}
          className="text-[16px] p-6 w-[100px]"
          disabled={isSubmitting}
        >
          {backText}
        </Button>
      ) : (
        <div />
      )}

      {onNext && (
        <Button
          onClick={onNext}
          className="text-[16px] w-auto min-w-[100px] p-6 bg-positive-green"
          disabled={isNextDisabled || isSubmitting}
        >
          {isSubmitting ? <Spinner className="h-5 w-5" /> : nextText}
        </Button>
      )}
    </div>
  )
}
