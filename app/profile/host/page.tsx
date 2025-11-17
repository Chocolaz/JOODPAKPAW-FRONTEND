'use client'

import { HostProfileHeader } from '@/app/profile/_components/HostProfileHeader'
import { Button } from '@/components/ui/button'

export default function HostPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5">
      <HostProfileHeader />
      <div className="text-center mt-20 text-neutral-gray">
        <img
          src="/graphics/no-host.svg"
          alt="No host listing"
          className="w-full h-auto max-w-sm mx-auto"
        />
        <h2>No host listing</h2>
        <p>Open your home and heart to new furry friends</p>
      </div>
      <div className="fixed bottom-2 left-0 right-0 bg-white py-5 px-10  z-10">
        <Button className="interact-button">Add Property</Button>
      </div>
    </div>
  )
}
