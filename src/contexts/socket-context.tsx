import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/hooks/use-auth'

interface SocketContextType {
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  emit: (event: string, data: any) => void
  onStoryProcessing: (callback: (data: any) => void) => void
  offStoryProcessing: () => void
  joinStoryRoom: (storyId: string) => void
  leaveStoryRoom: (storyId: string) => void
  onImageProcessing: (callback: (data: any) => void) => void
  offImageProcessing: () => void
  joinImageRoom: (storyId: string) => void
  leaveImageRoom: (storyId: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

interface SocketProviderProps {
  children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { accessToken } = useAuth()

  const connect = () => {
    console.log('🔐 Socket connect called, accessToken:', accessToken ? 'Available' : 'Not available')
    
    if (!accessToken) {
      console.log('❌ No token available, skipping socket connection')
      return
    }

    const VITE_SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
    console.log("🚀 ~ connect ~ API_BASE_URL:", VITE_SOCKET_URL)
    console.log("🔑 ~ connect ~ Token length:", accessToken.length)
    
    const newSocket = io(VITE_SOCKET_URL, {
      query: { token: accessToken },
      withCredentials: true,
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('✅ Connected to socket server')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('❌ Disconnected from socket server')
    })

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error)
      setIsConnected(false)
    })

    newSocket.on('error', (data) => {
      console.error('❌ Socket error:', data)
    })

    newSocket.on('joined-story-room', (data) => {
      console.log('✅ Joined story room:', data.storyId)
    })

    newSocket.on('left-story-room', (data) => {
      console.log('👋 Left story room:', data.storyId)
    })

    newSocket.on('story-status', (data) => {
      console.log('📊 Story status:', data)
    })

    newSocket.on('rooms-info', (data) => {
      console.log('📋 Rooms info:', data)
    })

    setSocket(newSocket)
  }

  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
  }

  const emit = (event: string, data: any) => {
    if (socket) {
      socket.emit(event, data)
    }
  }

  const joinStoryRoom = (storyId: string) => {
    if (socket && isConnected) {
      socket.emit('join-story-room', { storyId })
    }
  }

  const leaveStoryRoom = (storyId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-story-room', { storyId })
    }
  }

  const onStoryProcessing = (callback: (data: any) => void) => {
    if (socket) {
      // Handle story processing events
      socket.on('story:processing:start', (data) => {
        console.log('🚀 Story processing started:', data)
        callback({ 
          ...data, 
          event: 'story:processing:start',
          step: data.step || 'story_generation'
        })
      })
      
      socket.on('story:processing:progress', (data) => {
        console.log('📈 Story processing progress:', data)
        callback({ 
          ...data, 
          event: 'story:processing:progress',
          step: data.step || 'ai_processing'
        })
      })
      
      socket.on('story:processing:complete', (data) => {
        console.log('✅ Story processing complete:', data)
        callback({ 
          ...data, 
          event: 'story:processing:complete',
          step: 'saving_file'
        })
      })
      
      socket.on('story:processing:error', (data) => {
        console.error('❌ Story processing error:', data)
        callback({ 
          ...data, 
          event: 'story:processing:error',
          step: data.step || 'error'
        })
      })
    }
  }

  const offStoryProcessing = () => {
    if (socket) {
      socket.off('story:processing:start')
      socket.off('story:processing:progress')
      socket.off('story:processing:complete')
      socket.off('story:processing:error')
      console.log('🧹 Cleaned up story processing event listeners')
    }
  }

  const onImageProcessing = (callback: (data: any) => void) => {
    if (socket) {
      // Handle image processing events
      socket.on('image:processing:start', (data) => {
        console.log('🖼️ Image processing started:', data)
        callback({ 
          ...data, 
          event: 'image:processing:start'
        })
      })
      
      socket.on('image:processing:progress', (data) => {
        console.log('📈 Image processing progress:', data)
        callback({ 
          ...data, 
          event: 'image:processing:progress'
        })
      })
      
      socket.on('image:processing:complete', (data) => {
        console.log('✅ Image processing complete:', data)
        callback({ 
          ...data, 
          event: 'image:processing:complete'
        })
      })
      
      socket.on('image:processing:error', (data) => {
        console.error('❌ Image processing error:', data)
        callback({ 
          ...data, 
          event: 'image:processing:error'
        })
      })
    }
  }

  const offImageProcessing = () => {
    if (socket) {
      socket.off('image:processing:start')
      socket.off('image:processing:progress')
      socket.off('image:processing:complete')
      socket.off('image:processing:error')
      console.log('🧹 Cleaned up image processing event listeners')
    }
  }

  const joinImageRoom = (storyId: string) => {
    if (socket && isConnected) {
      socket.emit('join-image-room', { storyId })
    }
  }

  const leaveImageRoom = (storyId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-image-room', { storyId })
    }
  }

  useEffect(() => {
    if (accessToken) {
      connect()
    }
    return () => disconnect()
  }, [accessToken])

  return (
    <SocketContext.Provider value={{
      isConnected,
      connect,
      disconnect,
      emit,
      onStoryProcessing,
      offStoryProcessing,
      joinStoryRoom,
      leaveStoryRoom,
      onImageProcessing,
      offImageProcessing,
      joinImageRoom,
      leaveImageRoom
    }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider')
  }
  return context
} 