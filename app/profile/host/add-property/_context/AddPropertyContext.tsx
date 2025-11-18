'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { PropertyFormData } from '@/types'
import { useAuth } from '@/app/_components/AuthContext'

interface AddPropertyContextType {
  formData: PropertyFormData
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>
  updateField: (field: keyof PropertyFormData, value: any) => void
}

const AddPropertyContext = createContext<AddPropertyContextType | undefined>(undefined)

export const AddPropertyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState<PropertyFormData>({
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

  useEffect(() => {
    if (user) {
      updateField('hostId', user.id)
    }
  }, [user])

  const updateField = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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
