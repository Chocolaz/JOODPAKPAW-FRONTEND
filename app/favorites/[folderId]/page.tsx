'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  getFavoriteFolderById,
  deleteFavoriteFolder,
  renameFavoriteFolder,
} from '@/lib/api'
import { FavoriteFolderDetail } from '@/types/favorite'
import { PropertyCard } from '@/app/_components/PropertyCard'
import { AppHeader } from '@/app/_components/AppHeader'
import {
  Loader2,
  Menu,
  Edit,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { toast } from 'sonner'

export default function FavoriteFolderDetailPage() {
  const params = useParams()
  const folderId = params.folderId as string
  const router = useRouter()

  const [folder, setFolder] = useState<FavoriteFolderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [drawerContent, setDrawerContent] = useState<
    'options' | 'confirmDelete' | 'renameFolder'
  >('options')
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    if (folderId) {
      const fetchFolder = async () => {
        setIsLoading(true)
        try {
          const response = await getFavoriteFolderById(folderId)
          setFolder(response)
          setNewFolderName(response.name) // Initialize newFolderName with current folder name
        } catch (err) {
          setError('Failed to fetch folder details.')
        } finally {
          setIsLoading(false)
        }
      }
      fetchFolder()
    }
  }, [folderId])

  const handleDrawerOpenChange = (open: boolean) => {
    setIsMenuOpen(open)
    if (!open) {
      // Reset to default view when drawer is closed
      setTimeout(() => {
        setDrawerContent('options')
        // Also reset folder name input on close
        if (folder) {
          setNewFolderName(folder.name)
        }
      }, 300)
    }
  }

  const handleDeleteFolder = async () => {
    if (!folderId) return

    try {
      await deleteFavoriteFolder(folderId)
      toast.success(`The folder "${folder?.name}" has been removed.`)
      router.push('/favorites')
    } catch (err) {
      toast.error('Failed to delete folder. Please try again later.')
      console.error('Failed to delete folder:', err)
      setIsMenuOpen(false) // Close drawer on error
    }
  }

  const handleRenameFolder = async () => {
    if (!folderId || !newFolderName || newFolderName === folder?.name) return

    try {
      await renameFavoriteFolder(folderId, newFolderName)
      setFolder((prev) => (prev ? { ...prev, name: newFolderName } : null))
      toast.success('Folder renamed successfully!')
      setIsMenuOpen(false)
    } catch (err) {
      toast.error('Failed to rename folder. Please try again later.')
      console.error('Failed to rename folder:', err)
      setIsMenuOpen(false)
    }
  }

  const menuButton = (
    <button
      onClick={() => setIsMenuOpen(true)}
      className="rounded-full hover:bg-gray-100"
    >
      <Menu className="w-6 h-6 text-neutral-gray" />
    </button>
  )

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-red-500 text-center flex flex-col items-center justify-center h-64">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      )
    }

    if (!folder || folder.properties.length === 0) {
      return (
        <div className="text-center text-gray-500">This folder is empty.</div>
      )
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {folder.properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            showHeartIcon={true}
            href={`/${property.id}?fromFavorites=true&folderId=${folderId}`}
          />
        ))}
      </div>
    )
  }

  const renderDrawerContent = () => {
    if (drawerContent === 'confirmDelete') {
      return (
        <>
          <DrawerHeader className="flex items-center">
            <button
              onClick={() => setDrawerContent('options')}
              className="rounded-full hover:bg-gray-100 mr-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <DrawerTitle>Remove Folder?</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-4">
            <p>
              The folder “{folder?.name}” and all its shared links will be
              removed from your Favorites.
            </p>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => setIsMenuOpen(false)}
                className="border-none shadow-none"
              >
                No, keep it
              </Button>
              <Button
                variant="outline"
                className="border-red-500  text-red-500"
                onClick={handleDeleteFolder}
              >
                Yes, remove
              </Button>
            </div>
          </div>
        </>
      )
    }

    if (drawerContent === 'renameFolder') {
      return (
        <>
          <DrawerHeader className="flex items-center">
            <button
              onClick={() => setDrawerContent('options')}
              className="rounded-full hover:bg-gray-100 mr-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <DrawerTitle>Rename Folder</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <Input
                value={newFolderName}
                onChange={(e) => {
                  if (e.target.value.length <= 20) {
                    setNewFolderName(e.target.value)
                  }
                }}
                placeholder="New folder name"
                maxLength={20}
              />
              <p className="text-right text-sm text-gray-500">
                {newFolderName.length}/20
              </p>
            </div>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                className="border-none shadow-none"
                onClick={() => setIsMenuOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRenameFolder}
                className="bg-deep-teal px-4"
                disabled={
                  newFolderName.length === 0 ||
                  newFolderName === folder?.name
                }
              >
                Confirm
              </Button>
            </div>
          </div>
        </>
      )
    }

    // Default 'options' view
    return (
      <>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <div className="pb-4">
          <div
            className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 cursor-pointer border-b border-gray-200"
            onClick={() => setDrawerContent('renameFolder')}
          >
            <div className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Rename
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
          <div
            className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => setDrawerContent('confirmDelete')}
          >
            <div className="flex items-center text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete folder
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <AppHeader title="" backPath="/favorites" menu={menuButton} />
      <div className="container mx-auto px-4 py-8">
        {folder && (
          <h4 className="text-xl font-semibold mb-4">{folder.name}</h4>
        )}
        {renderContent()}
      </div>
      <Drawer open={isMenuOpen} onOpenChange={handleDrawerOpenChange}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">{renderDrawerContent()}</div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
