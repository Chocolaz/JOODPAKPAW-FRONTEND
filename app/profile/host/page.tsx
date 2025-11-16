'use client'

import { HostProfileHeader } from '@/app/profile/_components/HostProfileHeader'

export default function HostPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-5">
      <HostProfileHeader />
      <div className="text-center mt-20">
        <h3 className="text-xl font-semibold text-deep-teal mb-2">
          No host listing
        </h3>
        <p className="text-neutral-gray">
          Open your home and heart to new furry friends
        </p>
      </div>
    </div>
  )
}
