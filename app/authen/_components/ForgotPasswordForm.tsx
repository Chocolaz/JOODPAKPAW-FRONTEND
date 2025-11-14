'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { forgotPassword } from '@/lib/fetchAuthen'
import Link from 'next/link'

interface ForgotPasswordFormProps {
  onSubmitSuccess: (email: string) => void
}

export default function ForgotPasswordForm({
  onSubmitSuccess,
}: ForgotPasswordFormProps) {
  // State
  const [email, setEmail] = useState('')

  // Handlers
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await forgotPassword({ email })
      onSubmitSuccess(email)
    } catch (error) {
      console.error('Forgot password failed:', error)
      alert(
        'Failed to send password reset email. Please check the email address and try again.'
      )
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
            className="w-full py-6"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
