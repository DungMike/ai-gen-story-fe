import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { batchProcessingService, type BatchCreateRequest, type BatchJob } from '@/services/batch-processing-service'
import type { UploadedFile } from '@/components/batch-processing/FileUploadZone'

// Hook to upload multiple files
export function useBatchUpload() {
  return useMutation({
    mutationFn: ({ files, onProgress }: { files: File[]; onProgress?: (progress: number) => void }) => 
      batchProcessingService.uploadFiles(files, onProgress),
    onError: (error: any) => {
      console.error('Error uploading files:', error)
    },
  })
}

// Hook to create batch stories
export function useBatchCreate() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: BatchCreateRequest) => batchProcessingService.createBatchStories(data),
    onSuccess: (result) => {
      // Invalidate batch jobs list
      queryClient.invalidateQueries({ queryKey: ['batch-jobs'] })
      
      // Add the new batch to cache
      if (result.success && result.data.batchId) {
        queryClient.setQueryData(
          ['batch-job', result.data.batchId],
          {
            _id: result.data.batchId,
            status: 'pending',
            totalFiles: result.data.totalStories,
            processedFiles: 0,
            failedFiles: 0,
            createdAt: new Date()
          }
        )
      }
    },
    onError: (error: any) => {
      console.error('Error creating batch stories:', error)
    },
  })
}

// Hook to get batch status
export function useBatchStatus(batchId: string | null) {
  return useQuery({
    queryKey: ['batch-status', batchId],
    queryFn: () => batchProcessingService.getBatchStatus(batchId!),
    enabled: !!batchId,
    refetchInterval: (data: any) => {
      // Stop polling when batch is completed or failed
      if (data?.status === 'completed' || data?.status === 'failed') {
        return false
      }
      // Poll every 2 seconds while processing
      return 2000
    },
    staleTime: 0, // Always fetch fresh data
  })
}

// Hook to get batch job details
export function useBatchJob(batchId: string | null) {
  return useQuery({
    queryKey: ['batch-job', batchId],
    queryFn: () => batchProcessingService.getBatchJob(batchId!),
    enabled: !!batchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to get user's batch jobs
export function useUserBatchJobs(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['batch-jobs', page, limit],
    queryFn: () => batchProcessingService.getUserBatchJobs(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook to cancel batch processing
export function useCancelBatch() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (batchId: string) => batchProcessingService.cancelBatch(batchId),
    onSuccess: (result, batchId) => {
      // Update batch job in cache
      queryClient.setQueryData(['batch-job', batchId], (old: any) => ({
        ...old,
        status: 'cancelled'
      }))
      
      // Invalidate batch jobs list
      queryClient.invalidateQueries({ queryKey: ['batch-jobs'] })
    },
    onError: (error: any) => {
      console.error('Error cancelling batch:', error)
    },
  })
}

// Hook to retry failed stories
export function useRetryFailedStories() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ batchId, storyIds }: { batchId: string; storyIds: string[] }) =>
      batchProcessingService.retryFailedStories(batchId, storyIds),
    onSuccess: (result, { batchId }) => {
      // Invalidate batch status and job
      queryClient.invalidateQueries({ queryKey: ['batch-status', batchId] })
      queryClient.invalidateQueries({ queryKey: ['batch-job', batchId] })
    },
    onError: (error: any) => {
      console.error('Error retrying failed stories:', error)
    },
  })
}

// Hook to delete batch job
export function useDeleteBatchJob() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (batchId: string) => batchProcessingService.deleteBatchJob(batchId),
    onSuccess: (result, batchId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['batch-job', batchId] })
      queryClient.removeQueries({ queryKey: ['batch-status', batchId] })
      
      // Invalidate batch jobs list
      queryClient.invalidateQueries({ queryKey: ['batch-jobs'] })
    },
    onError: (error: any) => {
      console.error('Error deleting batch job:', error)
    },
  })
}

// Hook to generate story content
export function useGenerateStory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ storyId, customPrompt }: { storyId: string; customPrompt?: string }) =>
      batchProcessingService.generateStory(storyId, customPrompt),
    onSuccess: (result, { storyId }) => {
      // Invalidate story data
      queryClient.invalidateQueries({ queryKey: ['story', storyId] })
    },
    onError: (error: any) => {
      console.error('Error generating story:', error)
    },
  })
}

// Utility function to convert uploaded files to batch create request
export function convertToBatchCreateRequest(
  uploadedFiles: UploadedFile[],
  autoModeConfig?: {
    enabled: boolean
    generateImages?: boolean
    generateAudio?: boolean
    mergeAudio?: boolean
    audioVoice?: string
    wordPerChunkImage?: number
    wordPerChunkAudio?: number
    customPromptImage?: string
    customPromptAudio?: string
    imageStyle?: string
  }
): BatchCreateRequest {
  const stories = uploadedFiles
    .filter(file => file.status === 'completed' && file.uploadedUrl)
    .map(file => ({
      title: file.file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      fileUrl: file.uploadedUrl!
    }))

  return {
    stories,
    autoMode: autoModeConfig
  }
}

// Utility function to validate files before upload
export function validateFilesForUpload(files: File[]): { validFiles: File[]; errors: string[] } {
  return batchProcessingService.validateFiles(files)
} 