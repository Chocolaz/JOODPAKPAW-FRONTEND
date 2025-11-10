'use client'

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
      <div className="sticky top-4 z-50 w-full bg-white/95 rounded-full backdrop-blur">
        <div className="container flex h-14 items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search" className="pl-10 py-7 rounded-full" />
          </div>
        </div>
      </div>
      <header>
        <h4 className="mt-7 text-deep-teal">
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
        <h5 className="text-xl font-medium text-deep-teal mb-4">Properties</h5>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {properties.map((property) => (
            <div key={property.id}>
              <div className="relative w-[130px] h-[130px]">
                <Image
                  src={
                    property.images.length > 0
                      ? `${API_BASE_URL}${property.images[0].filePath}`
                      : '/graphics/home.svg'
                  }
                  alt={property.title}
                  width={130}
                  height={130}
                  className="object-cover rounded-[14px] shadow-lg"
                />
              </div>
              <div className="mt-2 w-[130px]">
                <p className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-deep-teal">
                  {property.title}
                </p>
                <p className="text-[10px] text-gray-500">
                  {property.province}, {property.district}
                </p>
                {property.roomCategory && (
                  <p className="font-bold text-[10px]">
                    THB {property.roomCategory.basePrice}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
