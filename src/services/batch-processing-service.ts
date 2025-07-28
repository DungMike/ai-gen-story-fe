import { apiClient } from '@/utils/api'
import type { UploadedFile } from '@/components/batch-processing/FileUploadZone'

export interface BatchUploadResponse {
  files: Array<{
    fileUrl: string
    fileName: string
    fileSize: number
    filePath: string
  }>
  totalFiles: number
  totalSize: number
}

export interface BatchCreateRequest {
  stories: Array<{
    title?: string
    customPrompt?: string
    fileUrl: string
  }>
  autoMode?: {
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
}

export interface BatchCreateResponse {
  success: boolean
  message: string
  data: {
    batchId: string
    totalStories: number
    autoMode: boolean
    jobId: string
  }
}

export interface BatchStatusResponse {
  batchId: string
  status: string
  totalStories: number
  completedStories: number
  failedStories: number
  progress: number
  storyIds: string[]
  errors: string[]
}

export interface BatchJob {
  _id: string
  userId: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  totalFiles: number
  processedFiles: number
  failedFiles: number
  settings: any
  results: Array<{
    originalFile: string
    storyId?: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    error?: string
    processingTime: number
  }>
  progress: {
    currentFile: number
    currentStep: 'story' | 'audio' | 'images'
    percentage: number
  }
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
}

class BatchProcessingService {
  private retryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await requestFn()
    } catch (error: any) {
      if (retryCount < this.retryConfig.maxRetries && this.isRetryableError(error)) {
        const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.backoffMultiplier, retryCount)
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.retryRequest(requestFn, retryCount + 1)
      }
      throw error
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, 5xx server errors, and rate limiting
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNRESET') {
      return true
    }
    
    if (error.response?.status) {
      const status = error.response.status
      return status >= 500 || status === 429 // Server errors or rate limiting
    }
    
    return false
  }

  // Upload multiple files with progress tracking
  async uploadFiles(
    files: File[], 
    onProgress?: (progress: number) => void
  ): Promise<BatchUploadResponse> {
    return this.retryRequest(async () => {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })
      
      const response = await apiClient.upload<BatchUploadResponse>(
        '/file-upload/batch-upload', 
        formData,
        {
          onUploadProgress: (progressEvent: { loaded: number; total?: number }) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              onProgress(progress)
            }
          }
        }
      )
      return response
    })
  }

  // Create batch stories
  async createBatchStories(data: BatchCreateRequest): Promise<BatchCreateResponse> {
    return this.retryRequest(async () => {
      const response = await apiClient.post<BatchCreateResponse>('/stories/batch-create', data)
      return response
    })
  }

  // Get batch status with polling
  async getBatchStatus(batchId: string): Promise<BatchStatusResponse> {
    return this.retryRequest(async () => {
      const response = await apiClient.get<BatchStatusResponse>(`/stories/batch/${batchId}/status`)
      return response
    })
  }

  // Get batch job details
  async getBatchJob(batchId: string): Promise<BatchJob> {
    return this.retryRequest(async () => {
      const response = await apiClient.get<BatchJob>(`/stories/batch/${batchId}`)
      return response
    })
  }

  // Cancel batch processing
  async cancelBatch(batchId: string): Promise<{ success: boolean; message: string }> {
    return this.retryRequest(async () => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `/stories/batch/${batchId}/cancel`
      )
      return response
    })
  }

  // Retry failed stories in batch
  async retryFailedStories(batchId: string, storyIds: string[]): Promise<{ success: boolean; message: string }> {
    return this.retryRequest(async () => {
      const response = await apiClient.post<{ success: boolean; message: string }>(
        `/stories/batch/${batchId}/retry`,
        { storyIds }
      )
      return response
    })
  }

  // Generate story content
  async generateStory(
    storyId: string, 
    customPrompt?: string
  ): Promise<{ message: string; jobId: string; autoMode?: boolean }> {
    return this.retryRequest(async () => {
      const response = await apiClient.post<{ message: string; jobId: string; autoMode?: boolean }>(
        `/stories/${storyId}/generate`,
        { customPrompt }
      )
      return response
    })
  }

  // Get all user's batch jobs
  async getUserBatchJobs(
    page = 1, 
    limit = 10
  ): Promise<{
    data: BatchJob[]
    pagination: {
      page: number
      limit: number
      total: number
      hasNext: boolean
      hasPrev: boolean
    }
  }> {
    return this.retryRequest(async () => {
      const response = await apiClient.get<{
        data: BatchJob[]
        pagination: {
          page: number
          limit: number
          total: number
          hasNext: boolean
          hasPrev: boolean
        }
      }>('/stories/batch', { params: { page, limit } })
      return response
    })
  }

  // Delete batch job
  async deleteBatchJob(batchId: string): Promise<{ success: boolean; message: string }> {
    return this.retryRequest(async () => {
      const response = await apiClient.delete<{ success: boolean; message: string }>(
        `/stories/batch/${batchId}`
      )
      return response
    })
  }

  // Validate file before upload
  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['.txt', '.doc', '.docx']
    
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit`
      }
    }

    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    if (!allowedTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed types: ${allowedTypes.join(', ')}`
      }
    }

    return { isValid: true }
  }

  // Validate multiple files
  validateFiles(files: File[]): { validFiles: File[]; errors: string[] } {
    const validFiles: File[] = []
    const errors: string[] = []

    files.forEach((file, index) => {
      const validation = this.validateFile(file)
      if (validation.isValid) {
        validFiles.push(file)
      } else {
        errors.push(`${file.name}: ${validation.error}`)
      }
    })

    return { validFiles, errors }
  }
}

export const batchProcessingService = new BatchProcessingService() 