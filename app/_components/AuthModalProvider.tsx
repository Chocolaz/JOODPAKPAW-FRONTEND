'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AuthRequiredError,
  authErrorEmitter,
  type AuthErrorReason,
} from '@/lib/authErrors'
import { Button } from '@/components/ui/button'
import { AuthModalContext } from '@/app/_context/AuthModalContext'
import type { AuthModalStep, AuthModalOptions } from '@/app/_context/AuthModalContext'
import { AuthModal } from '@/app/_components/AuthModal'

const errorContent: Record<AuthErrorReason, { title: string; description: string }> = {
  no_token: {
    title: 'Login Required',
    description: 'Please log in to access this feature.',
  },
  expired_token: {
    title: 'Session Expired',
    description: 'Your session has expired. Please log in again.',
  },
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  // ── Error modal (session expired / no token) ──────────────────────────────
  const [error, setError] = useState<AuthRequiredError | null>(null)
  const [navigating, setNavigating] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    return authErrorEmitter.subscribe((err) => {
      setError(err)
    })
  }, [])

  const handleLogin = useCallback(() => {
    setNavigating(true)
  }, [])

  const handleCloseError = useCallback(() => {
    setError(null)
  }, [])

  const handleExitComplete = useCallback(() => {
    if (navigating) {
      setNavigating(false)
      setError(null)
      const qs = searchParams.toString()
      const fullPath = qs ? `${pathname}?${qs}` : pathname
      router.push(`/authen?returnUrl=${encodeURIComponent(fullPath)}`)
    }
  }, [navigating, router, pathname, searchParams])

  const info = error ? errorContent[error.reason] : null
  const isErrorOpen = !!error && !navigating

  // ── Auth form modal ───────────────────────────────────────────────────────
  const [authStep, setAuthStep] = useState<AuthModalStep | null>(null)
  const [authOptions, setAuthOptions] = useState<AuthModalOptions>({})

  const openAuthModal = useCallback((step: AuthModalStep = 'login', opts: AuthModalOptions = {}) => {
    setAuthStep(step)
    setAuthOptions(opts)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthStep(null)
    setAuthOptions({})
  }, [])

  const handleStepChange = useCallback((step: AuthModalStep, opts?: Partial<AuthModalOptions>) => {
    setAuthStep(step)
    if (opts) setAuthOptions((prev) => ({ ...prev, ...opts }))
  }, [])

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}

      {/* Auth form modal */}
      <AuthModal
        isOpen={authStep !== null}
        step={authStep ?? 'login'}
        options={authOptions}
        onClose={closeAuthModal}
        onStepChange={handleStepChange}
      />

      {/* Error / session-expired modal */}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {isErrorOpen && (
          <div className="fixed inset-0 z-[60]">
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseError}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                className="bg-white rounded-lg shadow-lg w-[80%] max-w-sm p-6 pointer-events-auto"
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <div className="flex flex-col space-y-1.5 text-center">
                  <h2 className="text-lg font-semibold leading-none tracking-tight">
                    {info?.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{info?.description}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={handleCloseError}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLogin}
                    className="bg-accent-orange text-white hover:bg-accent-orange/80"
                  >
                    Log In
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </AuthModalContext.Provider>
  )
}
