'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Property } from '@/types'

interface PropertyImageGalleryProps {
  images: Property['images']
}

export function PropertyImageGallery({
  images: propImages,
}: PropertyImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = propImages?.length
    ? propImages.map((img) => {
        let url = img.filePath
        if (!url.startsWith('http')) {
          url = url.replace(/^(https?:)?\/*/, '')
          url = `http://${url}`
        }
        return url.replace(/(?<!:)\/\//g, '/')
      })
    : ['/graphics/no-image.svg']

  return (
    <>
      <div className="w-full pb-2">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((src, i) => (
              <CarouselItem key={i}>
                <div
                  className="relative w-full aspect-square overflow-hidden cursor-pointer"
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

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images.map((src) => ({ src }))}
        index={currentIndex}
        on={{ view: ({ index }) => setCurrentIndex(index) }}
        carousel={{
          finite: images.length <= 1,
          imageFit: 'contain',
        }}
        styles={{
          root: { '--yarl__color_backdrop': 'rgba(0,0,0,0.8)' },
        }}
      />
    </>
  )
}
