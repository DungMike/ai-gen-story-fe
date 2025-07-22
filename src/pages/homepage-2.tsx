import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'

// Import modern components
import { ModernHeader } from '@/components/homepage/ModernHeader'
import { HeroSection } from '@/components/homepage/HeroSection'
import { FeaturesSection } from '@/components/homepage/FeaturesSection'
import { PricingSection } from '@/components/homepage/PricingSection'
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection'
import { DashboardPreviewSection } from '@/components/homepage/DashboardPreviewSection'
import { FileUploadSection } from '@/components/homepage/FileUploadSection'
import { ModernFooter } from '@/components/homepage/ModernFooter'

function Homepage2() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/create-story' } } })
      return
    }
    
    setIsProcessing(true)
    // TODO: Implement file upload logic
    setTimeout(() => {
      setIsProcessing(false)
      navigate('/create-story')
    }, 2000)
  }

  const handleCreateStory = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/create-story' } } })
      return
    }
    navigate('/create-story')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Modern Header */}
      <ModernHeader />

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        <HeroSection onCreateStory={handleCreateStory} />

        {/* Features Section */}
        <FeaturesSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Dashboard Preview Section */}
        <DashboardPreviewSection />

        {/* File Upload Section */}
        <FileUploadSection
          selectedFile={selectedFile}
          isProcessing={isProcessing}
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
        />
      </main>

      {/* Modern Footer */}
      <ModernFooter />
    </div>
  )
}

export default Homepage2 