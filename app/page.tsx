'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from './_components/PageHeader'
import { PropertyList } from './_components/PropertyList'
import { SearchBar } from './_components/SearchBar'
import { Spinner } from '@/components/ui/spinner'
import { getProperties } from '@/lib/fetchUtils'
import { PropertiesResponse, Property } from '@/types'

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = (await getProperties(1, 10)) as PropertiesResponse
        setProperties(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [])

  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col">
      <div className="px-5">
        <SearchBar />
        <PageHeader />
      </div>
      <div className="flex-1">
        {isLoading ? (
          <div className="grow flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <PropertyList properties={properties} />
        )}
      </div>
    </div>
  )
}
