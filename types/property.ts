import { Facility } from './api'
import { Pet } from './pet'

export interface PropertyImage {
  id: number
  fileName: string
  filePath: string
  fileContentType: string
  fileExtensionName: string
  fileSize: number
}

export interface RoomCategories {
  id: number
  name: string
  totalRoom: number
  numberOfPets: number
  basePrice: number
  propertyId: number
  isAvailable: boolean
  isCapacityInsufficient: boolean
  isBooked: boolean
  availability: {
    roomsNeeded: number
    availableRooms: number
    totalPrice: number
    dates: {
      date: string
      availableRooms: number
      priceAdjustment: number
      finalPrice: number
    }[]
  }
  pets: {
    id: number
    name: string
  }[]
  facilities: {
    id: number
    name: string
  }[]
}

export interface PropertyType {
  id: number
  name: string
}

export interface Property {
  id: number
  title: string
  description: string
  province: string
  district: string
  country: string
  latitude: string
  longitude: string
  zipcode: string
  isActive: boolean
  avgRating: number
  hostId: number
  propertyTypeId: number
  images: PropertyImage[]
  roomCategories?: RoomCategories | RoomCategories[]
  createdAt: string
  updatedAt: string
  reviewCount?: number
  propertyType?: PropertyType
  facilities?: Facility[]
  totalRoomCategories?: number
  pets?: Pet[]
}

export interface PropertiesResponse {
  totalRows: number
  totalPages: number
  data: Property[]
  limit: number
  page: number
  orderBy: string
  sort: string
}

export interface HostPropertiesResponse {
  properties: Property[]
}

export interface RoomCategoriesResponse {
  roomCategories: RoomCategories[]
}
