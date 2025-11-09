'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { forgotPassword } from '@/lib/fetchAuthen'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ForgotPasswordForm() {
  // Hooks
  const router = useRouter()

  // State
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Handlers
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await forgotPassword({ email })
      setIsSubmitted(true)
    } catch (error) {
      console.error('Forgot password failed:', error)
      alert(
        'Failed to send password reset email. Please check the email address and try again.'
      )
    }
  }

  if (isSubmitted) {
    return (
      <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px]">
        <h2 className="text-2xl font-bold text-accent-orange mb-4">
          Check your email
        </h2>
        <p>
          We have sent a password reset link to <strong>{email}</strong>. Please
          check your inbox (and spam folder).
        </p>
        <div className="mt-6">
          <Link href="/authen/login" passHref>
            <Button className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    )
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
