'use client'

import React, { useState, useEffect } from 'react'
import { Dog, Cat } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  createRoomCategory,
  getPetTypes,
  getPetSizeCategories,
} from '@/lib/api'
import { useFacilities } from '../add-property/_hooks/useFacilities'
import { RoomCategoryFormData, Pet, PetSizeCategory } from '@/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FacilityCard } from './FacilityCard'

const initialRoomState: RoomCategoryFormData = {
  name: '',
  basePrice: 0,
  totalRoom: 1,
  numberOfPets: 1,
  pets: [],
  facilities: [],
  petSizeCategoryId: 1,
}

export function AddRoomCategoryForm({
  propertyId,
  onAddSuccess,
}: {
  propertyId: number
  onAddSuccess: () => void
}) {
  const { facilities: allFacilities, loading: facilitiesLoading } =
    useFacilities()
  const [roomData, setRoomData] =
    useState<RoomCategoryFormData>(initialRoomState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [petTypes, setPetTypes] = useState<Pet[]>([])
  const [petSizeCategories, setPetSizeCategories] = useState<PetSizeCategory[]>(
    []
  )
  const [loadingPetData, setLoadingPetData] = useState(true)

  useEffect(() => {
    async function loadPets() {
      try {
        setLoadingPetData(true)
        const [petRes, sizeRes] = await Promise.all([
          getPetTypes(),
          getPetSizeCategories(),
        ])
        setPetTypes(petRes.pets)
        setPetSizeCategories(sizeRes.petSizeCategories)

        if (sizeRes.petSizeCategories.length > 0) {
          setRoomData((prev) => ({
            ...prev,
            petSizeCategoryId: sizeRes.petSizeCategories[0].id,
          }))
        }
      } catch (err) {
        toast.error('Failed to load pet data')
      } finally {
        setLoadingPetData(false)
      }
    }
    loadPets()
  }, [])

  const roomFacilities = allFacilities.filter(
    (f) => f.category.name === 'indoor'
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setRoomData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const toggleMulti = (key: 'pets' | 'facilities', id: number) => {
    setRoomData((prev) => ({
      ...prev,
      [key]: prev[key].includes(id)
        ? prev[key].filter((v) => v !== id)
        : [...prev[key], id],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createRoomCategory(propertyId, roomData)
      toast.success('Room category added!')
      onAddSuccess()
    } catch (err) {
      toast.error('Failed to add room category.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className="py-4 px-10 space-y-8 overflow-y-auto max-h-[80vh]"
      onSubmit={handleSubmit}
    >
      {/* 1. Title */}
      <div className="space-y-1">
        <Label htmlFor="name" className="text-deep-teal">
          Title
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Room name"
          value={roomData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* 2. Species Allowed */}
      <div className="space-y-2">
        <Label className="text-deep-teal">Species Allowed</Label>
        {loadingPetData ? (
          <Spinner />
        ) : (
          <div className="flex justify-center items-center gap-6">
            {petTypes.map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => toggleMulti('pets', pet.id)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-xl border shadow-sm transition aspect-square w-24 h-24 space-y-2',
                  roomData.pets.includes(pet.id)
                    ? 'border-positive-green'
                    : 'bg-white hover:border-deep-teal/40'
                )}
              >
                {pet.name.toLowerCase() === 'dog' ? (
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-full w-10 h-10',
                      roomData.pets.includes(pet.id)
                        ? 'bg-teal-50'
                        : 'bg-[#EFF1F4]'
                    )}
                  >
                    <Dog
                      className={cn(
                        'h-7 w-7',
                        roomData.pets.includes(pet.id)
                          ? 'text-positive-green'
                          : ''
                      )}
                    />
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-full w-10 h-10',
                      roomData.pets.includes(pet.id)
                        ? 'bg-teal-50'
                        : 'bg-[#EFF1F4]'
                    )}
                  >
                    <Cat
                      className={cn(
                        'h-7 w-7',
                        roomData.pets.includes(pet.id)
                          ? 'text-positive-green'
                          : ''
                      )}
                    />
                  </div>
                )}
                <span className="font-medium text-sm">{pet.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Size */}
      <div className="space-y-2">
        <Label className="text-deep-teal">Size</Label>
        <div className="flex justify-center items-center gap-6">
          {petSizeCategories.map((size) => {
            const description =
              size.max === 14
                ? 'under 14kg'
                : size.min === 14 && size.max === 25
                  ? '14-25kg'
                  : 'over 25kg'

            const getSizeIcon = (sizeName: string, isSelected: boolean) => {
              let svgContent = ''
              if (sizeName.toLowerCase() === 'small') {
                svgContent = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.674 12.297C14.2604 12.2596 14.4267 11.4334 14.4267 11.4334C14.4647 11.1069 14.4619 10.7954 14.3877 10.5219C14.6154 10.7881 14.5987 11.2883 14.5987 11.2883C14.6132 12.1139 15.0134 12.2462 15.0134 12.2462C14.7416 11.9821 14.7846 11.2721 14.7846 11.2721C14.7946 10.4125 14.415 10.1574 14.175 10.082C14.0237 9.88439 13.8004 9.72809 13.4845 9.62817C13.0161 9.4808 11.4426 9.68064 10.9603 9.68734C10.1235 9.6985 9.13435 9.77721 8.45501 9.17993C8.21554 8.96892 7.9956 8.54022 7.85214 8.25497C7.7779 8.10761 7.72878 7.95912 7.60932 7.8391C7.49377 7.72244 7.34696 7.63982 7.19457 7.58065C6.959 7.48966 6.69441 7.47348 6.45103 7.54326C6.34218 7.57452 6.23166 7.63089 6.17025 7.72802C6.10215 7.83631 6.04019 7.93791 5.94585 8.0261C5.84482 8.12044 5.463 8.24939 5.33182 8.28511C5.29721 8.2946 5.26037 8.30465 5.22576 8.31749C5.20845 8.3108 5.18836 8.30856 5.16659 8.31191C5.13254 8.31693 5.0957 8.33089 5.06499 8.3454C5.04825 8.35322 5.0315 8.36327 5.01978 8.37834C4.98741 8.41964 5.00136 8.47937 5.01532 8.52515C5.02369 8.55082 5.03485 8.57985 5.05216 8.60274C5.06165 8.65019 5.07895 8.69707 5.09626 8.73392C5.26707 9.09731 6.03405 8.9678 6.35893 8.9611C6.48118 8.95831 6.60566 8.95608 6.72456 8.98455C6.72233 9.14476 6.75637 9.29827 6.86578 9.39261C6.86299 9.38982 6.8602 9.38758 6.85741 9.38479C6.86244 9.38702 6.86746 9.38926 6.87248 9.39149C7.33412 9.58184 7.36706 8.80648 7.51219 8.57092C7.54736 8.51342 7.60653 8.47212 7.61714 8.40123C7.63165 8.30354 7.60876 8.2025 7.56634 8.1143C7.48819 7.95187 7.35366 7.79557 7.20629 7.68951C7.23253 7.70402 7.25709 7.72244 7.28053 7.73863C7.43404 7.84469 7.57583 8.00601 7.65677 8.17459C7.69919 8.26279 7.72264 8.36382 7.70757 8.46151C7.69696 8.5324 7.63835 8.57371 7.60262 8.63121C7.47479 8.83942 7.43404 9.46852 7.10805 9.48136C7.17336 9.83973 7.11083 10.2997 7.15158 10.5615C7.15158 10.5615 7.11866 11.4669 7.98109 11.9369C7.68468 12.6598 7.24983 12.7921 7.24983 12.7921C7.07344 12.8903 7.12758 13.0394 7.12758 13.0394H7.59537C7.92024 12.7519 8.1586 12.4734 8.3255 12.2467C8.22837 12.8089 7.92359 12.7915 7.92359 12.7915C7.7472 12.8898 7.80134 13.0388 7.80134 13.0388H8.26912C8.61968 12.7285 8.79161 12.4287 8.87423 12.1931C9.30349 12.2372 9.83881 12.2077 10.5081 12.0659C10.9815 11.9654 11.4816 11.8995 11.8874 11.8577C12.3033 12.7067 13.2595 12.5052 13.2595 12.5052C13.7094 12.6112 13.7094 12.7915 13.7094 12.7915C13.533 12.8898 13.5872 13.0388 13.5872 13.0388H14.055C14.1086 12.8049 14.0728 12.6375 14.0125 12.5208C14.0896 12.5147 14.1359 12.5046 14.1359 12.5046C14.5858 12.6107 14.5858 12.791 14.5858 12.791C14.4094 12.8892 14.4636 13.0383 14.4636 13.0383H14.9314C15.0603 12.4789 14.6735 12.2964 14.6735 12.2964L14.674 12.297Z" fill="${isSelected ? '#4CAF50' : '#808B9A'}"/>
</svg>`
              } else if (sizeName.toLowerCase() === 'medium') {
                svgContent = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.8906 10.0568L16.4762 10.074C16.4762 10.074 17.0723 9.6367 17.25 8.63086L16.9711 8.89074C16.9711 8.89074 17.1065 7.33077 16.3669 6.35518V6.80619C16.3669 6.80619 16.1637 6.10424 15.1117 5.66629L15.5006 6.30774C15.5006 6.30774 14.6135 5.25035 12.9902 5.6051L13.5903 5.75292C13.5903 5.75292 12.3009 5.90417 12.0005 6.84469L12.3384 6.6625C12.3384 6.6625 12.0085 7.33833 12.1017 7.92822C12.1017 7.92822 12.5161 7.34727 13.3234 7.42977L12.905 7.65047C12.905 7.65047 14.0503 7.32596 14.6336 7.83747L14.3419 7.91997C14.3419 7.91997 15.0775 8.08497 14.8998 8.75186L14.5914 8.52224C14.5914 8.52224 14.8817 9.05506 14.358 9.42769C13.3998 8.76355 12.1232 8.79449 12.1232 8.79449L9.59997 8.60474C8.87178 8.55042 8.35749 8.07329 8.06045 7.41808C8.01284 7.31289 7.96993 7.20633 7.92702 7.09908C7.88947 7.00557 7.85191 6.91276 7.81436 6.81926C7.75871 6.68107 7.71312 6.54012 7.65813 6.40193C7.49318 5.99286 7.2699 5.57967 6.9286 5.32185C6.83942 4.97671 6.70197 4.56627 6.48941 4.14688C6.48941 4.14688 6.33787 3.84644 6.2735 4.10494C6.22656 4.29195 6.14074 4.5752 6.14342 5.02759C5.80145 4.99046 5.44406 5.04753 5.15104 5.20497C4.88685 5.34729 4.72928 5.58654 4.49795 5.76805C4.36585 5.87117 4.17475 5.89042 4.01785 5.87599C3.90922 5.86636 3.77312 5.84849 3.64773 5.86292C3.63365 5.8533 3.61822 5.84573 3.60011 5.84092C3.55385 5.82717 3.49954 5.82305 3.45193 5.82373C3.42578 5.82373 3.39896 5.82717 3.37549 5.83955C3.31045 5.87392 3.29302 5.95986 3.28497 6.02792C3.27961 6.0733 3.27759 6.12761 3.29235 6.17437C3.24407 6.34556 3.24675 6.55731 3.25413 6.69413C3.26486 6.89488 3.32922 7.09976 3.46668 7.24276C3.58872 7.36927 3.75568 7.43802 3.92063 7.49233C4.14525 7.56659 4.37658 7.6209 4.59115 7.72197C4.93513 7.88284 5.16445 8.19085 5.2543 8.56417C5.34549 8.94643 5.29722 10.492 5.27844 10.8811L5.46954 10.6322C5.46954 10.6322 5.41724 11.176 5.49569 11.559L5.54799 11.394C6.45857 14.6377 5.32806 16.2534 5.32806 16.2534C4.81645 16.4864 4.94921 16.9553 4.94921 16.9553H5.8276C6.35798 16.562 6.62016 15.2221 6.62016 15.2221L6.78109 15.4338L6.64162 14.8109L6.86088 15.2461C6.9058 14.7408 6.70934 14.2114 6.70934 14.2114L7.04393 14.9402C7.04259 14.4933 6.66173 13.506 6.66173 13.506L6.88301 13.8415C7.32288 15.5899 6.93062 16.2534 6.93062 16.2534C6.41833 16.4864 6.55042 16.9553 6.55042 16.9553H7.36176C7.89281 16.562 8.15767 15.2221 8.15767 15.2221L8.31793 15.4338L8.18048 14.8109L8.3984 15.2461C8.44399 14.7408 8.24954 14.2114 8.24954 14.2114L8.58212 14.9402C8.58212 14.4933 8.20394 13.506 8.20394 13.506L8.58212 14.0822C8.5781 13.9234 8.51574 13.7061 8.43796 13.4944C8.83356 13.5562 9.37938 13.5755 10.0331 13.4297L9.57249 13.3245L10.3932 13.2386C10.8713 15.0165 12.4725 15.0399 12.4725 15.0399C13.1558 15.1671 13.3107 16.3895 13.3107 16.3895C13.0418 16.6975 13.0606 16.9945 13.0606 16.9945C13.0606 16.9945 13.0612 16.9966 13.0632 17L13.9933 16.9945C14.3902 16.0643 13.9959 15.2977 13.7083 14.9065C14.0623 15.0358 14.3352 15.0399 14.3352 15.0399C15.0185 15.1671 15.1734 16.3895 15.1734 16.3895C14.9045 16.6975 14.9233 16.9945 14.9233 16.9945C14.9233 16.9945 14.9239 16.9966 14.926 17L15.856 16.9945C16.4353 15.6367 15.3283 14.6267 15.3283 14.6267C14.8314 14.3084 15.111 13.9901 15.111 13.9901C15.4952 13.3073 15.4993 12.8625 15.4885 12.7285L15.5764 13.4813C15.9177 12.9718 15.7313 12.0492 15.7313 12.0492C16.0726 12.5586 15.9793 12.877 15.9793 12.877C16.444 11.4401 15.288 10.7243 15.288 10.7243C15.2606 10.6267 15.2284 10.5339 15.1915 10.4459C15.4765 10.4693 16.2261 10.4817 16.8906 10.0602V10.0568Z" fill="${isSelected ? '#4CAF50' : '#808B9A'}"/>
</svg>`
              } else if (sizeName.toLowerCase() === 'large') {
                svgContent = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.2322 8.67522C17.0596 7.89762 16.6621 7.23273 16.1872 6.90057C15.5904 6.4829 14.8542 6.30702 14.1278 6.24984C13.4014 6.19267 12.6717 6.24549 11.9431 6.24167C10.4239 6.23351 8.60455 6.4083 7.21761 5.64704C6.74495 5.38784 6.32674 5.06438 6.07462 4.5841C5.78384 4.0303 5.3188 3.52225 4.70838 3.38285C4.48403 3.33166 4.25205 3.3322 4.02226 3.33329C3.76251 3.33438 3.50168 3.33602 3.24466 3.37413C3.09055 3.397 2.93645 3.43403 2.80031 3.50918C2.57814 3.63224 2.42131 3.84734 2.3026 4.07223C2.15449 4.35212 1.76569 4.3151 1.45694 4.33361C1.45095 4.33252 1.4455 4.33143 1.43951 4.33034C1.34095 4.31455 1.22714 4.32 1.12858 4.33252C1.07467 4.3396 1.02022 4.35321 0.97502 4.38425C0.848687 4.46975 0.833984 4.64781 0.833984 4.78612C0.833984 4.92444 0.853588 5.1025 0.974475 5.19235C0.949427 5.63234 0.971753 6.06143 1.13511 6.48236C1.19991 6.65008 1.28595 6.82161 1.44006 6.91418C1.58599 7.00239 1.76623 7.00348 1.93613 7.01873C2.27157 7.04814 2.61789 7.1516 2.84932 7.3961C3.05026 7.60901 3.14011 7.89979 3.24193 8.17424C3.59752 9.13372 4.04622 10.3796 4.81674 11.0527C4.91094 11.1349 5.00678 11.2139 5.10534 11.2901C6.21185 14.0155 4.84342 15.5664 4.84342 15.5664C4.18181 15.8528 4.42467 16.4039 4.42467 16.4039H6.012C6.46016 15.8016 6.81683 14.9842 7.094 14.1587C7.19964 14.993 7.13811 15.5664 7.13811 15.5664C6.47649 15.8528 6.71936 16.4039 6.71936 16.4039H8.30669C9.10988 15.324 9.04563 13.5614 8.85939 12.3013C9.36908 12.2289 9.81506 12.0949 10.1532 11.9686C10.6438 14.1903 12.7093 14.2094 12.7093 14.2094C13.66 14.413 13.8583 15.5664 13.8583 15.5664C13.1966 15.8528 13.3638 16.4039 13.3638 16.4039H15.1848C15.3291 15.4509 15.1488 14.7092 14.9343 14.2077C14.9593 14.2094 14.9729 14.2094 14.9729 14.2094C15.9237 14.413 16.1219 15.5664 16.1219 15.5664C15.4603 15.8528 15.6275 16.4039 15.6275 16.4039H17.4484C17.7348 14.5078 16.7389 13.4497 16.7389 13.4497C15.866 12.5006 16.6065 11.5978 16.6065 11.5978C16.6256 11.5738 16.6447 11.5504 16.6626 11.5264C17.046 12.8518 18.0272 13.3631 18.0272 13.3631V13.0375C18.6246 13.9246 20.0007 13.8521 20.0007 13.8521C18.7733 12.5006 17.682 9.85578 17.2322 8.67304V8.67522ZM5.5829 4.82097C5.46964 5.14987 5.34331 5.46897 5.16688 5.77119C5.03728 5.99336 4.87936 6.25311 4.6463 6.38924C4.37675 6.54716 4.17473 6.34296 4.06146 6.10881C3.99449 5.97104 3.94384 5.82075 3.903 5.66882C3.93404 5.76302 3.96944 5.85505 4.01191 5.94163C4.12518 6.17524 4.3272 6.37944 4.59675 6.22207C4.82926 6.08594 4.98772 5.82619 5.11732 5.60402C5.29321 5.3018 5.42009 4.9827 5.53335 4.6538C5.57583 4.53019 5.59325 4.41638 5.58127 4.31183C5.65533 4.45885 5.64988 4.62821 5.58345 4.82097H5.5829Z" fill="${isSelected ? '#4CAF50' : '#808B9A'}"/>
</svg>`
              }
              return (
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full w-10 h-10',
                    isSelected ? 'bg-teal-50' : 'bg-[#EFF1F4]'
                  )}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              )
            }

            return (
              <button
                key={size.id}
                type="button"
                onClick={() =>
                  setRoomData((prev) => ({
                    ...prev,
                    petSizeCategoryId: size.id,
                  }))
                }
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-xl border shadow-sm transition w-[100px] h-[125px] space-y-1',
                  roomData.petSizeCategoryId === size.id
                    ? 'border-positive-green'
                    : 'bg-white hover:border-deep-teal/40'
                )}
              >
                {getSizeIcon(size.name, roomData.petSizeCategoryId === size.id)}
                <span className={cn("font-medium", roomData.petSizeCategoryId === size.id ? 'text-positive-green' : '')}>{size.name}</span>
                <p className="text-xs text-gray-500">{description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Room Facilities */}
      <div className="space-y-2">
        <Label className="text-deep-teal">Room Facilities</Label>
        {facilitiesLoading && <Spinner />}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {roomFacilities.map((f) => (
            <FacilityCard
              key={f.id}
              facility={f}
              selected={roomData.facilities.includes(f.id)}
              onToggle={(id) => toggleMulti('facilities', id)}
            />
          ))}
        </div>
      </div>

      {/* 5. Max pets allowed */}
      <div className="space-y-1">
        <Label className="text-deep-teal">Max pets allowed</Label>
        <Select
          value={String(roomData.numberOfPets)}
          onValueChange={(v) =>
            setRoomData((prev) => ({ ...prev, numberOfPets: Number(v) }))
          }
        >
          <SelectTrigger className="p-4 text-base">
            <SelectValue placeholder="Select number" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map((num) => (
              <SelectItem key={num} value={String(num)}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 6. Base price per night */}
      <div className="space-y-1 w-36">
        <label className="text-sm text-deep-teal">Base price per night</label>
        <div
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => {
            const el = e.currentTarget
            const onlyNumbers = el.textContent?.replace(/\D/g, '') || '0'
            el.textContent = onlyNumbers
            setRoomData((prev) => ({
              ...prev,
              basePrice: parseInt(onlyNumbers, 10),
            }))
          }}
          className="
      text-3xl font-semibold
      border-b border-gray-400
      focus:border-deep-teal
      focus:outline-none
      w-max
      min-w-[50px]
      pb-1
    "
        >
          {roomData.basePrice ? roomData.basePrice : '000'}
        </div>
      </div>
    </form>
  )
}
