import { apiClient } from '@/utils/api'
import { getStoredAccessToken, getStoredRefreshToken, clearStoredTokens, setStoredTokens } from '@/stores/auth-store'
import type { LoginCredentials, RegisterData, User } from '@/types'

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
  user: User
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface RegisterResponse {
  message: string
  user: User
}

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

class AuthService {
  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials)
      
      // Store tokens in localStorage (cleaned)
      const cleanedAccessToken = cleanToken(response.accessToken)
      const cleanedRefreshToken = cleanToken(response.refreshToken)
      
      localStorage.setItem('ai_story_access_token', cleanedAccessToken!)
      localStorage.setItem('ai_story_refresh_token', cleanedRefreshToken!)
      
      return {
        ...response,
        accessToken: cleanedAccessToken!,
        refreshToken: cleanedRefreshToken!
      }
    } catch (error) {
      throw error
    }
  }

  // Register user
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', userData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens regardless of API call success
      clearStoredTokens()
    }
  }

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/auth/profile')
      return response
    } catch (error) {
      throw error
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    return !!token
  }

  // Get access token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    const token = localStorage.getItem('ai_story_access_token')
    return cleanToken(token)
  }

  // Get refresh token
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    const token = localStorage.getItem('ai_story_refresh_token')
    return cleanToken(token)
  }

  // Refresh access token
  async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const refreshToken = getStoredRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken,
      })

      // Update access token in localStorage (cleaned)
      const cleanedAccessToken = cleanToken(response.accessToken)
      localStorage.setItem('ai_story_access_token', cleanedAccessToken!)

      return {
        ...response,
        accessToken: cleanedAccessToken!
      }
    } catch (error) {
      // Clear tokens on refresh failure
      clearStoredTokens()
      throw error
    }
  }
}

export default new AuthService() 