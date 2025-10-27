'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import { signUp } from '@/lib/fetchAuthen'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [phone, setPhone] = useState('')

  const isButtonDisabled = useMemo(() => {
    return (
      !firstname ||
      !lastname ||
      !phone ||
      !email ||
      !password ||
      !confirmPassword
    )
  }, [firstname, lastname, phone, email, password, confirmPassword])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isButtonDisabled) return

    if (password !== confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    try {
      const data = await signUp({
        email,
        password,
        confirmPassword,
        firstname,
        lastname,
        phone,
      })
      console.log('Sign up successful:', data)
      // Handle successful sign up, e.g., redirect to OTP page
    } catch (error) {
      console.error('Sign up failed:', error)
      // Handle errors, e.g., show an error message to the user
    }
  }

  return (
    <div className="px-5 w-full max-w-sm text-center mx-auto">
      <form onSubmit={handleSignUp} className="space-y-[30px] mt-[40px]">
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
            className="w-full py-6"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            className="w-full py-6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            className="w-full py-6"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
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
          <div className=" py-4 h-auto text-[20px] font-semibold">
            Already have an account
          </div>
        </Link>
      </div>
    </div>
  )
}
