'use client'

import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'

export const ProfileHeader = ({ onBack }: { onBack: () => void }) => (
  <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-2">
    <button
      onClick={onBack}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out"
    >
      <ChevronLeft className="w-6 h-6 text-neutral-gray" />
    </button>
    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 ease-in-out">
      <Image src="/icons/edit.svg" alt="Edit" width={24} height={24} />
    </button>
  </div>
)
