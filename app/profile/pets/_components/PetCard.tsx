'use client'

import { PetProfile } from '@/types'
import { Card } from '@/components/ui/card'
import { Cake, PawPrint } from 'lucide-react'
import { useRouter } from 'next/router'

interface PetCardProps {
  pet: PetProfile
  onClick?: (petId: number) => void
}

export function PetCard({ pet, onClick }: PetCardProps) {
  const router = useRouter()
  const guestPetImageSrc = `${router.basePath || ''}/graphics/guest.jpg`

  const handleCardClick = () => {
    if (onClick) {
      onClick(pet.id)
    }
  }

  return (
    <div onClick={handleCardClick} className="cursor-pointer group">
      <Card className="rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300 aspect-square overflow-hidden relative">
        <img
          src={pet.image || guestPetImageSrc}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <h4 className="font-bold text-lg truncate">{pet.name}</h4>
          <div className="flex items-center gap-2 text-xs mt-1 opacity-90">
            {pet.petTypeName && (
              <div className="flex items-center gap-1">
                <PawPrint className="w-3 h-3" />
                <span>{pet.petTypeName}</span>
              </div>
            )}
            {pet.petTypeName && pet.age !== undefined && (
              <span className="opacity-70">•</span>
            )}
            {pet.age !== undefined && (
              <div className="flex items-center gap-1">
                <Cake className="w-3 h-3" />
                <span>
                  {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
