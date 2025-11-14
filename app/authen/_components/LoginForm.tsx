'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import { signIn } from '@/lib/fetchAuthen'
import { saveTokens } from '@/lib/authenUtils'
import { useRouter } from 'next/navigation'
import { getApiErrorMessage, ApiError } from '@/lib/errorHandling'
import clsx from 'clsx'

export default function LoginForm() {
  // Hooks
  const router = useRouter()

  // State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isEmailError, setIsEmailError] = useState(false)

  // Memoized values
  const isButtonDisabled = useMemo(() => {
    return !email || !password || password.length < 8;
  }, [email, password]);

  // Handlers
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isButtonDisabled) return // Prevent sign-in if button is disabled

    try {
      const data = await signIn({ email, password })
      console.log('Sign in successful:', data)
      if (data.accessToken && data.refreshToken) {
        saveTokens(data.accessToken, data.refreshToken)
        router.push('/')
      } else {
        console.error('Sign in successful, but no tokens received.')
        setError('Sign in failed. Please try again.')
        setIsEmailError(false)
      }
    } catch (err: unknown) {
      console.error('Sign in failed:', err)
      const message = getApiErrorMessage(err)
      if (message) {
        setError(message)
        if (err instanceof ApiError && err.code === 'T-2007') {
          setIsEmailError(true)
        } else {
          setIsEmailError(false)
        }
      } else {
        setError('Sign in failed. Please check your credentials and try again.')
        setIsEmailError(false)
      }
    }
  }

  return (
    <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px] ">
      <form onSubmit={handleSignIn} className="space-y-[30px] mt-[70px]">
        <div>
          <Input
            type="email"
            placeholder="Email"
            className={clsx('w-full py-6', {
              'border-red-500': isEmailError,
            })}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
              setIsEmailError(false)
            }}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            className={clsx('w-full py-6', {
              'border-red-500': error && !isEmailError,
            })}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
              setIsEmailError(false)
            }}
          />
          {error && <p className="text-red-500 text-left text-sm mt-1">{error}</p>}
          <div className="text-right mt-2">
            <Link
              href="/authen/forgot-password"
              className="text-sm text-accent-orange font-medium hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold"
        >
          Sign in
        </Button>
      </form>
      <div className="mt-[30px]">
        <Link href="/authen/register" passHref>
          <div className="py-4  text-deep-teal h-auto text-[20px] font-semibold">
            Create new account
          </div>
        </Link>
      </div>
    </div>
  )
}
