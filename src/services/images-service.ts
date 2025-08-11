import { apiClient } from '@/utils/api'

export interface ImageChunk {
  _id: string
  storyId: string
  chunkIndex: number
  content: string
  imageFile?: string
  imageUrl?: string
  description?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  error?: string
  createdAt: string
  updatedAt: string
}

export interface ImageProcessingStatus {
  storyId: string
  totalChunks: number
  completedChunks: number
  failedChunks: number
  pendingChunks: number
  processingChunks: number
  overallStatus: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  estimatedTimeRemaining?: number
}

export interface GenerateImagesResponse {
  message: string
  jobId: string
}

export interface RetryImagesResponse {
  message: string
  status: ImageProcessingStatus
}

export interface GenerateImagesDto {
  customPrompt?: string;
  maxWordsPerChunk?: number;
}

export interface GenerateImageWithChunkIdDto {
  chunkId: string;
  customPrompt?: string;
}

class ImagesService {
  // Generate images for a story
  async generateImages(storyId: string, generateImagesDto: GenerateImagesDto): Promise<GenerateImagesResponse> {
    try {
      const response = await apiClient.post<GenerateImagesResponse>(`/images/generate/${storyId}`, generateImagesDto)
      return response
    } catch (error) {
      throw error
    }
  }

  // Generate image (only one) for a story
  async generateImageWithChunkId(generateImagesDto: GenerateImageWithChunkIdDto): Promise<GenerateImagesResponse> {
    try {
      const response = await apiClient.post<GenerateImagesResponse>(`/images/retry-chunk/${generateImagesDto.chunkId}`, {
        customPrompt: generateImagesDto.customPrompt
      })
      return response
    } catch (error) {
      throw error
    }
  }

  // Get all image chunks for a story
  async getImageChunks(storyId: string): Promise<ImageChunk[]> {
    try {
      const response = await apiClient.get<ImageChunk[]>(`/images/story/${storyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Get a specific image chunk
  async getImageChunk(id: string): Promise<ImageChunk> {
    try {
      const response = await apiClient.get<ImageChunk>(`/images/chunk/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Get processing status for a story
  async getProcessingStatus(storyId: string): Promise<ImageProcessingStatus> {
    try {
      const response = await apiClient.get<ImageProcessingStatus>(`/images/status/${storyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Retry failed images for a story
  async retryFailedImages(storyId: string): Promise<RetryImagesResponse> {
    try {
      const response = await apiClient.post<RetryImagesResponse>(`/images/retry/${storyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Delete a specific image chunk
  async deleteImageChunk(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`/images/chunk/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Delete all images for a story
  async deleteAllImages(storyId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`/images/story/${storyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Download all images for a story as ZIP
  async downloadImages(storyId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/images/download/${storyId}`, {
        responseType: 'blob'
      }) as Blob
      return response
    } catch (error) {
      throw error
    }
  }

  // Get image preview
  async getImagePreview(id: string): Promise<{ imageFile: string; message: string }> {
    try {
      const response = await apiClient.get<{ imageFile: string; message: string }>(`/images/preview/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }
}

export const imagesService = new ImagesService() 