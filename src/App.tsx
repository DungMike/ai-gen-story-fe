import { Routes, Route } from 'react-router-dom'
import { Provider } from 'jotai'
import { ThemeProvider } from '@/components/theme-provider'
import { SocketProvider } from '@/contexts/socket-context'
import { QueryProvider } from '@/providers/query-provider'
import Layout from '@/components/layout'
import HomePage from '@/pages/home'
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import ForgotPasswordPage from '@/pages/auth/forgot-password'
import StoryDetailPage from '@/pages/story-detail'
import BatchProcessingPage from '@/pages/batch-processing'
import DashboardPage from '@/pages/dashboard'
import ProfilePage from '@/pages/user/profile'
import SettingsPage from '@/pages/user/settings'
import CreateStoryPage from '@/pages/create-story'
import GenerateImagesPage from '@/pages/generate-images'
import GenerateAudioPage from '@/pages/generate-audio'
import ProtectedRoute from '@/components/auth/protected-route'
import Homepage2 from './pages/homepage-2'
import DashboardUserPage from './pages/dashboard-user'

function App() {
  return (
    <Provider>
      <QueryProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <SocketProvider>
            <Routes>
              {/* ========== PUBLIC ROUTES ========== */}
              <Route path="/" element={<Homepage2 />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* ========== PROTECTED ROUTES - STORY MANAGEMENT ========== */}
              <Route path="/create-story" element={
                <ProtectedRoute>
                  <CreateStoryPage />
                </ProtectedRoute>
              } />
              
              <Route path="/story/:id" element={
                <ProtectedRoute>
                  <Layout>
                    <StoryDetailPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/generate-images/:storyId" element={
                <ProtectedRoute>
                  <Layout>
                    <GenerateImagesPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/generate-audio/:storyId" element={
                <ProtectedRoute>
                  <Layout>
                    <GenerateAudioPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* ========== PROTECTED ROUTES - BATCH & DASHBOARD ========== */}
              <Route path="/batch" element={
                <ProtectedRoute>
                  <Layout>
                    <BatchProcessingPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* ========== PROTECTED ROUTES - USER MANAGEMENT ========== */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              
              {/* ========== CATCH ALL - 404 ========== */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-8">Page not found</p>
                    <a href="/" className="text-blue-600 hover:text-blue-800">
                      Go back home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </SocketProvider>
        </ThemeProvider>
      </QueryProvider>
    </Provider>
  )
}

export default App 