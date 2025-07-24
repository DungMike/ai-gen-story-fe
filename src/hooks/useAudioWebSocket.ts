// Audio WebSocket Hook - Handle real-time audio events using Jotai + React Query
import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { useQueryClient } from '@tanstack/react-query'
import { useSocketContext } from '@/contexts/socket-context'
import {
  setGenerationProgressAtom,
  setGenerationErrorAtom,
  completeGenerationAtom
} from '@/store/audio.store'
import { queryKeys } from '@/utils/api'
import { toast } from 'sonner'

/**
 * Hook to handle audio WebSocket events for a specific story
 */
export const useAudioWebSocket = (storyId: string) => {
  const { 
    isConnected, 
    onAudioProcessing, 
    offAudioProcessing, 
    joinAudioRoom, 
    leaveAudioRoom 
  } = useSocketContext()
  
  const queryClient = useQueryClient()
  
  const setGenerationProgress = useSetAtom(setGenerationProgressAtom)
  const setGenerationError = useSetAtom(setGenerationErrorAtom)
  const completeGeneration = useSetAtom(completeGenerationAtom)

  useEffect(() => {
    if (!isConnected || !storyId) return

    // Join audio room for this story
    joinAudioRoom(storyId)

    // Set up audio event listeners
    onAudioProcessing((data) => {
      if (data.storyId !== storyId) return

      switch (data.event) {
        case 'audio:processing:progress':
          console.log('🎵 Audio progress:', data)
          setGenerationProgress({
            progress: data.progress || 0,
            currentStep: `Processing chunk ${data.chunkIndex + 1}/${data.totalChunks}...`
          })
          break

        case 'audio:processing:completed':
          console.log('✅ Audio chunk completed:', data)
          setGenerationProgress({
            progress: data.progress || 0,
            currentStep: `Chunk ${data.chunkIndex + 1} completed!`
          })
          
          // ✅ Invalidate React Query cache to refetch chunks
          queryClient.invalidateQueries({ queryKey: queryKeys.audio.story(storyId) })
          
          // Check if all chunks are completed
          if (data.progress >= 100) {
            completeGeneration()
            toast.success('Audio generation completed!')
          }
          break

        case 'audio:processing:failed':
          console.error('❌ Audio chunk failed:', data)
          setGenerationError(`Chunk ${data.chunkIndex + 1} failed: ${data.error}`)
          toast.error(`Audio generation failed for chunk ${data.chunkIndex + 1}`)
          break

        case 'audio:status:update':
          console.log('📊 Audio status update:', data)
          if (data.progress !== undefined) {
            setGenerationProgress({
              progress: data.progress,
              currentStep: `${data.completedChunks}/${data.totalChunks} chunks completed`
            })
          }
          break

        case 'audio:status:error':
          console.error('❌ Audio status error:', data)
          setGenerationError(data.error || 'Audio status error')
          break

        default:
          console.log('🔍 Unknown audio event:', data.event, data)
      }
    })

    // Cleanup on unmount
    return () => {
      leaveAudioRoom(storyId)
      offAudioProcessing()
    }
  }, [
    isConnected,
    storyId,
    joinAudioRoom,
    leaveAudioRoom,
    onAudioProcessing,
    offAudioProcessing,
    setGenerationProgress,
    setGenerationError,
    completeGeneration,
    queryClient
  ])

  return {
    isConnected
  }
}

/**
 * Hook to handle audio WebSocket events globally (for multiple stories)
 */
export const useGlobalAudioWebSocket = () => {
  const { 
    isConnected, 
    onAudioProcessing, 
    offAudioProcessing 
  } = useSocketContext()
  
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isConnected) return

    // Set up global audio event listeners
    onAudioProcessing((data) => {
      console.log('🌐 Global audio event:', data)
      
      // Handle events that might affect any story
      switch (data.event) {
        case 'audio:processing:completed':
          // ✅ Invalidate React Query cache for the specific story
          if (data.storyId) {
            queryClient.invalidateQueries({ queryKey: queryKeys.audio.story(data.storyId) })
            queryClient.invalidateQueries({ queryKey: queryKeys.audio.status(data.storyId) })
          }
          break

        case 'audio:processing:failed':
          // Show global error notification
          toast.error(`Audio generation failed: ${data.error}`)
          break

        default:
          // Log other events for debugging
          console.log('🔍 Global audio event:', data.event, data)
      }
    })

    // Cleanup on unmount
    return () => {
      offAudioProcessing()
    }
  }, [
    isConnected,
    onAudioProcessing,
    offAudioProcessing,
    queryClient
  ])

  return {
    isConnected
  }
} 