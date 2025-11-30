'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { User } from '@/types'
import { getAccessToken, clearTokens, saveTokens } from '@/lib/tokenManager'
import { refreshAccessToken } from '@/lib/authenUtils'
import { getProfile } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string) => void
  logout: () => void
  loading: boolean
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshAuth = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1)
  }, [])

  const login = (accessToken: string, refreshToken: string) => {
    saveTokens(accessToken, refreshToken)
    refreshAuth() // Trigger a refresh to fetch user data
  }

  const logout = () => {
    clearTokens()
    setUser(null)
  }

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)
      try {
        const accessToken = getAccessToken()
        if (accessToken) {
          const profileResponse = await getProfile()
          setUser(profileResponse.data)
        } else {
          const newAccessToken = await refreshAccessToken()
          if (newAccessToken) {
            const profileResponse = await getProfile()
            setUser(profileResponse.data)
          } else {
            logout()
          }
        }
      } catch (e) {
        console.error('Failed to initialize auth:', e)
        logout()
      } finally {
        setLoading(false)
      }
    }
    initializeAuth()
  }, [refreshTrigger])

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading, refreshAuth }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
