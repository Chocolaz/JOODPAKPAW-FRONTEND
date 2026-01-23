'use client'

import { Property } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { cn, getLowestPrice, getPetPolicy } from '@/lib/utils'
import { Globe, GlobeLock, Heart } from 'lucide-react'
import { FavoriteDrawer } from './FavoriteDrawer'
import { getFavoriteFolders, addFavorite } from '@/lib/favoriteApi'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface PropertyCardProps {
  property: Property
  href?: string
  className?: string
  showRoomCount?: boolean
  showStatusIcon?: boolean
  showPetPolicyChip?: boolean
  showHeartIcon?: boolean
}

export function PropertyCard({
  property,
  href,
  className,
  showRoomCount,
  showStatusIcon = false,
  showPetPolicyChip = false,
  showHeartIcon = false,
}: PropertyCardProps) {
  const [imgSrc, setImgSrc] = useState(
    property.images.length > 0 && API_BASE_URL
      ? new URL(property.images[0].filePath, API_BASE_URL).toString()
      : '/graphics/welcome.svg'
  )
  const [isHeartClicked, setIsHeartClicked] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const finalHref = href || `/${property.id}`

  const lowestPrice = getLowestPrice(property.roomCategories)
  const petPolicy = getPetPolicy(property.pets)

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const foldersResponse = await getFavoriteFolders()
      const folders = foldersResponse.favoriteFolders
      let folderName = 'default wishlist'

      if (folders.length === 0) {
        // Case: No folders, create a default one
        await addFavorite({ propertyId: property.id })
      } else {
        // Case: Folders exist, add to the first one
        folderName = folders[0].name
        await addFavorite({
          propertyId: property.id,
          folderId: folders[0].id,
        })
      }
      setIsHeartClicked(true)
      toast.success(`Property added to ${folderName}`, {
        action: {
          label: 'change',
          onClick: () => setIsDrawerOpen(true),
        },
        actionButtonStyle: {
          color: 'gray',
          textDecoration: 'underline',
          fontSize: '1rem',
        },
      })
    } catch (_error) {
      toast.error('Failed to add to favorites.')
    }
  }

  return (
    <div className={cn('block', className)}>
      {/* Image Box — Square Responsive */}
      <div className="w-full aspect-square relative">
        <Link href={finalHref}>
          <Image
            src={imgSrc}
            alt={property.title}
            fill
            unoptimized
            className="object-cover rounded-[20px] shadow-md"
            onError={() => setImgSrc('/graphics/welcome.svg')}
          />
        </Link>
        {showPetPolicyChip && petPolicy && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-white rounded-full opacity-90 text-xs font-semibold text-deep-teal shadow-sm">
            {petPolicy}
          </div>
        )}
        {showStatusIcon && !showHeartIcon && (
          <div className="absolute top-2 right-2 p-1 bg-white rounded-full opacity-90">
            {property.isActive ? (
              <Globe className="h-6 w-6 text-deep-teal" />
            ) : (
              <GlobeLock className="h-6 w-6 text-accent-orange" />
            )}
          </div>
        )}
        {showHeartIcon && (
          <>
            <button
              className="absolute top-2 right-2 p-1 rounded-full cursor-pointer z-10 bg-transparent border-none"
              onClick={handleHeartClick}
            >
              <Heart
                className={cn(
                  'h-6 w-6',
                  isHeartClicked
                    ? 'text-white fill-red-400'
                    : 'text-white fill-black/40'
                )}
              />
            </button>
            <FavoriteDrawer
              propertyId={property.id}
              isOpen={isDrawerOpen}
              onOpenChange={setIsDrawerOpen}
              onSuccess={() => setIsHeartClicked(true)}
            />
          </>
        )}
      </div>

      {/* Content */}
      <Link href={finalHref}>
        <div className="mt-2">
          <p className="text-sm font-medium text-deep-teal truncate">
            {property.title}
          </p>

          <p className="text-xs text-neutral-gray truncate">
            {property.province}, {property.district}
          </p>

          {showRoomCount && property.totalRoomCategories !== undefined && (
            <p className="text-xs font-medium">
              {property.totalRoomCategories} Room{' '}
              {property.totalRoomCategories === 1 ? 'Type' : 'Types'}
            </p>
          )}

          {lowestPrice !== null && (
            <p className="font-bold text-[10px]">THB {lowestPrice}</p>
          )}
        </div>
      </Link>
    </div>
  )
}
