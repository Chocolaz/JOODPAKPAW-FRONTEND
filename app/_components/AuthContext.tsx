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
  refreshAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const refreshAuth = useCallback(async () => {
    setLoading(true)
    try {
      const profile = await getProfile()
      setUser(profile.data)
    } catch (e) {
      console.error('Failed to refresh auth:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (accessToken: string, refreshToken: string) => {
    saveTokens(accessToken, refreshToken)
    refreshAuth()
  }

  const logout = useCallback(() => {
    clearTokens()
    setUser(null)
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
  }, [refreshTrigger, logout])

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
