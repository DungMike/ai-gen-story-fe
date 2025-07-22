import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Sparkles, ArrowLeft, Settings, Wand2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/use-auth'
import Layout from '@/components/layout'
import { useCreateStory, useGenerateStory, useUploadFile } from '@/hooks/use-stories'
import { useSocketContext } from '@/contexts/socket-context'
import { toast } from 'sonner'

interface StoryFormData {
  title: string
  customPrompt: string
  file: File | null
  fileUrl?: string
}

interface ProcessingStatus {
  event: string
  storyId: string
  progress?: number
  step?: string
  message?: string
  error?: string
}

function CreateStoryPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { isConnected, onStoryProcessing, offStoryProcessing, joinStoryRoom } = useSocketContext()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'upload' | 'settings' | 'processing'>('upload')
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null)
  const [storyId, setStoryId] = useState<string | null>(null)
  
  // React Query hooks
  const uploadFileMutation = useUploadFile()
  const createStoryMutation = useCreateStory()
  const generateStoryMutation = useGenerateStory()
  
  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    customPrompt: '',
    file: null
  })

  // WebSocket event handling
  useEffect(() => {
    if (isConnected && storyId) {
      // Join the story room to receive events
      joinStoryRoom(storyId)
      
      onStoryProcessing((data) => {
        console.log('Story processing event:', data)
        setProcessingStatus(data)
        
        if (data.event === 'story:processing:complete') {
          toast.success('Story generated successfully!')
          navigate(`/story/${data.storyId}`)
        } else if (data.event === 'story:processing:error') {
          toast.error(`Generation failed: ${data.error || data.message}`)
          setCurrentStep('settings')
          setIsProcessing(false)
        } else if (data.event === 'story:processing:start') {
          toast.info('Story generation started...')
        } else if (data.event === 'story:processing:progress') {
          // Progress updates are handled by setProcessingStatus
          console.log(`Progress: ${data.progress}% - ${data.step}`)
        }
      })
    }

    return () => {
      offStoryProcessing()
    }
  }, [isConnected, storyId, onStoryProcessing, offStoryProcessing, joinStoryRoom, navigate])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setFormData(prev => ({ ...prev, file }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof StoryFormData] as object),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleNextStep = () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }
    setCurrentStep('settings')
  }

  const handleBackStep = () => {
    setCurrentStep('upload')
  }

  const handleCreateStory = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/create-story' } } })
      return
    }
    
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a story title')
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (selectedFile.size > maxSize) {
      toast.error('File size must be less than 10MB')
      return
    }

    setIsProcessing(true)
    setCurrentStep('processing')
    
    try {
      // Step 1: Upload file
      const uploadResult = await uploadFileMutation.mutateAsync(selectedFile)
      console.log("🚀 ~ handleCreateStory ~ uploadResult:", uploadResult)
      
      // Step 2: Create story with file URL
      const story = await createStoryMutation.mutateAsync({
        title: formData.title || 'Untitled Story',
        customPrompt: formData.customPrompt,
        fileUrl: uploadResult.fileUrl,
      })
      setStoryId(story._id)
      
      // setCurrentStoryId(story._id) // This line was removed as per the edit hint
      toast.success('Story created successfully!')
      
      // Step 3: Generate the story with AI (WebSocket will handle progress)
      await generateStoryMutation.mutateAsync({
        id: story._id,
        customPrompt: formData.customPrompt
      })
      
    } catch (error: any) {
      console.error('Error creating story:', error)
      
      let errorMessage = 'Failed to create story'
      if (error.response?.status === 400) {
        errorMessage = 'Invalid file format or data'
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in to create stories'
        navigate('/login', { state: { from: { pathname: '/create-story' } } })
      } else if (error.response?.status === 413) {
        errorMessage = 'File is too large. Please use a smaller file.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      toast.error(errorMessage)
      setCurrentStep('settings')
      setIsProcessing(false)
    }
  }
   
    

  const genres = [
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'romance', label: 'Romance' },
    { value: 'action', label: 'Action' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'sci-fi', label: 'Science Fiction' },
    { value: 'horror', label: 'Horror' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'drama', label: 'Drama' }
  ]

  const tones = [
    { value: 'dramatic', label: 'Dramatic' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'serious', label: 'Serious' },
    { value: 'romantic', label: 'Romantic' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'lighthearted', label: 'Lighthearted' }
  ]

  const lengths = [
    { value: 'short', label: 'Short (1-2 pages)' },
    { value: 'medium', label: 'Medium (3-5 pages)' },
    { value: 'long', label: 'Long (6+ pages)' }
  ]

  const audiences = [
    { value: 'children', label: 'Children' },
    { value: 'teen', label: 'Teen' },
    { value: 'adult', label: 'Adult' }
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div 
          className="flex items-center space-x-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Story</h1>
            <p className="text-muted-foreground">Transform your story with AI magic</p>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                1
              </div>
              <span className="text-sm font-medium">Upload File</span>
            </div>
            <div className="w-8 h-0.5 bg-muted"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'settings' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'settings' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span className="text-sm font-medium">Configure</span>
            </div>
            <div className="w-8 h-0.5 bg-muted"></div>
            <div className={`flex items-center space-x-2 ${currentStep === 'processing' ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'processing' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="text-sm font-medium">Generate</span>
            </div>
          </div>
        </motion.div>

        {/* Step 1: File Upload */}
        {currentStep === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Your Story</span>
                </CardTitle>
                <CardDescription>
                  Upload a text file (.txt, .doc, .docx) to get started with AI story generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div 
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your story file here, or click to browse
                  </p>
                  <Input
                    type="file"
                    accept=".txt,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>Choose File</span>
                    </Button>
                  </label>
                </motion.div>
                
                {selectedFile && (
                  <motion.div 
                    className="p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm font-medium">Selected file: {selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size: {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </motion.div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleNextStep} disabled={!selectedFile || isProcessing}>
                    Next Step
                    <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Story Settings */}
        {currentStep === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Configure Story Settings</span>
                </CardTitle>
                <CardDescription>
                  Customize how AI will transform your story
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Story Title</label>
                    <Input
                      placeholder="Enter story title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  
                  
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Custom Prompt (Optional)</label>
                  <Textarea
                    placeholder="Add specific instructions for AI story generation..."
                    value={formData.customPrompt}
                    onChange={(e) => handleInputChange('customPrompt', e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBackStep} disabled={isProcessing}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleCreateStory} disabled={isProcessing}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    {isProcessing ? 'Generating...' : 'Generate Story'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Processing */}
        {currentStep === 'processing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Generating Your Story</span>
                </CardTitle>
                <CardDescription>
                  AI is working its magic to transform your story
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-16 h-16 text-primary" />
                  </motion.div>
                  
                  {processingStatus ? (
                    <div className="space-y-4">
                      <p className="text-lg font-medium">
                        {processingStatus.step === 'reading_file' && 'Reading story file...'}
                        {processingStatus.step === 'story_generation' && 'Generating story with AI...'}
                        {processingStatus.step === 'ai_processing' && 'AI is processing your story...'}
                        {processingStatus.step === 'saving_file' && 'Saving generated story...'}
                        {!processingStatus.step && 'Processing your story...'}
                      </p>
                      
                      {processingStatus.message && (
                        <p className="text-sm text-muted-foreground">
                          {processingStatus.message}
                        </p>
                      )}
                      
                      {processingStatus.progress !== undefined && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div 
                              className="bg-primary h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${processingStatus.progress}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {processingStatus.progress}% complete
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium mb-2">Processing your story...</p>
                      <p className="text-sm text-muted-foreground">
                        This may take a few minutes depending on the story length
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <motion.div 
                    className={`flex items-center space-x-3 ${
                      processingStatus?.step === 'reading_file' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      processingStatus?.step === 'reading_file' ? 'bg-primary' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm">Reading and analyzing story</span>
                  </motion.div>
                  <motion.div 
                    className={`flex items-center space-x-3 ${
                      processingStatus?.step === 'story_generation' || processingStatus?.step === 'ai_processing' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      processingStatus?.step === 'story_generation' || processingStatus?.step === 'ai_processing' ? 'bg-primary animate-pulse' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-sm">Generating AI-enhanced content</span>
                  </motion.div>
                  <motion.div 
                    className={`flex items-center space-x-3 ${
                      processingStatus?.step === 'saving_file' ? 'text-primary' : 'text-muted-foreground'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      processingStatus?.step === 'saving_file' ? 'bg-primary' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Finalizing story</span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Layout>
  )
}

export default CreateStoryPage 