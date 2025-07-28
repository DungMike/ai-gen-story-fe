import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { toast } from 'sonner'
import { getStoredAccessToken, getStoredRefreshToken, clearStoredTokens } from '@/stores/auth-store'

// API Configuration
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001/api'

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

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStoredAccessToken()
      const cleanedToken = cleanToken(token)
      
      if (cleanedToken) {
        config.headers.Authorization = `Bearer ${cleanedToken}`
      }
      
      // Don't set Content-Type for FormData (let browser set it with boundary)
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type']
      }
      
      return config
    } catch (error) {
      console.error('Error getting access token:', error)
      return config
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = getStoredRefreshToken()
      if (refreshToken) {
        try {
          const cleanedRefreshToken = cleanToken(refreshToken)
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken: cleanedRefreshToken,
          })
          
          const { accessToken } = response.data
          const cleanedAccessToken = cleanToken(accessToken)
          
          // Update token in localStorage
          localStorage.setItem('ai_story_access_token', cleanedAccessToken!)
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${cleanedAccessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh token failed, logout user
          clearStoredTokens()
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      } else {
        // No refresh token, redirect to login
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    // Handle other errors
    const errorResponse = error.response?.data as { message?: string }
    const errorMessage = errorResponse?.message || error.message || 'An error occurred'
    
    // Don't show toast for 401 errors (handled above)
    if (error.response?.status !== 401) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

// API helper functions
export const apiClient = {
  // GET request
  get: async <T>(url: string, config = {}): Promise<T> => {
    const response = await api.get<T>(url, config)
    return response.data
  },

  // POST request
  post: async <T>(url: string, data = {}, config = {}): Promise<T> => {
    // log the curl command
    const token = await getStoredAccessToken()
    const cleanedToken = cleanToken(token)
    console.log(`curl -X POST ${API_BASE_URL}${url} -H "Authorization: Bearer ${cleanedToken}" -H "Content-Type: application/json" -d '${JSON.stringify(data)}'`)
    const response = await api.post<T>(url, data, config)
    return response.data
  },

  // PUT request
  put: async <T>(url: string, data = {}, config = {}): Promise<T> => {
    const response = await api.put<T>(url, data, config)
    return response.data
  },

  // PATCH request
  patch: async <T>(url: string, data = {}, config = {}): Promise<T> => {
    const response = await api.patch<T>(url, data, config)
    return response.data
  },

  // DELETE request
  delete: async <T>(url: string, config = {}): Promise<T> => {
    const response = await api.delete<T>(url, config)
    return response.data
  },

  // File upload
  upload: async <T>(url: string, formData: FormData, config = {}): Promise<T> => {
    const response = await api.post<T>(url, formData, {
      ...config,
      // Don't set Content-Type for FormData - let browser set it with boundary
    })
    return response.data
  },
}

// React Query configuration
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Global query options
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount: number, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      // Global mutation options
      retry: false,
      onError: (error: any) => {
        // Global error handling for mutations
        const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred'
        toast.error(errorMessage)
      },
    },
  },
}

// API endpoints for React Query
export const apiEndpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    logout: '/auth/logout',
    profile: '/auth/profile',
    changePassword: '/auth/change-password',
  },
  
  // Stories endpoints
  stories: {
    list: '/stories',
    detail: (id: string) => `/stories/${id}`,
    create: '/stories',
    generate: (id: string) => `/stories/${id}/generate`,
  },
  
  // File upload endpoints
  fileUpload: {
    upload: '/file-upload/upload',
  },
  
  // Users endpoints
  users: {
    list: '/users',
    detail: (id: string) => `/users/${id}`,
  },
  
  // Dashboard endpoints
  dashboard: {
    stats: '/dashboard/stats',
    charts: '/dashboard/charts',
  },
  
  // Batch processing endpoints
  batch: {
    start: '/batch/start',
    jobs: '/batch/jobs',
    jobDetail: (id: string) => `/batch/jobs/${id}`,
  },
  
  // Audio endpoints
  audio: {
    generate: (storyId: string) => `/audio/generate/${storyId}`,
    story: (storyId: string) => `/audio/story/${storyId}`,
    chunk: (id: string) => `/audio/chunk/${id}`,
    status: (storyId: string) => `/audio/status/${storyId}`,
    voices: '/audio/voices',
    retry: (storyId: string) => `/audio/retry/${storyId}`,
    download: (storyId: string) => `/audio/download/${storyId}`,
    preview: (id: string) => `/audio/preview/${id}`,
  },
  
  // Image endpoints
  images: {
    generate: (storyId: string) => `/images/generate/${storyId}`,
    story: (storyId: string) => `/images/story/${storyId}`,
    chunk: (id: string) => `/images/chunk/${id}`,
    status: (storyId: string) => `/images/status/${storyId}`,
    retry: (storyId: string) => `/images/retry/${storyId}`,
    download: (storyId: string) => `/images/download/${storyId}`,
    preview: (id: string) => `/images/preview/${id}`,
  },
}

// Query keys for React Query
export const queryKeys = {
  // Auth queries
  auth: {
    profile: ['auth', 'profile'],
  },
  
  // Stories queries
  stories: {
    all: ['stories'],
    list: (filters?: any) => ['stories', 'list', filters],
    detail: (id: string) => ['stories', 'detail', id],
  },
  
  // Users queries
  users: {
    all: ['users'],
    detail: (id: string) => ['users', 'detail', id],
  },
  
  // Dashboard queries
  dashboard: {
    stats: ['dashboard', 'stats'],
    charts: ['dashboard', 'charts'],
  },
  
  // Batch queries
  batch: {
    jobs: ['batch', 'jobs'],
    jobDetail: (id: string) => ['batch', 'jobs', id],
  },
  
  // Audio queries
  audio: {
    all: ['audio'],
    story: (storyId: string) => ['audio', 'story', storyId],
    chunk: (id: string) => ['audio', 'chunk', id],
    status: (storyId: string) => ['audio', 'status', storyId],
    voices: ['audio', 'voices'],
  },
  
  // Image queries
  images: {
    all: ['images'],
    story: (storyId: string) => ['images', 'story', storyId],
    chunk: (id: string) => ['images', 'chunk', id],
    status: (storyId: string) => ['images', 'status', storyId],
  },
}

export default api 