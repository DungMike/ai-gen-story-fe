import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { imagesService, type ImageChunk, type ImageProcessingStatus, type GenerateImagesResponse, type RetryImagesResponse, GenerateImagesDto } from '@/services/images-service'

export function useImages(storyId: string) {
  const queryClient = useQueryClient()

  // Get image chunks
  const {
    data: imageChunks = [],
    isLoading: isLoadingChunks,
    error: chunksError,
    refetch: refetchChunks
  } = useQuery({
    queryKey: ['images', 'chunks', storyId],
    queryFn: () => imagesService.getImageChunks(storyId),
    enabled: !!storyId,
    staleTime: 30 * 1000, // 30 seconds
  })

  // Get processing status
  const {
    data: processingStatus,
    isLoading: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus
  } = useQuery({
    queryKey: ['images', 'status', storyId],
    queryFn: () => imagesService.getProcessingStatus(storyId),
    enabled: !!storyId,
    refetchInterval: (query) => {
      // Refetch every 2 seconds if processing, every 30 seconds if completed
      const data = query.state.data
      if (!data) return 2000
      return data.overallStatus === 'processing' || data.overallStatus === 'pending' ? 2000 : 30000
    },
    refetchIntervalInBackground: true,
  })

  // Generate images mutation
  const generateImagesMutation = useMutation({
    mutationFn: (generateImagesDto: GenerateImagesDto) => imagesService.generateImages(storyId, generateImagesDto),
    onSuccess: (data) => {
      toast.success('Image generation started successfully!')
      // Refetch status and chunks after generation starts
      refetchStatus()
      refetchChunks()
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to start image generation'
      toast.error(message)
    }
  })

  // Retry failed images mutation
  const retryFailedImagesMutation = useMutation({
    mutationFn: () => imagesService.retryFailedImages(storyId),
    onSuccess: (data) => {
      toast.success('Retrying failed images...')
      refetchStatus()
      refetchChunks()
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to retry failed images'
      toast.error(message)
    }
  })

  // Delete image chunk mutation
  const deleteImageChunkMutation = useMutation({
    mutationFn: (chunkId: string) => imagesService.deleteImageChunk(chunkId),
    onSuccess: () => {
      toast.success('Image deleted successfully')
      refetchChunks()
      refetchStatus()
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete image'
      toast.error(message)
    }
  })

  // Delete all images mutation
  const deleteAllImagesMutation = useMutation({
    mutationFn: () => imagesService.deleteAllImages(storyId),
    onSuccess: () => {
      toast.success('All images deleted successfully')
      refetchChunks()
      refetchStatus()
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete all images'
      toast.error(message)
    }
  })

  // Download images mutation
  const downloadImagesMutation = useMutation({
    mutationFn: () => imagesService.downloadImages(storyId),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `story-images-${storyId}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Images downloaded successfully!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to download images'
      toast.error(message)
    }
  })

  return {
    // Data
    imageChunks,
    processingStatus,
    
    // Loading states
    isLoadingChunks,
    isLoadingStatus,
    isLoading: isLoadingChunks || isLoadingStatus,
    
    // Errors
    chunksError,
    statusError,
    
    // Actions
    generateImages: generateImagesMutation.mutate,
    retryFailedImages: retryFailedImagesMutation.mutate,
    deleteImageChunk: deleteImageChunkMutation.mutate,
    deleteAllImages: deleteAllImagesMutation.mutate,
    downloadImages: downloadImagesMutation.mutate,
    
    // Loading states for actions
    isGenerating: generateImagesMutation.isPending,
    isRetrying: retryFailedImagesMutation.isPending,
    isDeletingChunk: deleteImageChunkMutation.isPending,
    isDeletingAll: deleteAllImagesMutation.isPending,
    isDownloading: downloadImagesMutation.isPending,
    
    // Refetch functions
    refetchChunks,
    refetchStatus,
  }
} 