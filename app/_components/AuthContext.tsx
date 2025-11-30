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
    refreshAuth() // Trigger user reload
  }

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
    if (
      typeof window !== 'undefined' &&
      window.location.pathname !== '/authen'
    ) {
      // Hard reload เพื่อ remount component
      window.location.href = '/authen'
    }
  }, [])

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)
      try {
        let token = getAccessToken()
        if (!token) {
          // ถ้า access token ไม่มี ให้ลอง refresh
          token = await refreshAccessToken()
        }

        if (!token) {
          // ถ้า refresh ไม่ได้ logout → reload หน้าใหม่
          logout()
          return
        }

        const profile = await getProfile()
        setUser(profile.data)
      } catch (e) {
        console.error('Failed to load user:', e)
        logout()
      } finally {
        setLoading(false)
      }
    }

    loadUser()
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
