import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RoomCategories } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLowestPrice(roomCategories: RoomCategories[]): number | null {
  if (!Array.isArray(roomCategories) || roomCategories.length === 0) {
    return null
  }
  return Math.min(...roomCategories.map((rc) => rc.basePrice))
}
