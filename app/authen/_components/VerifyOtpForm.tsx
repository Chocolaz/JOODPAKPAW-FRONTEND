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
    <div className="px-5 w-full max-w-sm text-center mx-auto grow relative">
      <div className="pt-10 pb-28">
        <form id="verify-otp-form" onSubmit={handleVerifyOtp}>
          <div>
            <p className="text-[20px] mb-16">
              We’ve sent a 6-digit code to{' '}
              <strong className="text-deep-teal">{email}</strong>
              <br /> Please enter it below
            </p>
            <Input
              type="text"
              placeholder="OTP"
              className="w-full py-6 text-center tracking-[1rem]"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              maxLength={6}
            />
          </div>
        </form>
        <div className="mt-8 text-center">
          <span>Didn’t get the code? </span>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={cooldown > 0}
            className="text-accent-orange disabled:text-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-7">
        <Button
          type="submit"
          form="verify-otp-form"
          disabled={isButtonDisabled}
          className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold"
        >
          Confirm
        </Button>
      </div>
    </div>
  )
}
