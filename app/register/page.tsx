'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { signUp } from '@/lib/fetchAuthen'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    try {
      const data = await signUp({ email, password, confirmPassword })
      console.log('Sign up successful:', data)
      // Handle successful sign up, e.g., redirect to OTP page
    } catch (error) {
      console.error('Sign up failed:', error)
      // Handle errors, e.g., show an error message to the user
    }
  }

  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col items-center">
      <div className="relative w-full flex justify-center pt-10">
        <div className="absolute top-0 z-0">
          <Image
            src="/graphics/Ellipse.svg"
            alt="Background Ellipse"
            width={452}
            height={308}
          />
        </div>
        <div className="z-10 mt-20 text-center">
          <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
            Join the JODPAKPAW
          </h1>
          <div className="text-[20px]">
            Create your account and start finding safe, <br />
            loving stays for your pet.
          </div>
        </div>
      </div>

      <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px] ">
        <form onSubmit={handleSignUp} className="space-y-[30px] mt-[70px]">
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
    </div>
  )
}
