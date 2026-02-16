'use client'

import {
  getHostPropertyById,
  updateHostPropertyIsActive,
  deleteProperty,
} from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'
import { ErrorState } from '@/app/profile/_components/ErrorState'
import { usePropertyLoader } from '@/app/_hooks/usePropertyLoader'
import { PropertyImageGallery } from '@/app/_components/property-detail/PropertyImageGallery'
import { PropertyHeader } from '@/app/_components/property-detail/PropertyHeader'
import { PropertyFacilities } from '@/app/_components/property-detail/PropertyFacilities'
import { PropertyLocation } from '@/app/_components/property-detail/PropertyLocation'
import { useRouter } from 'next/navigation'
import { PageHeaderButtons } from '@/app/_components/property-detail/PageHeaderButtons'
import { toast } from 'sonner'
import { useState } from 'react'
import { ConfirmationModal } from '@/app/_components/ConfirmationModal'
import { PropertyRoomCategories } from '@/app/_components/property-detail/PropertyRoomCategories'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Property } from '@/types'
import { normalizeRoomCategories } from '@/lib/utils'
import { PropertyReviews } from '@/app/_components/property-detail/PropertyReviews'
import { PropertyBookingsSection } from './_components/PropertyBookingsSection'
import { AddRoomCategoryForm } from '../_components/AddRoomCategoryForm'
import { Plus, ChevronLeft } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

export default function HostPropertyDetailPage() {
  const { property, loading, error, refreshProperty } =
    usePropertyLoader(getHostPropertyById)
  const router = useRouter()
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isAddRoomDrawerOpen, setIsAddRoomDrawerOpen] = useState(false)

  const handleShare = async () => {
    if (navigator.share && property) {
      const publicUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}/${property.id}`
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: publicUrl,
        })
      } catch (err: unknown) {
        console.error('Error sharing:', err)
      }
    } else {
      console.log('Web Share API not supported.')
    }
  }

  const confirmPublishAction = async () => {
    if (!property || isUpdatingStatus) return
    setShowPublishModal(false)
    setIsUpdatingStatus(true)
    try {
      const newStatus = !property.isActive
      await updateHostPropertyIsActive(property.id.toString(), newStatus)
      toast.success(
        `Property successfully ${newStatus ? 'published' : 'unpublished'}.`
      )
      refreshProperty()
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Failed to update property status. Please try again.'
      )
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const roomCategoriesCount =
    property && property.roomCategories
      ? Array.isArray(property.roomCategories)
        ? property.roomCategories.length
        : 1 // If it's not null/undefined and not an array, assume it's a single object
      : 0

  const handleGlobeClick = () => {
    if (!property) return

    // Only check when trying to publish (isActive is false)
    if (!property.isActive && roomCategoriesCount === 0) {
      toast.error('Please add a room category first.')
      return
    }
    setShowPublishModal(true)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!property || isDeleting) return
    setShowDeleteModal(false)
    setIsDeleting(true)
    try {
      await deleteProperty(property.id.toString())
      toast.success('Property deleted successfully.')
      router.push('/profile/host?tab=properties')
    } catch (err: unknown) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Failed to delete property. Please try again.'
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBack = () => router.push('/profile/host?tab=properties')

  if (loading || isUpdatingStatus || isDeleting) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    )
  }

  if (error) return <ErrorState message={error} />
  if (!property) return <ErrorState message="Property not found." />

  const roomCategoriesArray = normalizeRoomCategories(property.roomCategories)

  const publishModalTitle = property.isActive
    ? 'Unpublish This Property?'
    : 'Publish This Property?'
  const publishModalMessage = property.isActive
    ? `Are you sure you want to unpublish "${property.title}"?<br />It will no longer be visible to the public.`
    : `Are you sure you want to publish "${property.title}"?<br />It will become visible to the public.`

  return (
    <div className="max-w-4xl mx-auto pb-24 relative">
      <PageHeaderButtons
        property={property}
        onBackClick={handleBack}
        onShareClick={handleShare}
        onDeleteClick={handleDelete}
        onGlobeClick={handleGlobeClick}
        isPropertyActive={property.isActive}
        disablePublish={!property.isActive && roomCategoriesCount === 0}
        onDataChange={refreshProperty}
      />

      {/* Publish/Unpublish Confirmation Modal */}
      <ConfirmationModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={confirmPublishAction}
        title={publishModalTitle}
        message={publishModalMessage}
        titleClassName="text-deep-teal"
        confirmButtonClassName={
          property.isActive ? 'bg-accent-orange' : 'bg-positive-green'
        }
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete This Property?"
        message={`Are you sure you want to permanently delete "${property.title}"? This action cannot be undone.`}
        titleClassName="text-red-500"
        confirmButtonClassName="bg-red-500"
      />

      <PropertyImageGallery images={property.images} />

      <div className="px-4 sm:px-0">
        <PropertyHeader property={property} />
        <PropertyFacilities
          facilities={property.facilities}
          description={property.description}
        />
        <Drawer open={isAddRoomDrawerOpen} onOpenChange={setIsAddRoomDrawerOpen}>
          {roomCategoriesArray.length > 0 ? (
            <PropertyRoomCategories
              propertyId={property.id}
              roomCategories={roomCategoriesArray}
              onDeleteSuccess={refreshProperty}
              showDeleteButton={false}
            />
          ) : (
            <div className="border-t pt-8 mt-10">
              <h3 className="mb-3 text-deep-teal">Room Categories</h3>
              <p className="text-neutral-gray mb-4">No room categories added yet.</p>
            </div>
          )}
          <div className={roomCategoriesArray.length > 0 ? 'px-0 mt-4' : ''}>
            <DrawerTrigger asChild>
              <div className="px-6 py-8 border-2 border-dashed border-positive-green rounded-xl cursor-pointer hover:bg-green-50/50 transition-colors">
                <div className="font-medium text-deep-teal text-lg flex items-center justify-between w-full">
                  <span>Add Room Category</span>
                  <Plus className="h-6 w-6 text-positive-green" />
                </div>
              </div>
            </DrawerTrigger>
          </div>
          <DrawerContent>
            <DrawerHeader className="relative">
              <DrawerTitle className="flex items-center gap-2">
                <ChevronLeft
                  className="w-6 h-6 text-neutral-gray cursor-pointer"
                  onClick={() => setIsAddRoomDrawerOpen(false)}
                />
                <span>Add Room Category</span>
              </DrawerTitle>
            </DrawerHeader>
            <AddRoomCategoryForm
              propertyId={property.id}
              onAddSuccess={() => {
                setIsAddRoomDrawerOpen(false)
                refreshProperty()
              }}
            />
          </DrawerContent>
        </Drawer>
        <PropertyReviews
          avgRating={property.avgRating}
          reviewCount={property.reviewCount ?? 0}
          reviews={property.reviews}
        />
        <PropertyLocation property={property} />

        <PropertyBookingsSection
          propertyId={property.id}
          propertyTitle={property.title}
        />
      </div>
    </div>
  )
}
