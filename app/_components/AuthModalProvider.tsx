'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AuthRequiredError,
  authErrorEmitter,
  type AuthErrorReason,
} from '@/lib/authErrors'
import { Button } from '@/components/ui/button'

const content: Record<AuthErrorReason, { title: string; description: string }> =
  {
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
  const [error, setError] = useState<AuthRequiredError | null>(null)
  const [navigating, setNavigating] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    return authErrorEmitter.subscribe((err) => {
      setError(err)
    })
  }, [])

  const handleLogin = useCallback(() => {
    setNavigating(true)
  }, [])

  const handleClose = useCallback(() => {
    setError(null)
  }, [])

  // Navigate after the fade-out transition completes
  const handleExitComplete = useCallback(() => {
    if (navigating) {
      setNavigating(false)
      setError(null)
      router.push(`/authen?returnUrl=${encodeURIComponent(pathname)}`)
    }
  }, [navigating, router, pathname])

  const info = error ? content[error.reason] : null
  const isOpen = !!error && !navigating

  return (
    <>
      {children}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {isOpen && (
          <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleClose}
            />

            {/* Modal */}
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
                  <p className="text-sm text-muted-foreground">
                    {info?.description}
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={handleClose}>
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
    </>
  )
}
