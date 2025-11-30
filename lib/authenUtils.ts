'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { refreshToken as callRefreshTokenApi } from './authApi' // Alias to avoid name collision
import {
  saveTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
} from './tokenManager'
import { ApiError } from './errorHandling'

export {
  saveTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
}

// --- Refresh access token function ---
export const refreshAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null

  const currentRefreshToken = getRefreshToken()
  if (!currentRefreshToken) {
    console.warn('No refresh token found in cookies.')
    clearTokens()
    return null
  }

  try {
    const newAccessToken = await callRefreshTokenApi(currentRefreshToken)
    saveTokens(newAccessToken, currentRefreshToken) // Keep old refresh token
    return newAccessToken
  } catch (error) {
    console.error('Failed to refresh access token:', error)
    clearTokens()
    return null
  }
}

// --- Custom Hooks ---
export const useAuthRedirect = (redirectPath: string = '/') => {
  const router = useRouter()
  const [isAuthent, setIsAuthent] = useState<boolean | null>(null)

  useEffect(() => {
    const authenticated = isAuthenticated()
    setIsAuthent(authenticated)
    if (authenticated) router.push(redirectPath)
  }, [router, redirectPath])

  return isAuthent
}

export const useCooldown = (initialCooldown: number = 0) => {
  const [cooldown, setCooldown] = useState(initialCooldown)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  return { cooldown, startCooldown: (time: number) => setCooldown(time) }
}

export const useEmailFromQuery = (fallbackPath: string) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const emailFromQuery = searchParams.get('email')
    if (emailFromQuery) setEmail(emailFromQuery)
    else {
      console.error('Email not found in query parameters')
      router.push(fallbackPath)
    }
  }, [searchParams, router, fallbackPath])

  return email
}
