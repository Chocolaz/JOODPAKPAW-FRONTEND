'use client'

import { useState } from 'react'
import { Property } from '@/types'
import { useGroupedFacilities } from '../_hooks/useGroupedFacilities'
import { updateProperty } from '@/lib/api'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { FacilityCard } from './FacilityCard'
import { ImageManager } from './ImageManager'
import { TitleDescriptionForm } from './TitleDescriptionForm'
import { FormSubmitButton } from './FormSubmitButton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

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

  const {
    groupedFacilities,
    loading: facilitiesLoading,
    error,
  } = useGroupedFacilities()

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
    <form
      className="px-5 h-[80vh] flex flex-col overflow-y-scroll"
      onSubmit={handleSubmit}
    >
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as Tab)}
        className="flex flex-col grow"
      >
        <TabsList className="flex mb-4 bg-transparent p-0 justify-center">
          <TabsTrigger
            value="property"
            className="py-2 px-4 rounded-none border-b-2 border-transparent text-neutral-gray data-[state=active]:border-accent-orange data-[state=active]:text-accent-orange data-[state=active]:bg-transparent"
          >
            Property
          </TabsTrigger>
          <TabsTrigger
            value="facilities"
            className="py-2 px-4 rounded-none border-b-2 border-transparent text-neutral-gray data-[state=active]:border-accent-orange data-[state=active]:text-accent-orange data-[state=active]:bg-transparent"
          >
            Facilities
          </TabsTrigger>
        </TabsList>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          <TabsContent value="property">
            <TitleDescriptionForm
              title={title}
              description={description}
              onTitleChange={setTitle}
              onDescriptionChange={setDescription}
            />
            <div>
              <label className="block font-medium text-deep-teal mb-2">
                Images
              </label>
              <ImageManager
                existingImages={existingImages}
                newFiles={newFiles}
                onExistingImagesChange={setExistingImages}
                onNewFilesChange={setNewFiles}
                renderAsGridAddButton={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="facilities">
            <div className="space-y-8 pb-20">
              {facilitiesLoading ? (
                <Spinner />
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                Object.entries(groupedFacilities).map(
                  ([category, facilities]) => (
                    <div key={category}>
                      <h5 className="text-left text-deep-teal capitalize mb-4">
                        {category}
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {facilities.map((facility) => (
                          <FacilityCard
                            key={facility.id}
                            facility={facility}
                            selected={selectedFacilities.includes(facility.id)}
                            onToggle={toggleFacility}
                          />
                        ))}
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Sticky Submit Button */}
      <div className="sticky bottom-0 bg-white p-4 border-t">
        <FormSubmitButton
          isSubmitting={isSubmitting}
          buttonText="Save Changes"
        />
      </div>
    </form>
  )
}
