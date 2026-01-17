'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from './_components/PageHeader'
import { PropertyList } from './_components/PropertyList'
import { SearchBar } from './_components/SearchBar'
import { Spinner } from '@/components/ui/spinner'
import { getProperties } from '@/lib/api'
import { PropertiesResponse, Property } from '@/types'

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

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
  }, [searchQuery])

  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col">
      <div className="px-5 ">
        <SearchBar onSearch={handleSearch} value={searchQuery} />
        <PageHeader />
      </div>
      <div className="flex-1">
        {isLoading ? (
          <div className="grow flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <main className="mt-5 pb-24">
            <h5 className="text-xl font-medium text-deep-teal mb-4 px-5">
              Properties
            </h5>
            <PropertyList properties={properties} showPetPolicyChip={true} />
          </main>
        )}
      </div>
    </div>
  )
}
