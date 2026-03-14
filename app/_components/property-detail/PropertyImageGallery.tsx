'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Property } from '@/types'
import { assetPath } from '@/lib/utils'
import { Grid2x2 } from 'lucide-react'

interface PropertyImageGalleryProps {
  images: Property['images']
}

function GalleryThumb({
  src,
  index,
  onClick,
}: {
  src: string
  index: number
  onClick: (i: number) => void
}) {
  return (
    <div
      className="relative w-full h-full cursor-pointer overflow-hidden group"
      onClick={() => onClick(index)}
    >
      <Image
        src={src}
        alt={`Image ${index}`}
        fill
        unoptimized
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  )
}

export function PropertyImageGallery({
  images: propImages,
}: PropertyImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!carouselApi) return
    setCurrentSlide(carouselApi.selectedScrollSnap())
    carouselApi.on('select', () => setCurrentSlide(carouselApi.selectedScrollSnap()))
  }, [carouselApi])

  const images = propImages?.length
    ? propImages.map((img) => {
        let url = img.filePath
        if (!url.startsWith('http')) {
          url = url.replace(/^(https?:)?\/*/,'')
          url = `http://${url}`
        }
        return url.replace(/(?<!:)\/\//g, '/')
      })
    : [assetPath('/graphics/no-image.svg')]

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const count = images.length

  // Desktop grid layout per image count
  const renderDesktopGrid = () => {
    // 1 image — full width
    if (count === 1) {
      return (
        <div
          className="relative w-full rounded-2xl overflow-hidden cursor-pointer group"
          style={{ height: 480 }}
          onClick={() => openLightbox(0)}
        >
          <Image src={images[0]} alt="Property" fill unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )
    }

    // 2 images — 50/50 side by side
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden" style={{ height: 480 }}>
          {images.map((src, i) => <GalleryThumb key={i} src={src} index={i} onClick={openLightbox} />)}
        </div>
      )
    }

    // 3 images — large left + 2 stacked right
    if (count === 3) {
      return (
        <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden" style={{ height: 480 }}>
          <GalleryThumb src={images[0]} index={0} onClick={openLightbox} />
          <div className="grid grid-rows-2 gap-2">
            <GalleryThumb src={images[1]} index={1} onClick={openLightbox} />
            <GalleryThumb src={images[2]} index={2} onClick={openLightbox} />
          </div>
        </div>
      )
    }

    // 4 images — large left + 3-cell right (top full + bottom 2)
    if (count === 4) {
      return (
        <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden" style={{ height: 480 }}>
          <GalleryThumb src={images[0]} index={0} onClick={openLightbox} />
          <div className="grid grid-rows-2 gap-2">
            <GalleryThumb src={images[1]} index={1} onClick={openLightbox} />
            <div className="grid grid-cols-2 gap-2">
              <GalleryThumb src={images[2]} index={2} onClick={openLightbox} />
              <GalleryThumb src={images[3]} index={3} onClick={openLightbox} />
            </div>
          </div>
        </div>
      )
    }

    // 5+ images — large left + 2x2 right grid + "show all" button
    return (
      <div className="relative grid grid-cols-2 gap-2 rounded-2xl overflow-hidden" style={{ height: 480 }}>
        <GalleryThumb src={images[0]} index={0} onClick={openLightbox} />
        <div className="grid grid-rows-2 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <GalleryThumb src={images[1]} index={1} onClick={openLightbox} />
            <GalleryThumb src={images[2]} index={2} onClick={openLightbox} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <GalleryThumb src={images[3]} index={3} onClick={openLightbox} />
            <GalleryThumb src={images[4]} index={4} onClick={openLightbox} />
          </div>
        </div>
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-800 text-sm font-medium px-4 py-2 rounded-xl shadow-sm hover:bg-white transition-colors"
        >
          <Grid2x2 className="w-4 h-4" />
          Show all {count} photos
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Mobile: carousel */}
      <div className="lg:hidden w-full pb-2">
        <Carousel className="w-full" setApi={setCarouselApi}>
          <CarouselContent>
            {images.map((src, i) => (
              <CarouselItem key={i}>
                <div
                  className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(i)}
                >
                  <Image src={src} alt={`Image ${i}`} fill unoptimized className="object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {count > 1 && (
          <div className="flex justify-center items-center gap-1.5 mt-2.5">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === currentSlide ? 'w-4 bg-deep-teal' : 'w-1.5 bg-gray-300',
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: adaptive grid */}
      <div className="hidden lg:block pb-4">
        {renderDesktopGrid()}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={images.map((src) => ({ src }))}
        index={currentIndex}
        on={{ view: ({ index }) => setCurrentIndex(index) }}
        carousel={{ finite: count <= 1, imageFit: 'contain' }}
        controller={{ closeOnBackdropClick: true }}
        styles={{ root: { '--yarl__color_backdrop': 'rgba(0,0,0,0.8)' } }}
        render={{ buttonPrev: () => null, buttonNext: () => null }}
      />
    </>
  )
}
