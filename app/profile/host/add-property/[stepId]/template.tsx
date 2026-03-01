'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function StepTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const stepId = parseInt(pathname.split('/').pop() ?? '0', 10)

  // Determine slide direction by comparing with the previous step stored in
  // sessionStorage. The template remounts on every navigation so we can't use
  // a ref — sessionStorage is the simplest persistent-across-remounts option.
  const prevStep = parseInt(
    (typeof window !== 'undefined' &&
      sessionStorage.getItem('addPropertyPrevStep')) ||
      String(stepId),
    10
  )
  const isForward = isNaN(prevStep) || stepId >= prevStep

  // Persist current step AFTER reading prev (so next render gets the right value)
  useEffect(() => {
    sessionStorage.setItem('addPropertyPrevStep', String(stepId))
  }, [stepId])

  return (
    <motion.div
      initial={{ opacity: 0, x: isForward ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}
