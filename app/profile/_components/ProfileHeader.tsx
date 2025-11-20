'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

interface ProfileHeaderProps {
  title: string
  backPath?: string
  menu?: React.ReactNode
}

export const ProfileHeader = ({
  title,
  backPath,
  menu,
}: ProfileHeaderProps) => {
  const router = useRouter()

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between w-full h-14 px-4 bg-white border-b-2">
      <div className="w-10">
        {backPath && (
          <button
            onClick={() => router.push(backPath)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-neutral-gray" />
          </button>
        )}
      </div>
      <h2 className="text-xl font-semibold text-deep-teal absolute left-1/2 -translate-x-1/2">
        {title}
      </h2>
      <div className="w-10">{menu}</div>
    </header>
  )
}
