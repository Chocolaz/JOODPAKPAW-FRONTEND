'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const HostProfileHeader = () => {
  const router = useRouter()
  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-2">
      <button
        onClick={() => router.back()}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out"
      >
        <ChevronLeft className="w-6 h-6 text-neutral-gray" />
      </button>
      {/* No edit button for host page */}
      <div className="w-10"></div> {/* Placeholder for alignment */}
    </div>
  )
}
