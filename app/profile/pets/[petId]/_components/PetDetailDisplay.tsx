'use client'

import { useState } from 'react'
import { PetProfile } from '@/types'
import { Button } from '@/components/ui/button'
import {
  Phone,
  User,
  Mars,
  Venus,
  Zap,
  Scale,
  EllipsisVertical,
  Edit,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { differenceInYears, format } from 'date-fns'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { deletePetProfile } from '@/lib/api'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { ConfirmationModal } from '@/app/_components/ConfirmationModal'
import EditPetProfileForm from './EditPetProfileForm' // Import the new component

interface PetDetailDisplayProps {
  pet: PetProfile
  onDelete?: () => void
  onPetUpdate: () => void // Changed to void
}

export default function PetDetailDisplay({
  pet,
  onDelete,
  onPetUpdate,
}: PetDetailDisplayProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const guestPetImageSrc = `${basePath}/graphics/guest.jpg`

  const birthDate = pet.birthDate ? new Date(pet.birthDate) : null
  const age = birthDate ? differenceInYears(new Date(), birthDate) : null
  const formattedBirthDate = birthDate
    ? format(birthDate, 'MMM d, yyyy')
    : 'N/A'

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false) // New state for edit drawer
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deletePetProfile(String(pet.id))
      toast.success(`${pet.name} has been deleted.`)
      router.push('/profile/pets')
    } catch (error) {
      console.error('Failed to delete pet profile:', error)
      toast.error('Failed to delete pet profile.')
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="pb-10 bg-gray-50 min-h-screen">
      <div className="relative w-full aspect-square">
        <img
          src={pet.image || guestPetImageSrc}
          alt={pet.name}
          className="object-cover w-full h-full rounded-b-2xl"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <button
          onClick={() => router.push('/profile/pets')}
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-neutral-gray" />
        </button>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow hover:bg-white transition-colors"
        >
          <EllipsisVertical className="w-5 h-5 text-neutral-gray" />
        </button>
      </div>

      {/* Menu Drawer */}
      <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Menu</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4 min-h-[130px]">
              <div
                className="flex items-center justify-between py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsEditDrawerOpen(true) // Open edit drawer
                }}
              >
                <div className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Pet
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
              <div
                className="flex items-center justify-between py-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsDeleteDialogOpen(true)
                }}
              >
                <div className="flex items-center text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Pet
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Edit Pet Drawer */}
      <Drawer open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            {' '}
            {/* Adjusted max-w for form */}
            <DrawerHeader>
              <DrawerTitle>Edit {pet.name}</DrawerTitle>
            </DrawerHeader>
            <EditPetProfileForm
              pet={pet}
              onClose={() => setIsEditDrawerOpen(false)}
              onSuccess={() => {
                // Changed to call without arguments
                onPetUpdate() // Call onPetUpdate without arguments
                setIsEditDrawerOpen(false)
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <ConfirmationModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title={`Delete ${pet.name}?`}
        message="This action cannot be undone. This will permanently delete your pet profile."
        titleClassName="text-red-600"
        confirmButtonClassName="bg-red-600 hover:bg-red-700"
      />

      <div className="px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-deep-teal">{pet.name}</h2>
            <p className="text-neutral-gray capitalize">{pet.petBreedName}</p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center border-t border-b py-4">
            {' '}
            {/* Changed to grid-cols-4 */}
            <StatItem
              label="Age"
              value={
                <>
                  <span className="block">{`${age} yrs`}</span>
                  <span className="block text-xs text-neutral-gray">
                    (Born {formattedBirthDate})
                  </span>
                </>
              }
            />
            <StatItem
              label="Sex"
              value={
                pet.sex === 'male' ? (
                  <Mars className="w-5 h-5 mx-auto text-blue-500" />
                ) : pet.sex === 'female' ? (
                  <Venus className="w-5 h-5 mx-auto text-pink-500" />
                ) : (
                  <span className="capitalize">{pet.sex}</span>
                )
              }
            />
            <StatItem
              label="Size" // New StatItem for Size
              value={
                <div className="flex items-center justify-center gap-1">
                  <Scale className="w-4 h-4 text-gray-500" />{' '}
                  {/* Changed Rss to Scale */}
                  <span className="font-semibold capitalize">
                    {pet.petSizeName}
                  </span>
                </div>
              }
            />
            <StatItem
              label="Energy Level"
              value={
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{pet.rating}</span>
                </div>
              }
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-deep-teal uppercase tracking-wide">
              Owner Contact
            </h4>
            <div className="flex justify-between items-center text-gray-800">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                <span>{pet.contactName}</span>
              </div>
              <a href={`tel:${pet.contactPhone}`}>
                <Button
                  size="sm"
                  className="bg-positive-green hover:bg-positive-green/90"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
              </a>
            </div>
          </div>

          {pet.note && (
            <div className="space-y-2 border-t pt-6">
              <h4 className="text-sm font-semibold text-deep-teal uppercase tracking-wide">
                A Little Bit About {pet.name}
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {pet.note}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const StatItem = ({
  label,
  value,
}: {
  label: string
  value?: string | number | React.ReactNode
}) => (
  <div>
    <p className="text-xs text-neutral-gray">{label}</p>
    <div className="font-semibold text-lg capitalize mt-1">{value}</div>
  </div>
)
