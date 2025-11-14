'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { forgotPassword } from '@/lib/fetchAuthen'
import Link from 'next/link'
import { getApiErrorMessages } from '@/lib/errorHandling'
import clsx from 'clsx'

interface ForgotPasswordFormProps {
  onSubmitSuccess: (email: string) => void
}

export default function ForgotPasswordForm({
  onSubmitSuccess,
}: ForgotPasswordFormProps) {
  // State
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  // Handlers
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await forgotPassword({ email })
      onSubmitSuccess(email)
    } catch (err) {
      console.error('Forgot password failed:', err)
      const errorResponse = getApiErrorMessages(err)
      if (errorResponse && errorResponse.length > 0) {
        setError(errorResponse[0].message)
      } else {
        setError(
          'Failed to send password reset email. Please check the email address and try again.'
        )
      }
    }
  }

  return (
    <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px] ">
      <form
        onSubmit={handleForgotPassword}
        className="space-y-[30px] mt-[70px]"
      >
        <div>
          <Input
            type="email"
            placeholder="Email"
            className={clsx('w-full py-6', {
              'border-red-500': error,
            })}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            required
          />
          {error && (
            <p className="text-red-500 text-left text-sm mt-1">{error}</p>
          )}
        </div>
        <Button
          type="submit"
          disabled={!email}
          className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold"
        >
          Confirm
        </Button>
      </form>
      <div className="mt-[30px]">
        <Link href="/authen/login" passHref>
          <div className="py-4 text-deep-teal h-auto text-[20px] font-semibold">
            Back to Login
          </div>
        </Link>
      </div>
    </div>
  )
}
