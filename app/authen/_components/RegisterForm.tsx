'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signUp } from '@/lib/fetchAuthen'
import { getApiErrorMessage } from '@/lib/errorHandling'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

export default function RegisterForm() {
  // Hooks
  const router = useRouter()

  // State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordMismatchError, setPasswordMismatchError] = useState('')

  // Memoized values
  const isButtonDisabled = useMemo(() => {
    return (
      !firstname ||
      !lastname ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword ||
      !!passwordMismatchError // Disable if there's a mismatch error
    )
  }, [
    firstname,
    lastname,
    phone,
    email,
    password,
    confirmPassword,
    passwordMismatchError,
  ])

  // Handlers
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isButtonDisabled) return

    if (password !== confirmPassword) {
      setPasswordMismatchError("Passwords don't match")
      return
    }
    try {
      await signUp({
        email,
        password,
        confirmPassword,
        firstname,
        lastname,
        phone,
      })
      console.log('Sign up successful')
      router.push(`/authen/verify-otp?email=${email}`)
    } catch (error: unknown) {
      console.error('Sign up failed:', error)
      const message = getApiErrorMessage(error)
      if (message) {
        setEmailError(message)
      } else {
        // Handle other errors, e.g., show a generic error message
        alert('An unexpected error occurred. Please try again.')
      }
    }
  }

  return (
    <div className="px-5 w-full max-w-sm text-center mx-auto">
      <form onSubmit={handleSignUp} className="space-y-[30px] mt-10">
        <div>
          <Input
            type="text"
            placeholder="First Name"
            className="w-full py-6"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Last Name"
            className="w-full py-6"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="tel"
            placeholder="Phone Number"
            className="w-full py-6"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            className={clsx('w-full py-6', {
              'border-red-500': emailError,
            })}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError('')
            }}
          />
          {emailError && (
            <p className="text-red-500 text-left text-sm mt-1">{emailError}</p>
          )}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            className={clsx('w-full py-6', {
              'border-red-500': passwordMismatchError,
            })}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordMismatchError('')
            }}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            className={clsx('w-full py-6', {
              'border-red-500': passwordMismatchError,
            })}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              setPasswordMismatchError('')
            }}
          />
          {passwordMismatchError && (
            <p className="text-red-500 text-left text-sm mt-1">
              {passwordMismatchError}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold"
        >
          Sign up
        </Button>
      </form>
      <div className="mt-[30px]">
        <Link href="/authen/login" passHref>
          <div className=" py-4 h-auto text-[20px] font-semibold text-deep-teal">
            Already have an account
          </div>
        </Link>
      </div>
    </div>
  )
}
