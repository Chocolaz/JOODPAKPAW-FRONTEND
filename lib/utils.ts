import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { RoomCategories } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLowestPrice(
  roomCategories: RoomCategories | RoomCategories[] | undefined
): number | null {
  if (!roomCategories) {
    return null
  }

  if (Array.isArray(roomCategories)) {
    if (roomCategories.length === 0) {
      return null
    }
    return Math.min(...roomCategories.map((rc) => rc.basePrice))
  }

  // It's a single object
  return roomCategories.basePrice
}

export function normalizeRoomCategories(
  roomCategories: RoomCategories | RoomCategories[] | undefined
): RoomCategories[] {
  if (Array.isArray(roomCategories)) {
    return roomCategories
  }
  if (roomCategories) {
    return [roomCategories]
  }
  return []
}

