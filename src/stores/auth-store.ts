import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { User } from '@/types'

// Local storage keys
const ACCESS_TOKEN_KEY = 'ai_story_access_token'
const REFRESH_TOKEN_KEY = 'ai_story_refresh_token'
const USER_KEY = 'ai_story_user'

// Helper function to clean token (remove quotes if present)
const cleanToken = (token: string | null): string | null => {
  if (!token) return null
  
  // Remove quotes if present
  let cleanedToken = token.trim()
  if (cleanedToken.startsWith('"') && cleanedToken.endsWith('"')) {
    cleanedToken = cleanedToken.slice(1, -1)
  }
  if (cleanedToken.startsWith("'") && cleanedToken.endsWith("'")) {
    cleanedToken = cleanedToken.slice(1, -1)
  }
  
  return cleanedToken
}

// Atoms with localStorage persistence
export const accessTokenAtom = atomWithStorage<string | null>(ACCESS_TOKEN_KEY, null)
export const refreshTokenAtom = atomWithStorage<string | null>(REFRESH_TOKEN_KEY, null)
export const userAtom = atomWithStorage<User | null>(USER_KEY, null)

// Derived atoms
export const isAuthenticatedAtom = atom((get) => {
  const accessToken = get(accessTokenAtom)
  return !!accessToken
})

export const userRoleAtom = atom((get) => {
  const user = get(userAtom)
  return user?.role || null
})

// Auth actions atom
export const authActionsAtom = atom(
  null,
  (get, set, action: 'login' | 'logout' | 'updateTokens' | 'clearAuth', payload?: any) => {
    switch (action) {
      case 'login':
        const { accessToken, refreshToken, user } = payload
        set(accessTokenAtom, cleanToken(accessToken))
        set(refreshTokenAtom, cleanToken(refreshToken))
        set(userAtom, user)
        break

      case 'logout':
        set(accessTokenAtom, null)
        set(refreshTokenAtom, null)
        set(userAtom, null)
        break

      case 'updateTokens':
        const { newAccessToken, newRefreshToken } = payload
        set(accessTokenAtom, cleanToken(newAccessToken))
        if (newRefreshToken) {
          set(refreshTokenAtom, cleanToken(newRefreshToken))
        }
        break

      case 'clearAuth':
        set(accessTokenAtom, null)
        set(refreshTokenAtom, null)
        set(userAtom, null)
        break
    }
  }
)

// Helper functions
export const getStoredRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem(REFRESH_TOKEN_KEY)
  return cleanToken(token)
}

export const clearStoredTokens = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const setStoredTokens = (accessToken: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(ACCESS_TOKEN_KEY, cleanToken(accessToken)!)
  localStorage.setItem(REFRESH_TOKEN_KEY, cleanToken(refreshToken)!)
}

// Enhanced getStoredAccessToken with automatic refresh
export const getStoredAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null
  
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  const cleanedToken = cleanToken(accessToken)
  if (!cleanedToken) return null

  try {
    // Check if token is expired by decoding it
    const payload = JSON.parse(atob(cleanedToken.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    
    // If token is expired or will expire in the next 5 minutes
    if (payload.exp && payload.exp <= currentTime + 300) {
      const refreshToken = getStoredRefreshToken()
      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const response = await fetch('http://localhost:3001/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          })

          if (response.ok) {
            const data = await response.json()
            // Update stored tokens
            setStoredTokens(data.accessToken, data.refreshToken)
            return cleanToken(data.accessToken)
          } else {
            // Refresh failed, clear tokens
            clearStoredTokens()
            return null
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
          clearStoredTokens()
          return null
        }
      } else {
        // No refresh token available
        clearStoredTokens()
        return null
      }
    }
    
    return cleanedToken
  } catch (error) {
    console.error('Error parsing token:', error)
    clearStoredTokens()
    return null
  }
}

// Synchronous version for immediate access (use with caution)
export const getStoredAccessTokenSync = (): string | null => {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  return cleanToken(token)
} 