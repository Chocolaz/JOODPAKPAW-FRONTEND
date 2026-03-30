'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuthRedirect } from '@/lib/authenUtils'
import { Spinner } from '@/components/ui/spinner'
import { assetPath } from '@/lib/utils'

export default function AuthenLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthRedirect('/')

  if (isAuthenticated === null || isAuthenticated === true) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-10 h-10" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] bg-deep-teal flex-col items-center justify-center gap-10 p-12 sticky top-0 h-screen shrink-0">
        <Link href="/">
          <div className="relative w-[200px] h-14 overflow-hidden">
            <Image
              src={assetPath('/icons/JOODPAK.svg')}
              alt="JoodPakPaw"
              fill
              style={{ objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0) invert(1)' }}
              priority
            />
          </div>
        </Link>
        <Image
          src={assetPath('/graphics/welcome.svg')}
          alt="Welcome illustration"
          width={340}
          height={252}
          priority
        />
        <div className="text-center space-y-2">
          <p className="text-white text-lg font-medium leading-relaxed">
            Find trusted stays, loving hosts,<br />and happy tails.
          </p>
          <p className="text-white/60 text-sm">Your pet&apos;s comfort starts here.</p>
        </div>
      </div>

      {/* Right content area */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto py-8 lg:py-12">
        {children}
      </div>
    </div>
  )
}
