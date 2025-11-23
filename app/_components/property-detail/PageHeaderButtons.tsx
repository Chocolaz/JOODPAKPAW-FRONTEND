'use client'

import { ChevronLeft, Share2 } from 'lucide-react'

interface PageHeaderButtonsProps {
  onBackClick: () => void
  onShareClick: () => void
}

export function PageHeaderButtons({
  onBackClick,
  onShareClick,
}: PageHeaderButtonsProps) {
  return (
    <>
      <button
        onClick={onBackClick}
        className="fixed top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-gray-100 transition"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button
        onClick={onShareClick}
        className="fixed top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-gray-100 transition"
      >
        <Share2 className="w-6 h-6 text-gray-800" />
      </button>
    </>
  )
}
