'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { PropertyImage } from '@/types'

const MAX_FILES = 10
const MAX_TOTAL_MB = 20
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]

interface ImageManagerProps {
  existingImages: PropertyImage[]
  newFiles: File[]
  onExistingImagesChange: (images: PropertyImage[]) => void
  onNewFilesChange: (files: File[]) => void
  renderAsGridAddButton?: boolean // New prop
}

export function ImageManager({
  existingImages = [],
  newFiles = [],
  onExistingImagesChange,
  onNewFilesChange,
  renderAsGridAddButton = false, // Default to false
}: ImageManagerProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const incomingFiles = Array.from(e.target.files)
    const totalCurrentImageCount = existingImages.length + newFiles.length

    if (totalCurrentImageCount + incomingFiles.length > MAX_FILES) {
      toast.error(`You can upload a maximum of ${MAX_FILES} photos.`)
      return
    }

    const validatedFiles: File[] = []
    for (const file of incomingFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`File type not supported: ${file.name}`)
        continue // Skip this file
      }
      validatedFiles.push(file)
    }

    const existingSize = existingImages.reduce(
      (acc, img) => acc + (img.fileSize || 0),
      0,
    )
    const newFilesSize = newFiles.reduce((acc, file) => acc + file.size, 0)
    const incomingSize = validatedFiles.reduce(
      (acc, file) => acc + file.size,
      0
    )
    const totalSize = existingSize + newFilesSize + incomingSize

    if (totalSize / (1024 * 1024) > MAX_TOTAL_MB) {
      toast.error(`Total image size cannot exceed ${MAX_TOTAL_MB}MB.`)
      return
    }

    onNewFilesChange([...newFiles, ...validatedFiles])
  }

  const removeNewFile = (index: number) => {
    onNewFilesChange(newFiles.filter((_, i) => i !== index))
  }

  const removeExistingImage = (id: number) => {
    onExistingImagesChange(existingImages.filter((img) => img.id !== id))
  }

  const totalImages = existingImages.length + newFiles.length

  const fileInput = (
    <Input
      id="file-upload"
      type="file"
      multiple
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />
  )

  return (
    <div className="w-full text-center">
      {!renderAsGridAddButton && (
        <div className="flex justify-center mb-6">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full max-w-xs aspect-square border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-deep-teal/50 transition-colors bg-white"
          >
            <Image
              src="/graphics/steps/add-photo.svg"
              alt="Add photo icon"
              width={190}
              height={190}
              className="mb-4"
            />
            <span className="text-deep-teal font-medium">Click to upload</span>
            {fileInput}
          </label>
        </div>
      )}

      {/* Preview Grid */}
      {(totalImages > 0 || renderAsGridAddButton) && (
        <div className="flex gap-4 pb-4 overflow-x-auto hide-scrollbar">
          {existingImages.map((image) => (
            <div
              key={`existing-${image.id}`}
              className="relative flex-none w-[100px] aspect-square rounded-xl overflow-hidden shadow-sm border"
            >
              <Image
                src={image.filePath}
                alt="Existing property"
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(image.id)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
          {newFiles.map((file, index) => (
            <div
              key={`new-${index}`}
              className="relative flex-none w-[100px] aspect-square rounded-xl overflow-hidden shadow-sm border"
            >
              <Image
                src={URL.createObjectURL(file)}
                alt="New upload"
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeNewFile(index)}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}

          {renderAsGridAddButton && totalImages < MAX_FILES && (
            <label
              htmlFor="file-upload"
              className="flex-none w-[100px] flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-deep-teal/50 transition-colors bg-white"
            >
              <Plus className="w-10 h-10 text-gray-400" />
              <span className="font-medium text-sm">Add More</span>
              {fileInput}
            </label>
          )}
        </div>
      )}

      {/* Image count */}
      {totalImages > 0 && (
        <p className="text-sm text-neutral-gray mt-4">
          {totalImages} out of {MAX_FILES} images uploaded
        </p>
      )}
    </div>
  )
}
