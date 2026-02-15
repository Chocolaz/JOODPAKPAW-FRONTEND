'use client'

import { useState } from 'react'
import AuthHeader from '../_components/AuthHeader'
import ResetPasswordForm from '../_components/ResetPasswordForm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type PageState = 'form' | 'success' | 'expired'

export default function ResetPasswordPage() {
  const [pageState, setPageState] = useState<PageState>('form')

  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col items-center">
      <AuthHeader>
        <div className="mt-20 text-center">
          {pageState === 'success' && (
            <>
              <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
                Password Reset Successful
              </h1>
              <div className="text-[20px]">
                You can now log in with your new password.
              </div>
            </>
          )}
          {pageState === 'expired' && (
            <>
              <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
                Link Expired
              </h1>
              <div className="text-[20px]">
                This reset link has already been used.
                <br />
                Please request a new one.
              </div>
            </>
          )}
          {pageState === 'form' && (
            <>
              <h1 className="text-4xl font-bold text-accent-orange mb-[25px] ">
                Create a new password
              </h1>
              <div className="text-[20px]">
                Choose a strong password you&apos;ll remember
                <br />
                You&apos;ll use it to sign in next time
              </div>
            </>
          )}
        </div>
      </AuthHeader>
      {pageState === 'success' && (
        <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px]">
          <Link href="/authen/login" passHref>
            <Button className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold">
              Go to Login
            </Button>
          </Link>
        </div>
      )}
      {pageState === 'expired' && (
        <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px] space-y-4">
          <Link href="/authen/forgot-password" passHref>
            <Button className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold">
              Request New Link
            </Button>
          </Link>
          <Link href="/authen/login" passHref>
            <Button
              variant="outline"
              className="w-full py-4 rounded-lg border-deep-teal text-deep-teal h-auto text-[20px] font-semibold mt-3"
            >
              Back to Login
            </Button>
          </Link>
        </div>
      )}
      {pageState === 'form' && (
        <ResetPasswordForm
          onSubmitSuccess={() => setPageState('success')}
          onTokenExpired={() => setPageState('expired')}
        />
      )}
    </div>
  )
}
