'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from './_components/PageHeader'
import { PropertyList } from './_components/PropertyList'
import { SearchBar } from '@/app/_components/SearchBar'
import { getProperties } from '@/lib/api'
import { PropertiesResponse, Property } from '@/types'
import { useAuth } from './_components/AuthContext'

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { isAuthenticated } = useAuth()

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true)
        const params: { search?: string; searchBy?: string } = {}
        if (searchQuery) {
          params.search = searchQuery
          params.searchBy = 'title'
        }
        const response = (await getProperties(
          1,
          1000,
          params.search,
          params.searchBy
        )) as PropertiesResponse
        setProperties(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [searchQuery, isAuthenticated])

  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col">
      <div className="px-5">
        <SearchBar onSearch={handleSearch} value={searchQuery} />
        <PageHeader />
      </div>
      <main className="mt-5 pb-24 flex-1">
        <h5 className="text-xl font-medium text-deep-teal mb-4 px-5">
          Properties
        </h5>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 px-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square w-full bg-gray-200 rounded-[20px]" />
                <div className="mt-2 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <PropertyList
            properties={properties}
            showPetPolicyChip={true}
            showHeartIcon={isAuthenticated}
          />
        )}
      </main>
    </div>
  )
}
