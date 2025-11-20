'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ProfileContextType {
  setMenu: (menu: ReactNode) => void
  menu: ReactNode | null
}

const ProfileContext = createContext<ProfileContextType>({
  setMenu: () => {},
  menu: null,
})

export const useProfileContext = () => useContext(ProfileContext)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [menu, setMenu] = useState<ReactNode | null>(null)

  return (
    <ProfileContext.Provider value={{ menu, setMenu }}>
      {children}
    </ProfileContext.Provider>
  )
}
