export interface Role {
  id: number
  name: string
}

export interface User {
  email: string
  firstName: string
  id: number
  lastName: string
  role: Role[]
}

export interface UserProfile {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar: string
  phone: string
  isBecomeToHost: boolean
}
