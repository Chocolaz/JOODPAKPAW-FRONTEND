'use client'

import { useParams, useRouter } from 'next/navigation'
import { Step1 } from '../_components/steps/Step1'
import { Step2 } from '../_components/steps/Step2'
import { Step3 } from '../_components/steps/Step3'
import { Step4 } from '../_components/steps/Step4'
import { Step5 } from '../_components/steps/Step5'
import { Step6 } from '../_components/steps/Step6'
import { Step7 } from '../_components/steps/Step7'
import { Step8 } from '../_components/steps/Step8'
import { Step9 } from '../_components/steps/Step9'

export default function AddPropertyDynamicStepsPage() {
  const params = useParams()
  const router = useRouter()
  const stepId = parseInt(params.stepId as string, 10)

  const handleNext = () => {
    router.push(`/profile/host/add-property/${stepId + 1}`)
  }

  const handleBack = () => {
    router.push(`/profile/host/add-property/${stepId - 1}`)
  }

  const steps = [
    <Step1 key="step-1" onNext={handleNext} />,
    <Step2 key="step-2" onNext={handleNext} onBack={handleBack} />,
    <Step3 key="step-3" onNext={handleNext} onBack={handleBack} />,
    <Step4 key="step-4" onNext={handleNext} onBack={handleBack} />,
    <Step5 key="step-5" onNext={handleNext} onBack={handleBack} />,
    <Step6 key="step-6" onNext={handleNext} onBack={handleBack} />,
    <Step7 key="step-7" onBack={handleBack} />,
    <Step8 key="step-8" />,
    <Step9 key="step-9" />,
  ]

  const renderStep = () => {
    if (stepId > 0 && stepId <= steps.length) {
      return steps[stepId - 1]
    }
    return <div>Invalid Step</div>
  }

  return (
    <div className="flex flex-col max-w-[500px] mx-auto w-full px-8">
      {renderStep()}
    </div>
  )
}
