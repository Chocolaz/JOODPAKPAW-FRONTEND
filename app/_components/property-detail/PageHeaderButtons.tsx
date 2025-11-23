'use client'

import { ChevronLeft, Share2, Pencil, Globe, GlobeLock } from 'lucide-react'

interface PageHeaderButtonsProps {
  onBackClick: () => void
  onShareClick: () => void
  onEditClick?: () => void
  onGlobeClick?: () => void
  isPropertyActive?: boolean
}

export function PageHeaderButtons({
  onBackClick,
  onShareClick,
  onEditClick,
  onGlobeClick,
  isPropertyActive,
}: PageHeaderButtonsProps) {
  return (
    <>
      <button
        onClick={onBackClick}
        className="fixed top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-gray-100 transition"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
        {onGlobeClick && (
          <button
            onClick={onGlobeClick}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-gray-100 transition"
          >
            {isPropertyActive ? (
              <Globe className="w-5 h-5 text-gray-800" />
            ) : (
              <GlobeLock className="w-5 h-5 text-gray-800" />
            )}
          </button>
        )}
        {onEditClick && (
          <button
            onClick={onEditClick}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-gray-100 transition"
          >
            <Pencil className="w-5 h-5 text-gray-800" />
          </button>
        )}
        <button
          onClick={onShareClick}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-gray-100 transition"
        >
          <Share2 className="w-5 h-5 text-gray-800" />
        </button>
      </div>
    </>
  )
}