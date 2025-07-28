import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { batchProcessingService } from '@/services/batch-processing-service'
import { apiClient } from '@/utils/api'

// Mock the API client
vi.mock('@/utils/api', () => ({
  apiClient: {
    upload: vi.fn(),
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock files
const createMockFile = (name: string, content: string, size: number = 1024): File => {
  // Create content with the specified size
  const actualContent = content.repeat(Math.ceil(size / content.length)).slice(0, size)
  const blob = new Blob([actualContent], { type: 'text/plain' })
  const file = new File([blob], name, { type: 'text/plain' })
  
  // Override the size property for testing
  Object.defineProperty(file, 'size', {
    value: size,
    writable: false
  })
  
  return file
}

describe('Batch Processing Service', () => {
  const mockApiClient = vi.mocked(apiClient)
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('File Upload Tests', () => {
    it('should upload single file successfully', async () => {
      const file = createMockFile('test-file-1.txt', 'Test file 1 content')
      const mockResponse = {
        files: [{
          fileUrl: 'http://localhost:3001/uploads/original/test-file-1_123.txt',
          fileName: 'test-file-1.txt',
          fileSize: 20,
          filePath: 'uploads/original/test-file-1_123.txt'
        }],
        totalFiles: 1,
        totalSize: 20
      }

      mockApiClient.upload.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.uploadFiles([file])

      expect(mockApiClient.upload).toHaveBeenCalledWith(
        '/file-upload/batch-upload',
        expect.any(FormData),
        expect.objectContaining({
          onUploadProgress: expect.any(Function)
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('should upload multiple files successfully', async () => {
      const file1 = createMockFile('test-file-1.txt', 'Test file 1 content')
      const file2 = createMockFile('test-file-2.txt', 'Test file 2 content')
      
      const mockResponse = {
        files: [
          {
            fileUrl: 'http://localhost:3001/uploads/original/test-file-1_123.txt',
            fileName: 'test-file-1.txt',
            fileSize: 20,
            filePath: 'uploads/original/test-file-1_123.txt'
          },
          {
            fileUrl: 'http://localhost:3001/uploads/original/test-file-2_124.txt',
            fileName: 'test-file-2.txt',
            fileSize: 20,
            filePath: 'uploads/original/test-file-2_124.txt'
          }
        ],
        totalFiles: 2,
        totalSize: 40
      }

      mockApiClient.upload.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.uploadFiles([file1, file2])

      expect(mockApiClient.upload).toHaveBeenCalledWith(
        '/file-upload/batch-upload',
        expect.any(FormData),
        expect.objectContaining({
          onUploadProgress: expect.any(Function)
        })
      )
      expect(result.files).toHaveLength(2)
      expect(result.totalFiles).toBe(2)
    })

    it('should handle upload progress callback', async () => {
      const file = createMockFile('test-file-1.txt', 'Test file 1 content')
      const mockResponse = {
        files: [{
          fileUrl: 'http://localhost:3001/uploads/original/test-file-1_123.txt',
          fileName: 'test-file-1.txt',
          fileSize: 20,
          filePath: 'uploads/original/test-file-1_123.txt'
        }],
        totalFiles: 1,
        totalSize: 20
      }

      mockApiClient.upload.mockResolvedValue(mockResponse)
      const progressCallback = vi.fn()

      await batchProcessingService.uploadFiles([file], progressCallback)

      expect(mockApiClient.upload).toHaveBeenCalledWith(
        '/file-upload/batch-upload',
        expect.any(FormData),
        expect.objectContaining({
          onUploadProgress: expect.any(Function)
        })
      )
    })

    it('should retry on network errors', async () => {
      const file = createMockFile('test-file-1.txt', 'Test file 1 content')
      const mockResponse = {
        files: [{
          fileUrl: 'http://localhost:3001/uploads/original/test-file-1_123.txt',
          fileName: 'test-file-1.txt',
          fileSize: 20,
          filePath: 'uploads/original/test-file-1_123.txt'
        }],
        totalFiles: 1,
        totalSize: 20
      }

      // Mock first call to fail, second to succeed
      mockApiClient.upload
        .mockRejectedValueOnce({ code: 'NETWORK_ERROR' })
        .mockResolvedValueOnce(mockResponse)

      const result = await batchProcessingService.uploadFiles([file])

      expect(mockApiClient.upload).toHaveBeenCalledTimes(2)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('Batch Processing Configuration Tests', () => {
    it('should create batch stories with basic configuration', async () => {
      const batchData = {
        stories: [
          {
            title: 'Test Story 1',
            fileUrl: 'http://localhost:3001/uploads/original/test-file-1_123.txt'
          },
          {
            title: 'Test Story 2',
            fileUrl: 'http://localhost:3001/uploads/original/test-file-2_124.txt'
          }
        ]
      }

      const mockResponse = {
        success: true,
        message: 'Batch created successfully',
        data: {
          batchId: 'batch_123',
          totalStories: 2,
          autoMode: false,
          jobId: 'job_456'
        }
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.createBatchStories(batchData)

      expect(mockApiClient.post).toHaveBeenCalledWith('/stories/batch-create', batchData)
      expect(result).toEqual(mockResponse)
    })

    it('should create batch stories with auto mode configuration', async () => {
      const batchData = {
        stories: [
          {
            title: 'Test Story 1',
            fileUrl: 'http://localhost:3001/uploads/original/test-file-1_123.txt'
          },
          {
            title: 'Test Story 2',
            fileUrl: 'http://localhost:3001/uploads/original/test-file-2_124.txt'
          }
        ],
        autoMode: {
          enabled: true,
          generateImages: true,
          generateAudio: true,
          mergeAudio: true,
          audioVoice: 'en-US-Studio-M',
          wordPerChunkImage: 100,
          wordPerChunkAudio: 150,
          customPromptImage: 'Create a beautiful illustration',
          customPromptAudio: 'Generate engaging narration',
          imageStyle: 'realistic'
        }
      }

      const mockResponse = {
        success: true,
        message: 'Batch created successfully with auto mode',
        data: {
          batchId: 'batch_123',
          totalStories: 2,
          autoMode: true,
          jobId: 'job_456'
        }
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.createBatchStories(batchData)

      expect(mockApiClient.post).toHaveBeenCalledWith('/stories/batch-create', batchData)
      expect(result.data.autoMode).toBe(true)
    })

    it('should create batch stories with custom prompts', async () => {
      const batchData = {
        stories: [
          {
            title: 'Test Story 1',
            fileUrl: 'http://localhost:3001/uploads/original/test-file-1_123.txt',
            customPrompt: 'Create a fantasy story with magical elements'
          },
          {
            title: 'Test Story 2',
            fileUrl: 'http://localhost:3001/uploads/original/test-file-2_124.txt',
            customPrompt: 'Create a sci-fi story with advanced technology'
          }
        ]
      }

      const mockResponse = {
        success: true,
        message: 'Batch created successfully with custom prompts',
        data: {
          batchId: 'batch_123',
          totalStories: 2,
          autoMode: false,
          jobId: 'job_456'
        }
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.createBatchStories(batchData)

      expect(mockApiClient.post).toHaveBeenCalledWith('/stories/batch-create', batchData)
      expect(result.success).toBe(true)
    })
  })

  describe('Batch Status and Monitoring Tests', () => {
    it('should get batch status successfully', async () => {
      const batchId = 'batch_123'
      const mockResponse = {
        batchId: 'batch_123',
        status: 'processing',
        totalStories: 2,
        completedStories: 1,
        failedStories: 0,
        progress: 50,
        storyIds: ['story_1', 'story_2'],
        errors: []
      }

      mockApiClient.get.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.getBatchStatus(batchId)

      expect(mockApiClient.get).toHaveBeenCalledWith(`/stories/batch/${batchId}/status`)
      expect(result).toEqual(mockResponse)
    })

    it('should get batch job details', async () => {
      const batchId = 'batch_123'
      const mockResponse = {
        _id: 'batch_123',
        userId: 'user_456',
        status: 'processing',
        totalFiles: 2,
        processedFiles: 1,
        failedFiles: 0,
        settings: {
          autoMode: true,
          generateImages: true,
          generateAudio: true
        },
        results: [
          {
            originalFile: 'test-file-1.txt',
            storyId: 'story_1',
            status: 'completed',
            processingTime: 5000
          },
          {
            originalFile: 'test-file-2.txt',
            status: 'processing',
            processingTime: 2000
          }
        ],
        progress: {
          currentFile: 2,
          currentStep: 'audio',
          percentage: 75
        },
        createdAt: new Date(),
        startedAt: new Date()
      }

      mockApiClient.get.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.getBatchJob(batchId)

      expect(mockApiClient.get).toHaveBeenCalledWith(`/stories/batch/${batchId}`)
      expect(result).toEqual(mockResponse)
    })

    it('should cancel batch processing', async () => {
      const batchId = 'batch_123'
      const mockResponse = {
        success: true,
        message: 'Batch processing cancelled successfully'
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.cancelBatch(batchId)

      expect(mockApiClient.post).toHaveBeenCalledWith(`/stories/batch/${batchId}/cancel`)
      expect(result.success).toBe(true)
    })

    it('should retry failed stories', async () => {
      const batchId = 'batch_123'
      const storyIds = ['story_1', 'story_2']
      const mockResponse = {
        success: true,
        message: 'Failed stories retry initiated'
      }

      mockApiClient.post.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.retryFailedStories(batchId, storyIds)

      expect(mockApiClient.post).toHaveBeenCalledWith(
        `/stories/batch/${batchId}/retry`,
        { storyIds }
      )
      expect(result.success).toBe(true)
    })
  })

  describe('Error Scenarios Tests', () => {
    it('should handle file upload network error', async () => {
      const file = createMockFile('test-file-1.txt', 'Test file 1 content')
      
      mockApiClient.upload.mockRejectedValue({ 
        code: 'NETWORK_ERROR',
        message: 'Network connection failed'
      })

      await expect(batchProcessingService.uploadFiles([file])).rejects.toThrow()
    }, 10000)

    it('should handle file upload server error', async () => {
      const file = createMockFile('test-file-1.txt', 'Test file 1 content')
      
      mockApiClient.upload.mockRejectedValue({
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      })

      await expect(batchProcessingService.uploadFiles([file])).rejects.toThrow()
    }, 10000)

    it('should handle authentication error', async () => {
      const file = createMockFile('test-file-1.txt', 'Test file 1 content')
      
      mockApiClient.upload.mockRejectedValue({
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      })

      await expect(batchProcessingService.uploadFiles([file])).rejects.toThrow()
    })

    it('should handle batch creation validation error', async () => {
      const batchData = {
        stories: [] // Empty stories array
      }

      mockApiClient.post.mockRejectedValue({
        response: {
          status: 400,
          data: { message: 'At least one story is required' }
        }
      })

      await expect(batchProcessingService.createBatchStories(batchData)).rejects.toThrow()
    })

    it('should handle batch status not found error', async () => {
      const batchId = 'non-existent-batch'
      
      mockApiClient.get.mockRejectedValue({
        response: {
          status: 404,
          data: { message: 'Batch not found' }
        }
      })

      await expect(batchProcessingService.getBatchStatus(batchId)).rejects.toThrow()
    })

    it('should handle rate limiting', async () => {
      const file = createMockFile('test-file-1.txt', 'Test file 1 content')
      
      mockApiClient.upload.mockRejectedValue({
        response: {
          status: 429,
          data: { message: 'Too many requests' }
        }
      })

      await expect(batchProcessingService.uploadFiles([file])).rejects.toThrow()
    }, 10000)
  })

  describe('File Validation Tests', () => {
    it('should validate file size correctly', () => {
      const validFile = createMockFile('test.txt', 'content', 5 * 1024 * 1024) // 5MB
      const invalidFile = createMockFile('large.txt', 'content', 15 * 1024 * 1024) // 15MB

      const validResult = batchProcessingService.validateFile(validFile)
      const invalidResult = batchProcessingService.validateFile(invalidFile)

      expect(validResult.isValid).toBe(true)
      expect(invalidResult.isValid).toBe(false)
      expect(invalidResult.error).toContain('10.0MB')
    })

    it('should validate file type correctly', () => {
      const validFile = createMockFile('test.txt', 'content')
      const invalidFile = createMockFile('test.pdf', 'content')

      const validResult = batchProcessingService.validateFile(validFile)
      const invalidResult = batchProcessingService.validateFile(invalidFile)

      expect(validResult.isValid).toBe(true)
      expect(invalidResult.isValid).toBe(false)
      expect(invalidResult.error).toContain('File type not supported')
    })

    it('should validate multiple files correctly', () => {
      const files = [
        createMockFile('valid1.txt', 'content'),
        createMockFile('valid2.txt', 'content'),
        createMockFile('invalid.pdf', 'content'),
        createMockFile('large.txt', 'content', 15 * 1024 * 1024)
      ]

      const result = batchProcessingService.validateFiles(files)

      expect(result.validFiles).toHaveLength(2)
      expect(result.errors).toHaveLength(2)
      expect(result.validFiles[0].name).toBe('valid1.txt')
      expect(result.validFiles[1].name).toBe('valid2.txt')
    })
  })

  describe('Batch Job Management Tests', () => {
    it('should get user batch jobs with pagination', async () => {
      const mockResponse = {
        data: [
          {
            _id: 'batch_1',
            userId: 'user_123',
            status: 'completed',
            totalFiles: 2,
            processedFiles: 2,
            failedFiles: 0,
            settings: {},
            results: [],
            progress: { currentFile: 2, currentStep: 'completed', percentage: 100 },
            createdAt: new Date(),
            completedAt: new Date()
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          hasNext: false,
          hasPrev: false
        }
      }

      mockApiClient.get.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.getUserBatchJobs(1, 10)

      expect(mockApiClient.get).toHaveBeenCalledWith('/stories/batch', {
        params: { page: 1, limit: 10 }
      })
      expect(result.data).toHaveLength(1)
      expect(result.pagination.total).toBe(1)
    })

    it('should delete batch job successfully', async () => {
      const batchId = 'batch_123'
      const mockResponse = {
        success: true,
        message: 'Batch job deleted successfully'
      }

      mockApiClient.delete.mockResolvedValue(mockResponse)

      const result = await batchProcessingService.deleteBatchJob(batchId)

      expect(mockApiClient.delete).toHaveBeenCalledWith(`/stories/batch/${batchId}`)
      expect(result.success).toBe(true)
    })
  })
}) 