import { UserProfile } from './user'

export interface ProfileResponse {
  code: number
  data: UserProfile
  message: string
}
