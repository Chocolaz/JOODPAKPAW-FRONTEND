import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RoomCategory } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLowestPrice(roomCategories: any): number | null {
  if (!roomCategories) {
    return null
  }

  if (Array.isArray(roomCategories)) {
    if (roomCategories.length === 0) {
      return null
    }
    return roomCategories.reduce((minPrice, category) => {
      const price = category.basePrice
      return price < minPrice ? price : minPrice
    }, Infinity)
  }

  if (
    typeof roomCategories === 'object' &&
    !Array.isArray(roomCategories) &&
    roomCategories.basePrice !== undefined
  ) {
    return roomCategories.basePrice
  }

  return null
}
