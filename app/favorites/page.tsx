'use client'

import { AppHeader } from '@/app/_components/AppHeader'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getFavoriteFolders } from '@/lib/api'
import { FavoriteFolder } from '@/types/favorite'
import { FavoriteFolderCard } from '@/app/_components/FavoriteFolderCard'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

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
  const router = useRouter()

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await getFavoriteFolders()
        setFolders(response.favoriteFolders)
      } catch (err) {
        setError('Failed to fetch favorite folders.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchFolders()
  }, [])

  const handleFolderClick = (folderId: number) => {
    router.push(`/favorites/${folderId}`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
          <p className="text-gray-500 mt-2">
            You can add properties to your favorites to see them here.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="mt-6 bg-deep-teal text-white"
          >
            Find Properties
          </Button>
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
        {folders.map((folder) => (
          <motion.div key={folder.id} variants={itemVariants}>
            <FavoriteFolderCard
              folder={folder}
              onClick={(folderId) => handleFolderClick(folderId)}
              disabled={false}
              widthClass="w-full"
            />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  return (
    <div>
      <AppHeader title="Favorites" backPath="/" />
      <div className="container mx-auto px-5 pt-8 mb-30">{renderContent()}</div>
    </div>
  )
}
