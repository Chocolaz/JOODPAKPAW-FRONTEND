'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { refreshToken as callRefreshTokenApi } from './fetchAuthen' // Alias to avoid name collision

// --- Token Management ---
export const saveTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }
}

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

export const getAccessToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken')
  }
  return null
}

export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null
}

export const refreshAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') {
    return null
  }

  const currentRefreshToken = localStorage.getItem('refreshToken')
  if (!currentRefreshToken) {
    console.error('No refresh token found in local storage.')
    clearTokens() // Clear any stale tokens
    return null
  }

  try {
    const newAccessToken = await callRefreshTokenApi(currentRefreshToken)
    saveTokens(newAccessToken, currentRefreshToken) // Save new access token, keep old refresh token
    return newAccessToken
  } catch (error) {
    console.error('Failed to refresh access token:', error)
    clearTokens() // Clear tokens on refresh failure
    return null
  }
}

// --- Custom Hooks ---

/**
 * Redirects to a specified path if the user is authenticated.
 * @param redirectPath - The path to redirect to if authenticated.
 */
export const useAuthRedirect = (redirectPath: string = '/') => {
  const router = useRouter()
  const [isAuthent, setIsAuthent] = useState<boolean | null>(null)

  useEffect(() => {
    const authenticated = isAuthenticated()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAuthent(authenticated)
    if (authenticated) {
      router.push(redirectPath)
    }
  }, [router, redirectPath])

  return isAuthent
}

/**
 * Manages a cooldown timer.
 * @param initialCooldown - The initial cooldown time in seconds.
 */
export const useCooldown = (initialCooldown: number = 0) => {
  const [cooldown, setCooldown] = useState(initialCooldown)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => {
      setCooldown(cooldown - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  return { cooldown, startCooldown: (time: number) => setCooldown(time) }
}

/**
 * Retrieves the email from the 'email' query parameter.
 * Redirects to a fallback path if the email is not found.
 * @param fallbackPath - The path to redirect to if email is not found.
 */
export const useEmailFromQuery = (fallbackPath: string) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')

  useEffect(() => {
    const emailFromQuery = searchParams.get('email')
    if (emailFromQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEmail(emailFromQuery)
    } else {
      console.error('Email not found in query parameters')
      router.push(fallbackPath)
    }
  }, [searchParams, router, fallbackPath])

  return email
}
