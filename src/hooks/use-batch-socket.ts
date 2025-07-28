import { useEffect, useRef, useState, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/hooks/use-auth'

export interface BatchProcessingEvent {
  batchId: string
  totalStories: number
  timestamp: Date
}

export interface BatchProgressEvent {
  batchId: string
  currentStory: number
  totalStories: number
  progress: number
  message: string
  timestamp: Date
}

export interface BatchCompleteEvent {
  batchId: string
  totalStories: number
  completedStories: number
  failedStories: number
  storyIds: string[]
  errors: string[]
  timestamp: Date
}

export interface BatchErrorEvent {
  batchId: string
  error: string
  timestamp: Date
}

export interface AutoModeEvent {
  storyId: string
  step: string
  progress?: number
  message?: string
  config?: any
  completedSteps?: string[]
  error?: string
  timestamp: Date
}

interface UseBatchSocketOptions {
  batchId?: string
  onBatchStart?: (event: BatchProcessingEvent) => void
  onBatchProgress?: (event: BatchProgressEvent) => void
  onBatchComplete?: (event: BatchCompleteEvent) => void
  onBatchError?: (event: BatchErrorEvent) => void
  onAutoModeStart?: (event: AutoModeEvent) => void
  onAutoModeProgress?: (event: AutoModeEvent) => void
  onAutoModeComplete?: (event: AutoModeEvent) => void
  onAutoModeError?: (event: AutoModeEvent) => void
}

export function useBatchSocket(options: UseBatchSocketOptions = {}) {
  const { user } = useAuth()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const {
    batchId,
    onBatchStart,
    onBatchProgress,
    onBatchComplete,
    onBatchError,
    onAutoModeStart,
    onAutoModeProgress,
    onAutoModeComplete,
    onAutoModeError
  } = options

  // Initialize socket connection
  const connectSocket = useCallback(() => {
    if (!user?.token) {
      setConnectionError('No authentication token available')
      return
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
    
    socketRef.current = io(socketUrl, {
      auth: {
        token: user.token
      },
      transports: ['websocket', 'polling'],
      autoConnect: true
    })

    // Connection events
    socketRef.current.on('connect', () => {
      setIsConnected(true)
      setConnectionError(null)
      console.log('Batch socket connected')
    })

    socketRef.current.on('disconnect', () => {
      setIsConnected(false)
      console.log('Batch socket disconnected')
    })

    socketRef.current.on('connect_error', (error) => {
      setConnectionError(error.message)
      console.error('Batch socket connection error:', error)
    })

    // Batch processing events
    socketRef.current.on('batch-stories-start', (data: BatchProcessingEvent) => {
      console.log('Batch start event:', data)
      onBatchStart?.(data)
    })

    socketRef.current.on('batch-stories-progress', (data: BatchProgressEvent) => {
      console.log('Batch progress event:', data)
      onBatchProgress?.(data)
    })

    socketRef.current.on('batch-stories-complete', (data: BatchCompleteEvent) => {
      console.log('Batch complete event:', data)
      onBatchComplete?.(data)
    })

    socketRef.current.on('batch-stories-error', (data: BatchErrorEvent) => {
      console.log('Batch error event:', data)
      onBatchError?.(data)
    })

    // Auto mode events
    socketRef.current.on('auto-mode-start', (data: AutoModeEvent) => {
      console.log('Auto mode start event:', data)
      onAutoModeStart?.(data)
    })

    socketRef.current.on('auto-mode-progress', (data: AutoModeEvent) => {
      console.log('Auto mode progress event:', data)
      onAutoModeProgress?.(data)
    })

    socketRef.current.on('auto-mode-complete', (data: AutoModeEvent) => {
      console.log('Auto mode complete event:', data)
      onAutoModeComplete?.(data)
    })

    socketRef.current.on('auto-mode-error', (data: AutoModeEvent) => {
      console.log('Auto mode error event:', data)
      onAutoModeError?.(data)
    })

    // Error events
    socketRef.current.on('error', (data: { code: string; message: string }) => {
      console.error('Socket error:', data)
      setConnectionError(data.message)
    })
  }, [user?.token, onBatchStart, onBatchProgress, onBatchComplete, onBatchError, onAutoModeStart, onAutoModeProgress, onAutoModeComplete, onAutoModeError])

  // Join batch room when batchId is available
  const joinBatchRoom = useCallback(() => {
    if (socketRef.current && batchId && isConnected) {
      socketRef.current.emit('join-batch-room', { batchId })
      console.log(`Joined batch room: ${batchId}`)
    }
  }, [batchId, isConnected])

  // Leave batch room
  const leaveBatchRoom = useCallback(() => {
    if (socketRef.current && batchId) {
      socketRef.current.emit('leave-batch-room', { batchId })
      console.log(`Left batch room: ${batchId}`)
    }
  }, [batchId])

  // Get batch status
  const getBatchStatus = useCallback(() => {
    if (socketRef.current && batchId && isConnected) {
      socketRef.current.emit('get-batch-stories-status', { batchId })
    }
  }, [batchId, isConnected])

  // Initialize connection
  useEffect(() => {
    if (user?.token) {
      connectSocket()
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [user?.token, connectSocket])

  // Join/leave batch room when batchId changes
  useEffect(() => {
    if (batchId && isConnected) {
      joinBatchRoom()
    }

    return () => {
      if (batchId) {
        leaveBatchRoom()
      }
    }
  }, [batchId, isConnected, joinBatchRoom, leaveBatchRoom])

  // Reconnect on connection error
  useEffect(() => {
    if (connectionError && socketRef.current) {
      const timeout = setTimeout(() => {
        console.log('Attempting to reconnect...')
        socketRef.current?.connect()
      }, 5000)

      return () => clearTimeout(timeout)
    }
  }, [connectionError])

  return {
    isConnected,
    connectionError,
    getBatchStatus,
    socket: socketRef.current
  }
} 