'use client'

import { AppHeader } from '@/app/_components/AppHeader'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { getFavoriteFolders, createFavoriteFolder } from '@/lib/api'
import { FavoriteFolder } from '@/types/favorite'
import { FavoriteFolderCard } from '@/app/_components/FavoriteFolderCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Heart, Plus, FolderPlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/app/_components/AuthContext'

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-square w-full bg-gray-200 rounded-[20px]"></div>
    <div className="mt-2 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
)

export default function FavoritesPage() {
  const [folders, setFolders] = useState<FavoriteFolder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const fetchFolders = useCallback(async () => {
    if (!isAuthenticated) {
      setFolders([])
      setIsLoading(false)
      return
    }
    try {
      setError(null)
      const response = await getFavoriteFolders()
      setFolders(response.favoriteFolders)
    } catch {
      setError('Failed to fetch favorite folders.')
    } finally {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!authLoading) {
      fetchFolders()
    }
  }, [fetchFolders, authLoading])

  useEffect(() => {
    if (isDrawerOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isDrawerOpen])

  const handleFolderClick = (folderId: number) => {
    router.push(`/favorites/${folderId}`)
  }

  const handleCreateFolder = async () => {
    const trimmed = newFolderName.trim()
    if (!trimmed) return

    setIsCreating(true)
    try {
      await createFavoriteFolder(trimmed)
      toast.success(`"${trimmed}" folder created!`)
      setNewFolderName('')
      setIsDrawerOpen(false)
      setIsLoading(true)
      await fetchFolders()
    } catch {
      toast.error('Failed to create folder.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDrawerClose = (open: boolean) => {
    setIsDrawerOpen(open)
    if (!open) {
      setTimeout(() => setNewFolderName(''), 300)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
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

    if (folders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Heart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            No favorites yet
          </h3>
          <p className="text-gray-500 mt-2 mb-6">
            Create a folder to start organizing your favorite places.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-deep-teal text-white px-8"
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              Create Folder
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="px-8"
            >
              Find Properties
            </Button>
          </div>
        </div>
      )
    }

    return (
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Create New Folder Card */}
        <motion.div variants={itemVariants}>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="block w-full cursor-pointer text-left group"
          >
            <div className="aspect-square w-full rounded-[20px] border-2 border-dashed border-gray-300 group-hover:border-deep-teal flex flex-col items-center justify-center transition-colors bg-gray-50 group-hover:bg-teal-50/50">
              <div className="w-12 h-12 rounded-full bg-deep-teal/10 group-hover:bg-deep-teal/20 flex items-center justify-center transition-colors mb-2">
                <Plus className="w-6 h-6 text-deep-teal" />
              </div>
              <span className="text-sm font-medium text-deep-teal">
                New Folder
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-deep-teal">
                Create folder
              </p>
              <p className="text-xs text-neutral-gray">
                Organize your favorites
              </p>
            </div>
          </button>
        </motion.div>

        {/* Existing Folder Cards */}
        <AnimatePresence>
          {folders.map((folder) => (
            <motion.div key={folder.id} variants={itemVariants} layout>
              <FavoriteFolderCard
                folder={folder}
                onClick={(folderId) => handleFolderClick(folderId)}
                disabled={false}
                widthClass="w-full"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div>
      <AppHeader title="Favorites" backPath="/" />
      <div className="container mx-auto px-5 pt-8 mb-30">{renderContent()}</div>

      {/* Create Folder Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerClose}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm pb-6">
            <DrawerHeader>
              <DrawerTitle>Create new folder</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 space-y-4">
              <div className="space-y-1">
                <Input
                  ref={inputRef}
                  placeholder="e.g. Summer Trips, Dream Stays..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  maxLength={20}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newFolderName.trim()) {
                      handleCreateFolder()
                    }
                  }}
                />
                <p className="text-xs text-gray-400 text-right">
                  {newFolderName.length}/20
                </p>
              </div>
              <Button
                onClick={handleCreateFolder}
                disabled={isCreating || !newFolderName.trim()}
                className="w-full py-5 bg-deep-teal text-white disabled:opacity-50"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FolderPlus className="mr-2 h-4 w-4" />
                    Create Folder
                  </>
                )}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
