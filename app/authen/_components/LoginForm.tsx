'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { signIn } from '@/lib/fetchAuthen'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await signIn({ email, password })
      console.log('Sign in successful:', data)
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        router.push('/')
      } else {
        // Handle case where tokens are not in the response
        console.error('Sign in successful, but no tokens received.')
        alert('Sign in failed. Please try again.')
      }
    } catch (error) {
      console.error('Sign in failed:', error)
      alert('Sign in failed. Please check your credentials and try again.')
    }
  }

  return (
    <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px] ">
      <form onSubmit={handleSignIn} className="space-y-[30px] mt-[70px]">
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
