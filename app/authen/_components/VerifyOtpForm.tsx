'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useMemo, useEffect } from 'react'
import { verifyOtp, resendOtp } from '@/lib/fetchAuthen'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    const emailFromQuery = searchParams.get('email')
    if (emailFromQuery) {
      setEmail(emailFromQuery)
    } else {
      console.error('Email not found in query parameters')
      router.push('/authen/register')
    }
  }, [searchParams, router])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [cooldown])

  const isButtonDisabled = useMemo(() => {
    return !otp || otp.length !== 6
  }, [otp])

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isButtonDisabled) return

    try {
      const data = await verifyOtp({
        email,
        otp,
      })
      console.log('OTP verification successful:', data)
      router.push('/authen/login')
    } catch (error) {
      console.error('OTP verification failed:', error)
      alert('Invalid or expired OTP. Please try again.')
    }
  }

  const handleResendOtp = async () => {
    if (cooldown > 0) return
    try {
      await resendOtp({ email })
      alert('A new OTP has been sent to your email.')
      setCooldown(60) // Set cooldown for 60 seconds
    } catch (error) {
      console.error('Resend OTP failed:', error)
      alert('Failed to resend OTP. Please try again later.')
    }
  }

  return (
    <div className="px-5 w-full max-w-sm text-center mx-auto">
      <form onSubmit={handleVerifyOtp} className="space-y-[30px] mt-10">
        <div>
          <p className="text-lg mb-4">
            An OTP has been sent to <strong>{email}</strong>. Please enter it below.
          </p>
          <Input
            type="text"
            placeholder="Enter OTP"
            className="w-full py-6 text-center tracking-[1rem]"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
        </div>
        <Button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold"
        >
          Verify Account
        </Button>
      </form>
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={handleResendOtp}
          disabled={cooldown > 0}
          className="text-accent-orange disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
        </button>
      </div>
    </div>
  )
}
