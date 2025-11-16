'use client'

import { useState } from 'react'
import AuthHeader from '../_components/AuthHeader'
import ResetPasswordForm from '../_components/ResetPasswordForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)

  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col items-center">
      <AuthHeader>
        <div className="mt-20 text-center">
          {isSuccess ? (
            <>
              <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
                Password Reset Successful
              </h1>
              <div className="text-[20px]">
                You can now log in with your new password.
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
                Create a new password
              </h1>
              <div className="text-[20px]">
                Choose a strong password you’ll remember
                <br />
                You’ll use it to sign in next time
              </div>
            </>
          )}
        </div>
      </AuthHeader>
      {isSuccess ? (
        <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px]">
          <Link href="/authen/login" passHref>
            <Button className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold">
              Go to Login
            </Button>
          </Link>
        </div>
      ) : (
        <ResetPasswordForm onSubmitSuccess={() => setIsSuccess(true)} />
      )}
    </div>
  )
}
