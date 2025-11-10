'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getProperties } from '@/lib/fetchUtils'
import { PropertiesResponse, Property } from '@/types'
import { Search } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = (await getProperties(1, 10)) as PropertiesResponse
        setProperties(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchProperties()
  }, [])

  return (
    <div className="bg-white text-foreground min-h-screen flex flex-col px-5">
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur mt-4">
        <div className="container flex h-14 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search" className="pl-10 py-7 rounded-full" />
          </div>
        </div>
        <h4 className="my-3 text-deep-teal">
          Discover Local Pet Hotels & Care Homes Near You
        </h4>
        <div className="mt-4">
          <Image
            src="/graphics/home.svg"
            alt="Illustration of pets and a house"
            width={390}
            height={144}
            className="w-full h-auto"
          />
        </div>
      </header>
      <main className="mt-5">
        <h2 className="text-xl font-bold">Properties</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {properties.map((property) => (
            <Card key={property.id}>
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={
                      property.images.length > 0
                        ? `${API_BASE_URL}${property.images[0].filePath}`
                        : '/graphics/home.svg'
                    }
                    alt={property.title}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                </div>
              </CardContent>
              <CardHeader>
                <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {property.title}
                </CardTitle>
                <CardDescription>
                  {property.province}, {property.district}
                </CardDescription>
              </CardHeader>
              <div className="p-6 pt-0">
                {property.roomCategory && (
                  <p className="font-bold">
                    THB {property.roomCategory.basePrice}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
