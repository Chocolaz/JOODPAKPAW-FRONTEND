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
  hostId: number
}
