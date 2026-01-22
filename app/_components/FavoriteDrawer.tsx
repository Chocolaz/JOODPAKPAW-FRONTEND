'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Folder, Plus, Loader2, ArrowLeft } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
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
  const [currentView, setCurrentView] = useState<'list' | 'create'>('list')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Reset to default view when drawer opens
      setCurrentView('list')
      const fetchFolders = async () => {
        setIsLoading(true)
        setError(null)
        try {
          const response = await getFavoriteFolders()
          setFolders(response.favoriteFolders)
        } catch (_err) {
          setError('Failed to fetch folders.')
          toast.error('Failed to fetch folders.')
        } finally {
          setIsLoading(false)
        }
      }
      fetchFolders()
    }
  }, [isOpen])

  useEffect(() => {
    if (currentView === 'create' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentView])

  const handleSaveToFolder = async (folderId: number) => {
    setIsPosting(true)
    try {
      await addFavorite({ propertyId, folderId })
      toast.success('Moved to folder!')
      onOpenChange(false)
      onSuccess?.()
    } catch (_err) {
      toast.error('Failed to move to folder.')
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
    } catch (_err) {
      toast.error('Failed to create and save.')
    } finally {
      setIsPosting(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm pb-5">
          {currentView === 'list' && (
            <div>
              <DrawerHeader>
                <DrawerTitle>Organize your favorite</DrawerTitle>
                <DrawerDescription>Saved to My Wishlist</DrawerDescription>
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
                    <div className="text-center">
                      <Button
                        variant="outline"
                        className="px-8 py-5 bg-deep-teal text-white"
                        onClick={() => setCurrentView('create')}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Create new wishlist
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'create' && (
            <div>
              <DrawerHeader>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 left-3"
                  onClick={() => setCurrentView('list')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <DrawerTitle className="text-center">New wishlist</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                <Input
                  ref={inputRef}
                  placeholder="Folder Name"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
                <Button
                  onClick={handleCreateAndSave}
                  disabled={isPosting}
                  className="w-full"
                >
                  Create & Save
                </Button>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
