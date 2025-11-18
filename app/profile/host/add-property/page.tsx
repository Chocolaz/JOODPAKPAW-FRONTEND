'use client'

import { HostProfileHeader } from '@/app/profile/_components/HostProfileHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AddPropertyPage() {
  return (
    <div className="flex flex-col items-center h-full px-5 max-w-[500px] mx-auto">
      <HostProfileHeader />
      <div className="flex flex-col items-center text-center mt-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Become a Host.</h1>
        <div className="space-y-8 text-neutral-gray text-left">
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Tell us about your space
            </h3>
            <p>
              Share details about your home and environment so pet owners know
              exactly what to expect.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Make it stand out</h3>
            <p>
              Highlight what makes your space special. Features and photos to
              attract more furry guests!
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Publish Your Listing</h3>
            <p>
              Go live and welcome pets to stay! You can always update your
              listing anytime.
            </p>
          </div>
        </div>
      </div>
      <div className="fixed bottom-2 left-0 right-0 bg-white py-5 px-10 z-10 max-w-[500px] mx-auto">
        <Link href="/profile/host/add-property/1" className="w-full">
          <Button className="interact-button">Start</Button>
        </Link>
      </div>
    </div>
  )
}
