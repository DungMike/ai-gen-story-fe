import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import authService from '@/services/auth-service'
import type { LoginCredentials } from '@/types'

function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, login: setAuthState } = useAuth()
  const from = location.state?.from?.pathname || '/dashboard'
  
  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username or email is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)
      const response = await authService.login(formData)
      
      // Update Jotai state
      setAuthState({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user
      })
      
      // Navigation is handled in the auth context
      navigate('/', { replace: true })
      
    } catch (error: any) {
      // Handle specific error cases
      if (error.response?.status === 401) {
        setErrors({ general: 'Invalid username or password' })
      } else if (error.response?.status === 422) {
        setErrors({ general: 'Please check your input and try again' })
      } else if (error.response?.status === 429) {
        setErrors({ general: 'Too many login attempts. Please try again later' })
      } else if (error.response?.status === 403) {
        setErrors({ general: 'Account is disabled. Please contact support' })
      } else if (error.code === 'NETWORK_ERROR') {
        setErrors({ general: 'Network error. Please check your connection' })
      } else {
        setErrors({ general: error.response?.data?.message || 'Login failed. Please try again' })
      }
      
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur">
          <CardHeader className="text-center">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="mx-auto w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4">
              <span className="text-white font-bold text-lg">AI</span>
            </div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your account to continue
            </CardDescription>
            
            {/* Show success message from registration */}
            {location.state?.message && (
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-700 dark:text-green-300">
                  {location.state.message}
                </p>
              </div>
            )}

            {/* Show general error */}
            {errors.general && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {errors.general}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username or Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username or email"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className={`pl-10 ${errors.username ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.username && (
                    <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.username}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {errors.password && (
                    <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:underline disabled:opacity-50"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-primary hover:underline font-medium disabled:opacity-50"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage 