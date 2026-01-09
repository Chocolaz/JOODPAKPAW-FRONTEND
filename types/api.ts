import { UserProfile } from './user'

export interface ProfileResponse {
  code: number
  data: UserProfile
  message: string
}

export interface Facility {
  id: number
  name: string
  category: {
    id: number
    name: string
  }
}

export interface FacilitiesResponse {
  facilities: Facility[]
}

export interface PropertyFormData {
  propertyId?: number
  propertyTypeId: number | null
  latitude: string
  longitude: string
  country: string
  province: string
  district: string
  subdistrict: string
  address: string
  zipcode: string
  title: string
  description: string
  facilities: number[]
  images: File[]
}

export interface CreatePropertyResponse {
  data: {
    id: number
  }
}

export interface RoomCategoryFormData {
  name: string
  totalRoom: number
  numberOfPets: number
  basePrice: number
  pets: number[]
  facilities: number[]
  petSizeCategoryId: number
}

export interface BookingOrderItem {
  roomCategoryId: number
  checkInDate: string
  checkOutDate: string
  roomsBooked: number
}

export interface BookingRequestBody {
  propertyId: number
  numberOfPets: number
  bookingOrders: BookingOrderItem[]
}

export interface BookingResponse {
  message: string
  data: {
    id: number
  }
}
