'use client'

import { Property } from '@/types'
import { ChevronLeft, Share2, Globe, GlobeLock } from 'lucide-react'
import { HostActionMenu } from '@/app/profile/host/_components/HostActionMenu'

interface PageHeaderButtonsProps {
  property?: Property
  onBackClick: () => void
  onShareClick: () => void
  onDeleteClick?: () => void
  onGlobeClick?: () => void
  isPropertyActive?: boolean
  onDataChange?: () => void
}

export function PageHeaderButtons({
  property,
  onBackClick,
  onShareClick,
  onDeleteClick,
  onGlobeClick,
  isPropertyActive,
  onDataChange,
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
        <button
          onClick={onShareClick}
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-gray-100 transition"
        >
          <Share2 className="w-5 h-5 text-gray-800" />
        </button>
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
        {property && onDataChange && (
          <HostActionMenu
            property={property}
            onDeleteClick={onDeleteClick}
            onDataChange={onDataChange}
          />
        )}
      </div>
    </>
  )
}
