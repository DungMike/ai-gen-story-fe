// User Types
export interface User {
  _id: string
  username: string
  email: string
  fullName: string
  avatar?: string
  role: 'user' | 'premium' | 'admin'
  status?: 'active' | 'inactive' | 'banned'
  emailVerified?: boolean
  lastLoginAt?: Date
  loginCount?: number
  preferences?: {
    language: string
    theme: 'light' | 'dark'
    notifications: {
      email: boolean
      push: boolean
    }
  }
  subscription?: {
    planType: 'free' | 'basic' | 'premium'
    startDate?: Date
    endDate?: Date
    autoRenew: boolean
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface UserSession {
  _id: string
  deviceInfo?: {
    device: string
    os: string
    browser: string
    version: string
  }
  ipAddress?: string
  userAgent?: string
  isActive: boolean
  createdAt: Date
  expiresAt: Date
}

// Auth Types
export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  email: string
  password: string
  fullName: string
  confirmPassword?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Story Types
export interface Story {
  _id: string
  userId: string
  title: string
  originalContent: string
  generatedContent?: string
  customPrompt?: string
  style: {
    genre: 'fantasy' | 'romance' | 'action' | 'mystery' | 'sci-fi' | 'horror' | 'comedy' | 'drama'
    tone: 'dramatic' | 'humorous' | 'serious' | 'romantic' | 'mysterious' | 'lighthearted'
    length: 'short' | 'medium' | 'long'
    targetAudience: 'children' | 'teen' | 'adult'
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
    aiModel?: string
  }
  files: {
    originalFile: string
    generatedFile?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface CreateStoryRequest {
  title: string
  customPrompt?: string
  fileUrl: string
  style?: {
    genre: 'fantasy' | 'romance' | 'action' | 'mystery' | 'sci-fi' | 'horror' | 'comedy' | 'drama'
    tone: 'dramatic' | 'humorous' | 'serious' | 'romantic' | 'mysterious' | 'lighthearted'
    length: 'short' | 'medium' | 'long'
    targetAudience: 'children' | 'teen' | 'adult'
  }
}

export interface GenerateStoryRequest {
  customPrompt?: string
}

export interface CreateStoryFormData {
  title: string
  customPrompt?: string
  style: {
    genre: 'fantasy' | 'romance' | 'action' | 'mystery' | 'sci-fi' | 'horror' | 'comedy' | 'drama'
    tone: 'dramatic' | 'humorous' | 'serious' | 'romantic' | 'mysterious' | 'lighthearted'
    length: 'short' | 'medium' | 'long'
    targetAudience: 'children' | 'teen' | 'adult'
  }
  file: File
}

export interface BatchSettingsFormData {
  autoMode: boolean
  generateAudio: boolean
  generateImages: boolean
  defaultPrompt?: string
  audioSettings: {
    maxWordsPerChunk: number
    voiceModel: 'google-tts' | 'elevenlabs'
  }
  imageSettings: {
    artStyle: 'realistic' | 'anime' | 'comic' | 'watercolor'
    imageSize: '512x512' | '1024x1024'
  }
} 