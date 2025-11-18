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
