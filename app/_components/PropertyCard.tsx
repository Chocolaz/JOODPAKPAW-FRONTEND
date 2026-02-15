'use client'

import { Property } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { cn, getLowestPrice, getPetPolicy, assetPath } from '@/lib/utils'
import { Globe, GlobeLock, Heart } from 'lucide-react'
import { FavoriteDrawer } from './FavoriteDrawer'
import { getFavoriteFolders, addFavorite, deleteFavoriteProperty } from '@/lib/api'
import { ApiError } from '@/lib/errorHandling'
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
  favoriteFolderId?: number
}

export function PropertyCard({
  property,
  href,
  className,
  showRoomCount,
  showStatusIcon = false,
  showPetPolicyChip = false,
  showHeartIcon = false,
  favoriteFolderId,
}: PropertyCardProps) {
  const [imgSrc, setImgSrc] = useState(
    property.images.length > 0 && API_BASE_URL
      ? new URL(property.images[0].filePath, API_BASE_URL).toString()
      : assetPath('/graphics/welcome.svg')
  )
  const [isHeartClicked, setIsHeartClicked] = useState(property.isFavorite)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    setIsHeartClicked(property.isFavorite)
  }, [property.isFavorite])

  const finalHref = href || `/${property.id}`

  const lowestPrice = getLowestPrice(property.roomCategories)
  const petPolicy = getPetPolicy(property.pets)

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isHeartClicked) {
      try {
        await deleteFavoriteProperty(property.id)
        setIsHeartClicked(false)
        toast.success('Property removed from favorites.', {
          action: {
            label: 'undo',
            onClick: async () => {
              try {
                if (favoriteFolderId) {
                  await addFavorite({ propertyId: property.id, folderId: favoriteFolderId })
                } else {
                  const res = await getFavoriteFolders()
                  const folders = res.favoriteFolders
                  if (folders.length === 0) {
                    await addFavorite({ propertyId: property.id })
                  } else {
                    const sorted = folders.sort((a, b) => a.id - b.id)
                    await addFavorite({
                      propertyId: property.id,
                      folderId: sorted[0].id,
                    })
                  }
                }
                setIsHeartClicked(true)
              } catch (_err) {
                toast.error('Failed to undo.')
              }
            },
          },
          actionButtonStyle: {
            color: 'gray',
            textDecoration: 'underline',
            fontSize: '1rem',
          },
        })
      } catch (_error) {
        toast.error('Failed to remove from favorites.')
      }
    } else {
      try {
        const foldersResponse = await getFavoriteFolders()
        const folders = foldersResponse.favoriteFolders
        let folderName = 'default wishlist'

        if (folders.length === 0) {
          await addFavorite({ propertyId: property.id })
        } else {
          // Sort folders by ID to ensure consistency
          const sortedFolders = folders.sort((a, b) => a.id - b.id)
          const targetFolder = sortedFolders[0]
          folderName = targetFolder.name
          await addFavorite({
            propertyId: property.id,
            folderId: targetFolder.id,
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
      } catch (error) {
        if (error instanceof ApiError && error.code === 'FF-4101') {
          // Property is already favorited in another folder — open drawer to move it
          setIsHeartClicked(true)
          setIsDrawerOpen(true)
        } else {
          toast.error('Failed to add to favorites.')
        }
      }
    }
  }

  return (
    <div className={cn('block', className)}>
      {/* Image Box — Square Responsive */}
      <div className="w-full aspect-square relative">
        <Link href={finalHref} className="relative block w-full h-full">
          <Image
            src={imgSrc}
            alt={property.title}
            fill
            unoptimized
            className="object-cover rounded-[20px] shadow-md"
            onError={() => setImgSrc(assetPath('/graphics/welcome.svg'))}
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
              className="absolute top-2 right-2 p-1 rounded-full cursor-pointer bg-transparent border-none"
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
