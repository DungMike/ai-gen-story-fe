import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { LogOut, User, Menu, X, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useState } from 'react'

export const ModernHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
  }

  const handleCreateStory = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/create-story' } } })
      return
    }
    navigate('/create-story')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div 
              className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                AI Story
              </span>
              <span className="text-xs text-purple-300 font-medium">Generator</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/batch" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Batch Processing
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            {isAuthenticated && (
              <Link to="/create-story" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Create Story
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-white">{user?.username || 'User'}</span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white hover:bg-slate-800/50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </motion.div>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-slate-800/50">
                    Login
                  </Button>
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/register">
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-2 bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl p-4"
            >
              <Link to="/" className="block py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/batch" className="block py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Batch Processing
              </Link>
              <Link to="/dashboard" className="block py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              {isAuthenticated && (
                <Link to="/create-story" className="block py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                  Create Story
                </Link>
              )}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="flex items-center space-x-3 py-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">{user?.username || 'User'}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout} 
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800/50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-700/50 space-y-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="w-full justify-start text-gray-300 hover:text-white hover:bg-slate-800/50">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      size="sm" 
                      className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
} 