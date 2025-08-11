import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useImages } from '@/hooks/use-images'
import { useSocketContext } from '@/contexts/socket-context'
import { useStory } from '@/hooks/use-stories'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Play,
  Download,
  Trash2,
  RefreshCw,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft, Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'sonner'
import { GenerateImagesDto, ImageChunk } from '@/services/images-service'
import { Separator } from '@radix-ui/react-select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from '@/components/ui'

export default function GenerateImagesPage() {
  const { storyId } = useParams<{ storyId: string }>()
  const navigate = useNavigate()
  const { isConnected, joinImageRoom, leaveImageRoom, onImageProcessing, offImageProcessing } = useSocketContext()
  const { data: story } = useStory(storyId!)
  const {
    imageChunks,
    processingStatus,
    isLoading,
    generateImages,
    retryFailedImages,
    deleteImageChunk,
    deleteAllImages,
    downloadImages,
    generateImageWithChunkId,
    isGenerating,
    isRetrying,
    isDeletingChunk,
    isDeletingAll,
    isDownloading,
    refetchChunks,
    refetchStatus
  } = useImages(storyId!)

  const [showImageDetails, setShowImageDetails] = useState<Record<string, boolean>>({})
  const [realTimeProgress, setRealTimeProgress] = useState<{
    progress: number
    currentChunk: number
    totalChunks: number
    message: string
  } | null>(null)

  const [generateImagesDto, setGenerateImagesDto] = useState<GenerateImagesDto>({
    customPrompt: '',
    maxWordsPerChunk: 200
  })

  // Socket event handlers
  useEffect(() => {
    if (!storyId || !isConnected) return

    // Join image room
    joinImageRoom(storyId)

    // Set up image processing event listeners
    onImageProcessing((data: any) => {
      console.log('🖼️ Image processing event:', data)

      switch (data.event) {
        case 'image:processing:start':
          setRealTimeProgress({
            progress: 0,
            currentChunk: 0,
            totalChunks: data.totalChunks || 0,
            message: data.message || 'Starting image generation...'
          })
          refetchStatus()
          break

        case 'image:processing:progress':
          setRealTimeProgress({
            progress: data.progress || 0,
            currentChunk: data.chunk || 0,
            totalChunks: data.totalChunks || 0,
            message: `Processing image ${data.chunk || 0} of ${data.totalChunks || 0}`
          })
          refetchStatus()
          break

        case 'image:processing:complete':
          setRealTimeProgress(null)
          toast.success('Image generation completed!')
          refetchChunks()
          refetchStatus()
          break

        case 'image:processing:error':
          setRealTimeProgress(null)
          toast.error(`Image generation failed: ${data.error}`)
          refetchStatus()
          break
      }
    })

    return () => {
      leaveImageRoom(storyId)
      offImageProcessing()
    }
  }, [storyId, isConnected, joinImageRoom, leaveImageRoom, onImageProcessing, offImageProcessing, refetchChunks, refetchStatus])

  const handleGenerateImages = () => {
    if (!storyId) return
    generateImages(generateImagesDto)
  }

  const handleGenerateImageWithChunkId = (chunkId: string, customPrompt: string) => {
    if (!chunkId) return
    generateImageWithChunkId({chunkId, customPrompt})
  }

  const handleRetryFailed = () => {
    if (!storyId) return
    retryFailedImages()
  }

  const handleDeleteAll = () => {
    if (!storyId) return
    deleteAllImages()
  }

  const handleDownload = () => {
    if (!storyId) return
    downloadImages()
  }

  const handleDeleteChunk = (chunkId: string) => {
    deleteImageChunk(chunkId)
  }

  const toggleImageDetails = (chunkId: string) => {
    setShowImageDetails(prev => ({
      ...prev,
      [chunkId]: !prev[chunkId]
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'processing': return 'bg-blue-500'
      case 'pending': return 'bg-yellow-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'processing': return <Clock className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  if (!storyId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Story ID not found</h1>
          <p className="text-gray-600 mt-2">Please provide a valid story ID.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Generate Images</h1>
            <p className="text-gray-600 mt-1">
              {story?.title || 'Story'} • AI-Powered Image Generation
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>

      {/* Story Info */}
      {story && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5" />
              <span>Story Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{story.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {story.metadata?.originalWordCount || 0} words
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline">
                  {story.style?.genre || 'Unknown'} • {story.style?.tone || 'Unknown'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* form generateImagesDto */}

      <form className='mb-6'>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col  gap-2">
            <p>Custom Prompt</p>
            <Input className='outline-none' value={generateImagesDto.customPrompt} onChange={(e) => setGenerateImagesDto({ ...generateImagesDto, customPrompt: e.target.value })} />
          </div>
          <div className="flex flex-col gap-2">
            <p>Max Words Per Chunk</p>
            <Input type='number' value={generateImagesDto.maxWordsPerChunk} onChange={(e) => setGenerateImagesDto({ ...generateImagesDto, maxWordsPerChunk: parseInt(e.target.value) })} />
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleGenerateImages}
              disabled={isGenerating || processingStatus?.overallStatus === 'processing'}
              className="flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isGenerating ? 'Starting...' : 'Generate Images'}</span>
            </Button>

            {processingStatus?.failedChunks && processingStatus.failedChunks > 0 && (
              <Button
                variant="outline"
                onClick={handleRetryFailed}
                disabled={isRetrying}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isRetrying ? 'Retrying...' : `Retry Failed (${processingStatus.failedChunks})`}</span>
              </Button>
            )}

            {imageChunks.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? 'Downloading...' : 'Download All'}</span>
                </Button>

                <ConfirmDialog
                  title="Delete All Images"
                  description="Are you sure you want to delete all images for this story? This action cannot be undone."
                  actionLabel="Delete All"
                  cancelLabel="Cancel"
                  variant="destructive"
                  onConfirm={handleDeleteAll}
                >
                  <Button
                    variant="destructive"
                    disabled={isDeletingAll}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{isDeletingAll ? 'Deleting...' : 'Delete All'}</span>
                  </Button>
                </ConfirmDialog>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {processingStatus && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Processing Status</span>
              <div className="flex items-center space-x-2">
                {getStatusIcon(processingStatus.overallStatus)}
                <Badge variant={processingStatus.overallStatus === 'completed' ? 'default' : 'secondary'}>
                  {processingStatus.overallStatus}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">

              {/* Real-time Progress */}
              {realTimeProgress && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Real-time Progress</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">{realTimeProgress.message}</p>
                  <div className="flex justify-between text-xs text-blue-600">
                    <span>Chunk {realTimeProgress.currentChunk} of {realTimeProgress.totalChunks}</span>
                    <span>{realTimeProgress.progress}%</span>
                  </div>
                  <Progress value={realTimeProgress.progress} className="h-1 mt-1" />
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{processingStatus.totalChunks}</div>
                  <div className="text-xs text-gray-600">Total Chunks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{processingStatus.completedChunks}</div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{processingStatus.processingChunks}</div>
                  <div className="text-xs text-gray-600">Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{processingStatus.failedChunks}</div>
                  <div className="text-xs text-gray-600">Failed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}



      {/* Image Chunks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Generated Images</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetchChunks()}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading images...</p>
          </div>
        ) : imageChunks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Generated</h3>
              <p className="text-gray-600 mb-4">
                Start generating images for your story to see them here.
              </p>
              <Button onClick={handleGenerateImages} disabled={isGenerating}>
                <Play className="w-4 h-4 mr-2" />
                Generate Images
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageChunks.map((chunk: ImageChunk) => (
              <ImageChunkCard
                key={chunk._id}
                chunk={chunk}
                onDelete={() => handleDeleteChunk(chunk._id)}
                onToggleDetails={() => toggleImageDetails(chunk._id)}
                showDetails={showImageDetails[chunk._id] || false}
                isDeleting={isDeletingChunk}
                onGenerateImageWithChunkId={(customPrompt) => handleGenerateImageWithChunkId(chunk._id, customPrompt || '')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface ImageChunkCardProps {
  chunk: ImageChunk
  onDelete: () => void
  onToggleDetails: () => void
  showDetails: boolean
  isDeleting: boolean
  onGenerateImageWithChunkId: (customPrompt?: string) => void
}

function ImageChunkCard({ chunk, onDelete, onToggleDetails, showDetails, isDeleting, onGenerateImageWithChunkId }: ImageChunkCardProps) {
  const [showRegeneratePopup, setShowRegeneratePopup] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'processing': return 'bg-blue-500'
      case 'pending': return 'bg-yellow-500'
      case 'failed': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'processing': return <Clock className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const toggleRegeneratePopup = () => {
    setShowRegeneratePopup(prev => !prev);
  }

  
  const handleRegenerateImage = () => {
    onGenerateImageWithChunkId(customPrompt || '');
    toggleRegeneratePopup();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon(chunk.status)}
            <span className="text-sm font-medium">Chunk {chunk.chunkIndex + 1}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Badge
              variant="outline"
              className={`${getStatusColor(chunk.status)} text-white`}
            >
              {chunk.status}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleDetails}
              className="h-6 w-6 p-0"
            >
              {showDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Image Preview */}
        {chunk.imageFile && (
          <div className="mb-3">
            <img
              crossOrigin="anonymous"
              src={`${import.meta.env.VITE_SOCKET_URL}/${chunk.imageFile}`}
              alt={`Generated image for chunk ${chunk.chunkIndex + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content Preview */}
        <div className="mb-3">
          <p className="text-sm text-gray-600 line-clamp-3">
            {chunk.content}
          </p>
        </div>

        {/* Details */}
        {showDetails && (
          <div className="space-y-2 text-xs text-gray-500">
            <Separator />
            <div>
              <strong>Description:</strong> {chunk.description || 'No description'}
            </div>
            {chunk.error && (
              <div className="text-red-600">
                <strong>Error:</strong> {chunk.error}
              </div>
            )}
            <div>
              <strong>Created:</strong> {new Date(chunk.createdAt).toLocaleString()}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end items-center mt-3">
          <ConfirmDialog
            title="Delete Image"
            description="Are you sure you want to delete this image? This action cannot be undone."
            actionLabel="Delete"
            cancelLabel="Cancel"
            variant="destructive"
            onConfirm={onDelete}
          >
            <Button
              variant="ghost"
              size="sm"
              disabled={isDeleting}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </ConfirmDialog>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRegeneratePopup}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>

        <Dialog open={showRegeneratePopup} onOpenChange={setShowRegeneratePopup}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Regenerate Image</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Custom Prompt</label>
                  <Textarea rows={3} className='outline-none' value={customPrompt || ''} onChange={(e) => setCustomPrompt(e.target.value)} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={toggleRegeneratePopup}>
                    Cancel
                  </Button>
                  <Button onClick={handleRegenerateImage}>
                    Regenerate
                  </Button>
                </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}