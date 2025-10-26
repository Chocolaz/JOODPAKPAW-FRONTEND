'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginForm() {
  return (
    <div className="px-5 w-full max-w-sm text-center mx-auto mt-[30px] ">
      <form className="space-y-[30px] mt-[70px]">
        <div>
          <Input
            type="email"
            placeholder="Email"
            className="w-full py-6"
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            className="w-full py-6"
          />
          <div className="text-right mt-2">
            <Link
              href="/authen/forgot-password"
              className="text-sm text-accent-orange font-medium hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>
        <Button className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 h-auto text-[20px] font-semibold">
          Sign in
        </Button>
      </form>
      <div className="mt-[30px]">
        <Link
          href="/register"
          passHref>
          <div className="py-4  text-deep-teal h-auto text-[20px] font-semibold">
            Create new account
          </div>
        </Link>
      </div>
    </div>
  )
}
