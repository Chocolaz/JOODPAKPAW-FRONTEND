import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RoomCategory } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLowestPrice(roomCategories: RoomCategory[]): number | null {
  if (!roomCategories || roomCategories.length === 0) {
    return null
  }

  return roomCategories.reduce((minPrice, category) => {
    return category.basePrice < minPrice ? category.basePrice : minPrice
  }, Infinity)
}
