'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect, Suspense } from 'react'
import { resetPassword } from '@/lib/fetchAuthen'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordFormComponent() {
  // Hooks
  const searchParams = useSearchParams()

  // State
  const [token, setToken] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const payload = searchParams.get('payload')
    if (payload) {
      try {
        const decodedPayload = atob(payload)
        const { email, resetPasswordToken } = JSON.parse(decodedPayload)
        if (email && resetPasswordToken) {
          setEmail(email)
          setToken(resetPasswordToken)
        } else {
          setError('Invalid payload in URL.')
        }
      } catch (e) {
        console.error('Failed to decode payload:', e)
        setError('Invalid or corrupted payload in URL.')
      }
    } else {
      setError('No payload found in URL.')
    }
  }, [searchParams])

  // Handlers
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }
    if (email && token) {
      try {
        await resetPassword({
          email,
          resetPasswordToken: token,
          password,
          confirmPassword,
        })
        setIsSuccess(true)
      } catch (error) {
        console.error('Reset password failed:', error)
        alert('Failed to reset password. The link may have expired.')
      }
    }
  }

  if (error) {
    return (
      <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px]">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p>{error}</p>
        <div className="mt-6">
          <Link href="/authen/login" passHref>
            <Button className="w-full">Back to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px]">
        <h2 className="text-2xl font-bold text-accent-orange mb-4">
          Password Reset Successful
        </h2>
        <p>You can now log in with your new password.</p>
        <div className="mt-6">
          <Link href="/authen/login" passHref>
            <Button className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!token || !email) {
    return (
      <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px]">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px] ">
      <form onSubmit={handleResetPassword} className="space-y-[30px] mt-[70px]">
        <div>
          <Input
            type="password"
            placeholder="New Password"
            className="w-full py-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm New Password"
            className="w-full py-6"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold"
        >
          Reset Password
        </Button>
      </form>
    </div>
  )
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormComponent />
    </Suspense>
  )
}
