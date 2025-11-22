'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { getHostPropertyById } from '@/lib/api'
import { Property } from '@/types'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { CheckCircle } from 'lucide-react'

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
        <div className="w-full pb-2">
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
          <div className="mb-6 text-deep-teal">
            <h2 className="text-deep-teal">{property.title}</h2>
            <div className="flex justify-between items-center">
              <p>
                {property.district}, {property.province}
              </p>
              <p className="flex items-center gap-1">
                <Star
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  strokeWidth={0}
                />
                <span>
                  {property.avgRating} - {property.reviewCount} reviews
                </span>
              </p>
            </div>
            <p>{property.country}</p>
          </div>

          {/* -------------------- FACILITIES -------------------- */}
          {property.facilities && property.facilities.length > 0 && (
            <div className="border-t pt-8 mb-10">
              <h3 className="text-xl font-semibold text-deep-teal mb-2">
                What your place offers
              </h3>

              <ul className="flex flex-col gap-3">
                {property.facilities.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <CheckCircle className="w-5 h-5 text-accent-orange shrink-0" />
                    <span className="text-neutral-dark">{f.name}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 leading-relaxed">
                {property.description || 'No description provided.'}
              </p>
            </div>
          )}

          {/* -------------------- PROPERTY INFO GRID -------------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="p-4 border rounded-xl shadow-sm bg-white">
              <p className="text-gray-500 text-sm">Base Price</p>
              <p className="text-xl font-semibold text-emerald-700">
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
              <p className="text-gray-500 text-sm">Created At</p>
              <p className="text-lg mt-1">{property.createdAt}</p>
            </div>
          </div>

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
