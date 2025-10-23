import Image from 'next/image'
import Link from 'next/link'

export default function AuthenPage() {
  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col">
      <div className="relative w-full flex justify-center pt-10">
        <div className="absolute top-0 z-0">
          <Image
            src="/graphics/Ellipse.svg"
            alt="Background Ellipse"
            width={452}
            height={308}
          />
        </div>
        <div className="z-10">
          <Image
            src="/graphics/welcome.svg"
            alt="Welcome"
            width={391}
            height={372}
          />
        </div>
      </div>

      <div className="p-8 w-full max-w-sm text-center mx-auto mt-8">
        <h1 className="font-heading mb-4 text-[32px] text-accent-orange font-bold">
          Welcome to JOODPAKPAW
        </h1>
        <p className="mb-8 text-lg">Your pet's comfort starts here</p>
        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            passHref>
            <button className="w-full p-3 rounded-lg border-none bg-blue-500 text-white cursor-pointer hover:bg-blue-600">
              Login
            </button>
          </Link>
          <Link
            href="/register"
            passHref>
            <button className="w-full p-3 rounded-lg border border-gray-300 bg-white text-foreground cursor-pointer hover:bg-gray-100">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
