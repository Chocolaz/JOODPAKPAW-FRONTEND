'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { getHostPropertyById } from '@/lib/api'
import { Property } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export default function HostPropertyDetailPage() {
  const params = useParams()
  const propertyId = params.propertyId as string

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!propertyId) return

    const fetchProperty = async () => {
      try {
        setLoading(true)
        const response = await getHostPropertyById(propertyId)
        setProperty(response.property)
        setError(null)
      } catch (err) {
        setError('Failed to fetch property details. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      )
    }

    if (error) return <ErrorState error={error} />
    if (!property) return <ErrorState error="Property not found." />

    /* Normalize image URLs */
    const images = property.images?.length
      ? property.images.map((img) => {
          let url = img.filePath
          if (!url.startsWith('http')) {
            url = url.replace(/^(https?:)?\/*/, '')
            url = `http://${url}`
          }
          return url.replace(/(?<!:)\/\//g, '/')
        })
      : ['/graphics/no-image.svg']

    return (
      <div className="max-w-4xl mx-auto pb-24">
        {/* -------------------- IMAGE SLIDESHOW -------------------- */}
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((src, i) => (
                <CarouselItem key={i}>
                  <div
                    className="relative w-full aspect-square rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => {
                      setCurrentIndex(i)
                      setLightboxOpen(true)
                    }}
                  >
                    <Image
                      src={src}
                      alt={`Image ${i}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2 bg-white/80 backdrop-blur-sm shadow rounded-full" />
                <CarouselNext className="right-2 bg-white/80 backdrop-blur-sm shadow rounded-full" />
              </>
            )}
          </Carousel>
        </div>

        {/* -------------------- LIGHTBOX -------------------- */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={images.map((src) => ({ src }))}
          index={currentIndex}
          on={{ view: ({ index }) => setCurrentIndex(index) }}
          carousel={{
            finite: images.length <= 1, // ปิด swipe ถ้ามีรูปเดียว
            imageFit: 'contain',
          }}
          styles={{
            root: {
              '--yarl__color_backdrop': 'rgba(0,0,0,0.8)', // พื้นหลังดำ 50% opacity
            },
          }}
        />

        <div className="px-4 sm:px-0">
          {/* -------------------- TITLE -------------------- */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {property.title}
            </h1>
            <p className="text-gray-600 mt-1">
              {property.district}, {property.province}, {property.country}
            </p>
          </div>

          {/* -------------------- PROPERTY INFO GRID -------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="p-4 border rounded-xl shadow-sm bg-white">
              <p className="text-gray-500 text-sm">Base Price</p>
              <p className="text-xl font-semibold text-emerald-700 mt-1">
                THB {property.roomCategory?.basePrice || 'N/A'} / night
              </p>
            </div>

            <div className="p-4 border rounded-xl shadow-sm bg-white">
              <p className="text-gray-500 text-sm">Property Type</p>
              <p className="text-lg font-medium mt-1 capitalize">
                {property.propertyType?.name.replace(/_/g, ' ')}
              </p>
            </div>

            <div className="p-4 border rounded-xl shadow-sm bg-white">
              <p className="text-gray-500 text-sm">Rating</p>
              <p className="text-lg font-medium mt-1">
                ⭐ {property.avgRating} ({property.reviewCount} reviews)
              </p>
            </div>

            <div className="p-4 border rounded-xl shadow-sm bg-white">
              <p className="text-gray-500 text-sm">Created At</p>
              <p className="text-lg mt-1">{property.createdAt}</p>
            </div>
          </div>

          {/* -------------------- DESCRIPTION -------------------- */}
          <div className="border-t pt-8 mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {property.description || 'No description provided.'}
            </p>
          </div>

          {/* -------------------- FACILITIES -------------------- */}
          {property.facilities && property.facilities.length > 0 && (
            <div className="border-t pt-8 mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Facilities
              </h2>

              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.facilities?.map((f) => (
                  <li
                    key={f.id}
                    className="p-3 rounded-lg bg-gray-50 border text-gray-700"
                  >
                    • {f.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* -------------------- HOST INFO -------------------- */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">
              Host Information
            </h2>

            <p className="text-gray-700">
              Host ID: <span className="font-medium">{property.hostId}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <div>{renderContent()}</div>
}
