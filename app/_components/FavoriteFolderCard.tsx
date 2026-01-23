'use client'

import { FavoriteFolder } from '@/types/favorite'
import Image from 'next/image'

interface FavoriteFolderCardProps {
  folder: FavoriteFolder
  onClick: (folderId: number, folderName: string) => void
  disabled: boolean
}

export function FavoriteFolderCard({
  folder,
  onClick,
  disabled,
}: FavoriteFolderCardProps) {
  return (
    <button
      className="block w-36 shrink-0 cursor-pointer disabled:opacity-50 text-left"
      onClick={() => onClick(folder.id, folder.name)}
      disabled={disabled}
    >
      <div className="aspect-square w-full relative">
        <Image
          src={folder.firstPropertyImage || '/graphics/no-room.png'}
          alt={folder.name}
          fill
          unoptimized
          className="object-cover rounded-[20px] shadow-md"
        />
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-deep-teal truncate">
          {folder.name}
        </p>
        <p className="text-xs text-neutral-gray">
          {folder.propertyCount}{' '}
          {folder.propertyCount !== 1 ? 'properties' : 'property'}
        </p>
      </div>
    </button>
  )
}
