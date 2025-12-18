'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useHostProperties } from './host/_hooks/useHostProperties'
import { Property } from '@/types'

interface HostPropertiesState {
  properties: Property[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface ProfileContextType {
  setMenu: (menu: ReactNode) => void
  menu: ReactNode | null
  hostProperties: HostPropertiesState
}

const ProfileContext = createContext<ProfileContextType>({
  setMenu: () => {},
  menu: null,
  hostProperties: {
    properties: [],
    loading: true,
    error: null,
    refetch: async () => {},
  },
})

export const useProfileContext = () => useContext(ProfileContext)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<ReactNode | null>(null)
  const hostProperties = useHostProperties()

  return (
    <ProfileContext.Provider value={{ menu, setMenu, hostProperties }}>
      {children}
    </ProfileContext.Provider>
  )
}
