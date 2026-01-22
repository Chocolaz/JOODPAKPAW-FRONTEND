'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Heart, Folder, Plus, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getFavoriteFolders, addFavorite } from '@/lib/favoriteApi'
import { FavoriteFolder } from '@/types/favorite'
import { toast } from 'sonner'

interface FavoriteDrawerProps {
  propertyId: number
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  onSuccess?: () => void
}

export function FavoriteDrawer({
  propertyId,
  isOpen,
  onOpenChange,
  onSuccess,
}: FavoriteDrawerProps) {
  const [folders, setFolders] = useState<FavoriteFolder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    if (isOpen) {
      const fetchFolders = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const response = await getFavoriteFolders()
          setFolders(response.favoriteFolders)
        } catch (err) {
          setError('Failed to fetch folders.')
          toast.error('Failed to fetch folders.')
        } finally {
          setIsLoading(false)
        }
      }
      fetchFolders()
    }
  }, [isOpen])

  const handleSaveToFolder = async (folderId: number) => {
    setIsPosting(true)
    try {
      await addFavorite({ propertyId, folderId })
      toast.success('Saved to folder!')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      toast.error('Failed to save to folder.')
    } finally {
      setIsPosting(false)
    }
  }

  const handleCreateAndSave = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name cannot be empty.')
      return
    }
    setIsPosting(true)
    try {
      await addFavorite({ propertyId, folderName: newFolderName })
      toast.success('Saved to new folder!')
      setNewFolderName('')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      toast.error('Failed to create and save.')
    } finally {
      setIsPosting(false)
    }
  }

  const handleSaveToDefault = async () => {
    setIsPosting(true)
    try {
      await addFavorite({ propertyId })
      toast.success('Saved to default wishlist!')
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      toast.error('Failed to save to default wishlist.')
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Save to wishlist</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {folders.map((folder) => (
                    <Button
                      key={folder.id}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleSaveToFolder(folder.id)}
                      disabled={isPosting}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      {folder.name}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Folder Name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                  <Button onClick={handleCreateAndSave} disabled={isPosting}>
                    <Plus className="mr-2 h-4 w-4" /> Create & Save
                  </Button>
                </div>

                <Button
                  className="w-full"
                  onClick={handleSaveToDefault}
                  disabled={isPosting}
                >
                  Save to default wishlist
                </Button>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
