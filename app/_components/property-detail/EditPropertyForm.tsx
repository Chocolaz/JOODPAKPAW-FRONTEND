'use client'

import { useState } from 'react'
import { Property } from '@/types'
import { useFacilities } from '@/app/profile/host/add-property/_hooks/useFacilities'
import { updateProperty } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { FacilityCard } from '@/app/profile/host/_components/FacilityCard'
import { ImageManager } from '@/app/_components/ImageManager'

interface EditPropertyFormProps {
  property: Property
  onSuccess: () => void
}

type Tab = 'property' | 'facilities'

export function EditPropertyForm({
  property,
  onSuccess,
}: EditPropertyFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>('property')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [title, setTitle] = useState(property.title)
  const [description, setDescription] = useState(property.description)
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState(property.images)
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>(
    property.facilities?.map((f) => f.id) || []
  )

  const { facilities: allFacilities, loading: facilitiesLoading } =
    useFacilities()

  const toggleFacility = (id: number) => {
    setSelectedFacilities((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('facilities', JSON.stringify(selectedFacilities))

    // TODO: This needs a more robust way to handle deleted images.
    // The backend would need an array of image IDs to keep, e.g., `existingImageIds`.
    // formData.append('existingImageIds', JSON.stringify(existingImages.map(img => img.id)));

    newFiles.forEach((file) => {
      formData.append('images', file)
    })

    try {
      await updateProperty(property.id.toString(), formData)
      toast.success('Property updated successfully!')
      onSuccess()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to update property.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 max-h-[70vh] overflow-y-auto">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('property')}
          className={`py-2 px-4 ${activeTab === 'property' ? 'border-b-2 border-deep-teal text-deep-teal' : 'text-gray-500'}`}
        >
          Property
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('facilities')}
          className={`py-2 px-4 ${activeTab === 'facilities' ? 'border-b-2 border-deep-teal text-deep-teal' : 'text-gray-500'}`}
        >
          Facilities
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'property' && (
          <>
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <ImageManager
                existingImages={existingImages}
                newFiles={newFiles}
                onExistingImagesChange={setExistingImages}
                onNewFilesChange={setNewFiles}
              />
            </div>
          </>
        )}

        {activeTab === 'facilities' && (
          <div>
            {facilitiesLoading ? <Spinner /> : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allFacilities.map((facility) => (
                  <FacilityCard
                    key={facility.id}
                    facility={facility}
                    selected={selectedFacilities.includes(facility.id)}
                    onToggle={toggleFacility}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-white pt-4 mt-6">
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Spinner /> : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
