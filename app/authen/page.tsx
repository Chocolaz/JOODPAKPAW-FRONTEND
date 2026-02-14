import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AuthHeader from './_components/AuthHeader'
import { assetPath } from '@/lib/utils'

export default function AuthenPage() {
  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col">
      <AuthHeader>
        <Image
          src={assetPath('/graphics/welcome.svg')}
          alt="Welcome"
          width={391}
          height={372}
        />
      </AuthHeader>

      <div className="px-5 w-full max-w-sm text-center mx-auto mt-8">
        <h1 className="text-accent-orange">
          Welcome to <br /> JOODPAKPAW
        </h1>
        <div className="text-[16px] mb-[150px]">
          <p>Find trusted stays, loving hosts, and happy tails.</p>
          <p>Your pet’s comfort starts here.</p>
        </div>
        <div className="flex h-[60px]">
          <Link href="/authen/login" passHref className="flex-1">
            <Button className="w-full py-4 rounded-lg bg-accent-orange text-white hover:bg-accent-orange/80 mr-2 h-full text-[20px] font-semibold">
              Sign In
            </Button>
          </Link>
          <Link href="/authen/register" passHref className="flex-1">
            <Button
              variant="outline"
              className="w-full py-4 rounded-lg border-deep-teal text-deep-teal hover:bg-deep-teal hover:text-white ml-2 h-full text-[20px] font-semibold"
            >
              Sign Up
            </Button>
          </Link>
        </div>
        <div className="mt-4">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              className="w-full text-deep-teal text-[18px] font-semibold"
            >
              Continue without signing in
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
