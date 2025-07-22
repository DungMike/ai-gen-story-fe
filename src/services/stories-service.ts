import { apiClient } from '@/utils/api'
import type { Story, CreateStoryRequest, GenerateStoryRequest } from '@/types'

export interface StoryResponse {
  _id: string
  title: string
  originalContent: string
  generatedContent?: string
  customPrompt?: string
  style: {
    genre: string
    tone: string
    length: string
    targetAudience: string
  }
  status: {
    storyGenerated: boolean
    audioGenerated: boolean
    imagesGenerated: boolean
  }
  metadata: {
    originalWordCount: number
    generatedWordCount?: number
    processingTime?: number
  }
  files: {
    originalFile: string
    generatedFile?: string
  }
  createdAt: string
  updatedAt: string
}

export interface FileUploadResponse {
  fileUrl: string
  fileName: string
  fileSize: number
  filePath: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    hasNext: boolean
    hasPrev: boolean
    limit: number
    page: number
    total: number
  }
}

export interface GetAllStoriesParams {
  page: number
  limit: number
  search?: string,
  userId?: string
}

class StoriesService {
  // Get all stories
  async getAllStories(params: GetAllStoriesParams): Promise<PaginatedResponse<StoryResponse>> {
    try {
      const response = await apiClient.get<PaginatedResponse<StoryResponse>>('/stories', { params })
      return response
    } catch (error) {
      throw error
    }
  }

  // Get story by ID
  async getStoryById(id: string): Promise<StoryResponse> {
    try {
      const response = await apiClient.get<StoryResponse>(`/stories/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Upload file
  async uploadFile(file: File): Promise<FileUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await apiClient.upload<FileUploadResponse>('/file-upload/upload', formData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Create story with file URL
  async createStory(data: CreateStoryRequest): Promise<StoryResponse> {
    try {
      const response = await apiClient.post<StoryResponse>('/stories', data)
      return response
    } catch (error) {
      throw error
    }
  }

  // Generate story with AI
  async generateStory(id: string, customPrompt?: string): Promise<StoryResponse> {
    try {
      const response = await apiClient.post<StoryResponse>(`/stories/${id}/generate`, {
        customPrompt
      })
      return response
    } catch (error) {
      throw error
    }
  }
}

export const storiesService = new StoriesService() 