import { useAtom } from 'jotai'
import { 
  accessTokenAtom, 
  refreshTokenAtom, 
  userAtom, 
  isAuthenticatedAtom, 
  userRoleAtom,
  authActionsAtom 
} from '@/stores/auth-store'

export function useAuth() {
  const [accessToken] = useAtom(accessTokenAtom)
  const [refreshToken] = useAtom(refreshTokenAtom)
  const [user] = useAtom(userAtom)
  const [isAuthenticated] = useAtom(isAuthenticatedAtom)
  const [userRole] = useAtom(userRoleAtom)
  const [, setAuthActions] = useAtom(authActionsAtom)

  const login = (payload: { accessToken: string; refreshToken: string; user: any }) => {
    setAuthActions('login', payload)
  }

  const logout = () => {
    setAuthActions('logout')
  }

  const updateTokens = (payload: { newAccessToken: string; newRefreshToken?: string }) => {
    setAuthActions('updateTokens', payload)
  }

  const clearAuth = () => {
    setAuthActions('clearAuth')
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    userRole,
    login,
    logout,
    updateTokens,
    clearAuth,
  }
} 