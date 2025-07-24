// Audio Service - Unified API service following project architecture
import { apiClient } from '@/utils/api'

export interface VoiceOption {
  id: string;
  name: string;
  style: 'bright' | 'upbeat' | 'informative' | 'firm' | 'specialized';
  tone: string;
  description: string;
  characteristics: {
    personality: string;
    energy: string;
    clarity: string;
  };
}

export interface AudioChunk {
  _id: string;
  storyId: string;
  chunkIndex: number;
  text: string;
  audioFile?: string;
  audioUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  voiceStyle: string;
  metadata?: {
    duration?: number;
    fileSize?: number;
    chunkWordCount?: number;
  };
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AudioGenerationStatus {
  storyId: string;
  totalChunks: number;
  completedChunks: number;
  failedChunks: number;
  pendingChunks: number;
  processingChunks: number;
  overallStatus: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  estimatedTimeRemaining?: number;
}

export interface GenerateAudioResponse {
  message: string;
  jobId: string;
}

export interface VoiceOptionsResponse {
  success: boolean;
  message: string;
  data: {
    voices: VoiceOption[];
    totalVoices: number;
  };
}

export interface AudioDownloadResponse {
  success: boolean;
  message: string;
  data: {
    downloadUrl: string;
    fileName: string;
    fileSize: number;
    totalDuration: number;
  };
}

export interface GenerateAudioDto {
  voiceStyle: string;
  wordPerChunk?: number;
}

export interface RetryAudioResponse {
  message: string;
  status: AudioGenerationStatus;
}

class AudioService {
  // Generate audio for a story
  async generateAudio(storyId: string, generateAudioDto: GenerateAudioDto): Promise<GenerateAudioResponse> {
    try {
      const response = await apiClient.post<GenerateAudioResponse>(`/audio/generate/${storyId}`, generateAudioDto)
      return response
    } catch (error) {
      throw error
    }
  }

  // Get all audio chunks for a story
  async getAudioChunks(storyId: string): Promise<AudioChunk[]> {
    try {
      const response = await apiClient.get<AudioChunk[]>(`/audio/story/${storyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Get a specific audio chunk
  async getAudioChunk(id: string): Promise<AudioChunk> {
    try {
      const response = await apiClient.get<AudioChunk>(`/audio/chunk/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Get processing status for a story
  async getProcessingStatus(storyId: string): Promise<AudioGenerationStatus> {
    try {
      const response = await apiClient.get<AudioGenerationStatus>(`/audio/status/${storyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Get available voice options
  async getVoiceOptions(): Promise<VoiceOptionsResponse> {
    try {
      const response = await apiClient.get<VoiceOptionsResponse>('/audio/voices')
      return response
    } catch (error) {
      throw error
    }
  }

  // Retry failed audio for a story
  async retryFailedAudio(storyId: string): Promise<RetryAudioResponse> {
    try {
      const response = await apiClient.post<RetryAudioResponse>(`/audio/retry/${storyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Delete a specific audio chunk
  async deleteAudioChunk(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`/audio/chunk/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Delete all audio for a story
  async deleteAllAudio(storyId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`/audio/story/${storyId}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Download all audio files for a story as ZIP
  async downloadAudio(storyId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/audio/download/${storyId}`, {
        responseType: 'blob'
      }) as Blob
      return response
    } catch (error) {
      throw error
    }
  }

  // Download audio files and trigger browser download
  async downloadAudioWithBrowser(storyId: string): Promise<void> {
    try {
      const blob = await this.downloadAudio(storyId)
      
      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `story_${storyId}_audio.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw error
    }
  }

  // Get audio file URL for playback
  getAudioFileUrl(audioFilePath: string): string {
    // Clean path and construct full URL
    const cleanPath = audioFilePath.replace(/^\/api\/audio\//, '')
    const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001'
    return `${baseUrl}/api/audio/${cleanPath}`
  }

  // Validate audio file accessibility
  async validateAudioFile(audioFilePath: string): Promise<boolean> {
    try {
      const url = this.getAudioFileUrl(audioFilePath)
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error('Audio file validation failed:', error)
      return false
    }
  }

  // Get audio preview
  async getAudioPreview(id: string): Promise<{ audioFile: string; message: string }> {
    try {
      const response = await apiClient.get<{ audioFile: string; message: string }>(`/audio/preview/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }
}

export const audioService = new AudioService() 