'use client'

import { PetProfile } from '@/types'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Cake, PawPrint } from 'lucide-react'

interface PetCardProps {
  pet: PetProfile
  onClick?: (petId: number) => void
}

export function PetCard({ pet, onClick }: PetCardProps) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(pet.id)
    }
    // else, maybe navigate to a detail page in the future
  }

  return (
    <div onClick={handleCardClick} className="cursor-pointer group">
      <Card className="rounded-xl border border-gray-100 shadow-sm group-hover:shadow-lg group-hover:border-deep-teal/20 transition-all duration-300 p-4 bg-white/70 backdrop-blur-sm aspect-square flex flex-col items-center justify-between text-center">
        <div className="flex-grow flex items-center justify-center">
          <Avatar className="w-24 h-24 border-2 border-white shadow-md">
            <AvatarImage
              src={pet.image || '/graphics/guest.jpg'}
              alt={pet.name}
            />
            <AvatarFallback className="text-3xl">
              {pet.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="w-full">
          <h4 className="font-bold text-deep-teal text-lg truncate">
            {pet.name}
          </h4>
          <div className="flex justify-center items-center gap-2 text-xs text-neutral-gray mt-1">
            <div className="flex items-center gap-1">
              <PawPrint className="w-3 h-3" />
              <span>{pet.petTypeName}</span>
            </div>
            <span className="opacity-50">•</span>
            <div className="flex items-center gap-1">
              <Cake className="w-3 h-3" />
              <span>
                {pet.age} {pet.age === 1 ? 'yr' : 'yrs'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
