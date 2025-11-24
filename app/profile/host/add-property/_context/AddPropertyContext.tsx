'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'
import { PropertyFormData } from '@/types'
import { useAuth } from '@/app/_components/AuthContext'

interface AddPropertyContextType {
  formData: PropertyFormData
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
  updateField: <K extends keyof PropertyFormData>(field: K, value: PropertyFormData[K]) => void
}

const AddPropertyContext = createContext<AddPropertyContextType | undefined>(undefined)

export const AddPropertyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyId: undefined,
    propertyTypeId: null,
    latitude: '',
    longitude: '',
    country: '',
    province: '',
    district: '',
    subdistrict: '',
    address: '',
    zipcode: '',
    title: '',
    description: '',
    facilities: [],
    images: [],
    hostId: 0,
  })

  const updateField = useCallback(<K extends keyof PropertyFormData>(field: K, value: PropertyFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prevFormData => {
        if (prevFormData.hostId !== user.id) {
          return { ...prevFormData, hostId: user.id };
        }
        return prevFormData;
      });
    }
  }, [user]);

  return (
    <AddPropertyContext.Provider value={{ formData, setFormData, updateField }}>
      {children}
    </AddPropertyContext.Provider>
  )
}

export const useAddProperty = () => {
  const context = useContext(AddPropertyContext)
  if (context === undefined) {
    throw new Error('useAddProperty must be used within an AddPropertyProvider')
  }
  return context
}
