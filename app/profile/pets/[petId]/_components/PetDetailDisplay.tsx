'use client'

import { PetProfile } from '@/types'
import { Button } from '@/components/ui/button'
import { Phone, User, Star, Mars, Venus, Zap, Rss } from 'lucide-react' // Added Rss for size, removed Cake
import { differenceInYears, format } from 'date-fns' // Import format

interface PetDetailDisplayProps {
  pet: PetProfile
}

export default function PetDetailDisplay({ pet }: PetDetailDisplayProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const guestPetImageSrc = `${basePath}/graphics/guest.jpg`
  const age = differenceInYears(new Date(), new Date(pet.birthDate))
  const formattedBirthDate = format(new Date(pet.birthDate), 'MMM d, yyyy') // Format birthDate

  return (
    <div className="pb-10 bg-gray-50 min-h-screen">
      <div className="relative w-full aspect-square">
        <img
          src={pet.image || guestPetImageSrc}
          alt={pet.name}
          className="object-cover w-full h-full rounded-b-2xl"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-deep-teal">{pet.name}</h2>
            <p className="text-neutral-gray capitalize">{pet.petBreedName}</p>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center border-t border-b py-4"> {/* Changed to grid-cols-4 */}
            <StatItem
              label="Age"
              value={
                <>
                  <span className="block">{`${age} yrs`}</span>
                  <span className="block text-xs text-neutral-gray">(Born {formattedBirthDate})</span>
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
                  <Rss className="w-4 h-4 text-gray-500" /> {/* Using Rss icon for size, can be changed */}
                  <span className="font-semibold capitalize">{pet.petSizeName}</span>
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
