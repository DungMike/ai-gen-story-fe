import { createContext, useContext, ReactNode, useEffect } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import type { LoginCredentials, RegisterData } from '@/types'
import { 
  userAtom, 
  isAuthenticatedAtom, 
  authActionsAtom 
} from '@/stores/auth-store'
import authService from '@/services/auth-service'

interface AuthContextType {
  user: any
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  refreshUser: () => Promise<void>
  clearAuth: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user] = useAtom(userAtom)
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const setAuthActions = useSetAtom(authActionsAtom)
  const navigate = useNavigate()

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser()
          setAuthActions('login', { 
            accessToken: authService.getAccessToken()!, 
            refreshToken: null, 
            user: currentUser 
          })
        }
      } catch (error) {
        // Token is invalid, clear auth state
        setAuthActions('clearAuth')
      }
    }

    checkAuth()
  }, [setAuthActions])

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      
      // Update Jotai state
      setAuthActions('login', {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user
      })
      
      // Show success message
      toast.success('Login successful!')
      
      // Navigate to dashboard or intended page
      navigate('/dashboard', { replace: true })
      
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Invalid username or password')
      } else if (error.response?.status === 422) {
        toast.error('Please check your input and try again')
      } else if (error.response?.status === 429) {
        toast.error('Too many login attempts. Please try again later')
      } else if (error.response?.status === 403) {
        toast.error('Account is disabled. Please contact support')
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error('Network error. Please check your connection')
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please try again')
      }
      
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      
      // Update Jotai state
      setAuthActions('logout')
      
      toast.success('Logged out successfully')
      
      // Navigate to home page
      navigate('/', { replace: true })
      
    } catch (error: any) {
      // Even if logout fails, clear local state
      setAuthActions('logout')
      navigate('/', { replace: true })
      
      console.error('Logout error:', error)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await authService.register(userData)
      
      toast.success(response.message || 'Registration successful! Please check your email to verify your account.')
      
      // Navigate to login page
      navigate('/login', { 
        replace: true,
        state: { message: 'Registration successful! Please check your email to verify your account.' }
      })
      
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 409) {
        toast.error('Username or email already exists')
      } else if (error.response?.status === 422) {
        toast.error('Please check your input and try again')
      } else if (error.response?.status === 429) {
        toast.error('Too many registration attempts. Please try again later')
      } else if (error.code === 'NETWORK_ERROR') {
        toast.error('Network error. Please check your connection')
      } else {
        toast.error(error.response?.data?.message || 'Registration failed. Please try again')
      }
      
      throw error
    }
  }

  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser()
        setAuthActions('login', { 
          accessToken: authService.getAccessToken()!, 
          refreshToken: null, 
          user: currentUser 
        })
      }
    } catch (error) {
      // Token is invalid, clear auth state
      setAuthActions('clearAuth')
      navigate('/login', { replace: true })
    }
  }

  const clearAuth = () => {
    setAuthActions('clearAuth')
  }

  const authValue: AuthContextType = {
    user,
    isLoading: false, // Jotai handles loading state differently
    isAuthenticated,
    login,
    logout,
    register,
    refreshUser,
    clearAuth,
  }

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
} 