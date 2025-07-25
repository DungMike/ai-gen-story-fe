// Audio Queries - React Query hooks with unified architecture
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { audioService } from '@/services/audio-service'
import { queryKeys } from '@/utils/api'
import type { 
  AudioChunk, 
  AudioGenerationStatus, 
  VoiceOptionsResponse,
  GenerateAudioDto 
} from '@/services/audio-service'
import { toast } from 'sonner'

/**
 * Get audio chunks for a story with intelligent caching & background refetch
 */
export const useAudioChunksQuery = (storyId: string) => {
  return useQuery({
    queryKey: queryKeys.audio.story(storyId),
    queryFn: () => audioService.getAudioChunks(storyId),
    enabled: !!storyId,
    staleTime: 30 * 1000, // 30s - audio chunks don't change often unless processing
    gcTime: 10 * 60 * 1000, // 10min cache
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      // Auto-refetch if any chunks are processing
      const data = query.state.data as AudioChunk[] | undefined
      const hasProcessing = data?.some((chunk: AudioChunk) => 
        chunk.status === 'processing' || chunk.status === 'pending'
      )
      return hasProcessing ? 5000 : false // 5s if processing, stop when done
    },
  })
}

/**
 * Get audio generation status with real-time polling
 */
export const useAudioStatusQuery = (storyId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.audio.status(storyId),
    queryFn: () => audioService.getProcessingStatus(storyId),
    enabled: !!storyId && enabled,
    staleTime: 5 * 1000, // 5s - status changes frequently during generation
    gcTime: 2 * 60 * 1000, // 2min cache
    refetchInterval: (query) => {
      // Poll while processing, stop when complete/failed
      const data = query.state.data as AudioGenerationStatus | undefined
      const isProcessing = data?.overallStatus === 'processing' || data?.overallStatus === 'pending'
      return isProcessing ? 10000 : false // 10s polling when active
    },
    refetchOnWindowFocus: true,
  })
}

/**
 * Generate audio mutation with optimistic updates
 */
export const useGenerateAudioMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ 
      storyId, 
      voiceStyle, 
      wordPerChunk 
    }: { 
      storyId: string; 
      voiceStyle: string; 
      wordPerChunk?: number 
    }) => {
      const dto: GenerateAudioDto = { voiceStyle, wordPerChunk }
      return audioService.generateAudio(storyId, dto)
    },
    onMutate: async ({ storyId }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.audio.story(storyId) })
      await queryClient.cancelQueries({ queryKey: queryKeys.audio.status(storyId) })
      
      // Snapshot previous values for rollback
      const previousChunks = queryClient.getQueryData(queryKeys.audio.story(storyId))
      const previousStatus = queryClient.getQueryData(queryKeys.audio.status(storyId))
      
      // Optimistically update status
      queryClient.setQueryData(queryKeys.audio.status(storyId), (old: AudioGenerationStatus | undefined) => ({
        ...old,
        storyId,
        overallStatus: 'processing' as const,
        progress: 0,
      }))
      
      return { previousChunks, previousStatus, storyId }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context) {
        if (context.previousChunks) {
          queryClient.setQueryData(queryKeys.audio.story(context.storyId), context.previousChunks)
        }
        if (context.previousStatus) {
          queryClient.setQueryData(queryKeys.audio.status(context.storyId), context.previousStatus)
        }
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to start audio generation'
      toast.error(errorMessage)
    },
    onSuccess: (data, { storyId }) => {
      toast.success('Audio generation started!')
      
      // Trigger background refetch of chunks and status
      queryClient.invalidateQueries({ queryKey: queryKeys.audio.story(storyId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.audio.status(storyId) })
    }
  })
}

/**
 * Delete audio chunks mutation with optimistic updates
 */
export const useDeleteAudioMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (storyId: string) => audioService.deleteAllAudio(storyId),
    onMutate: async (storyId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.audio.story(storyId) })
      await queryClient.cancelQueries({ queryKey: queryKeys.audio.status(storyId) })
      
      const previousChunks = queryClient.getQueryData(queryKeys.audio.story(storyId))
      const previousStatus = queryClient.getQueryData(queryKeys.audio.status(storyId))
      
      // Optimistically clear chunks
      queryClient.setQueryData(queryKeys.audio.story(storyId), [])
      queryClient.setQueryData(queryKeys.audio.status(storyId), (old: AudioGenerationStatus | undefined) => ({
        ...old,
        storyId,
        totalChunks: 0,
        completedChunks: 0,
        failedChunks: 0,
        pendingChunks: 0,
        processingChunks: 0,
        overallStatus: 'pending' as const,
        progress: 0,
      }))
      
      return { previousChunks, previousStatus, storyId }
    },
    onError: (err, storyId, context) => {
      // Rollback
      if (context) {
        if (context.previousChunks) {
          queryClient.setQueryData(queryKeys.audio.story(storyId), context.previousChunks)
        }
        if (context.previousStatus) {
          queryClient.setQueryData(queryKeys.audio.status(storyId), context.previousStatus)
        }
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete audio'
      toast.error(errorMessage)
    },
    onSuccess: (_, storyId) => {
      toast.success('Audio deleted successfully!')
      queryClient.invalidateQueries({ queryKey: queryKeys.audio.status(storyId) })
    }
  })
}

/**
 * Download audio mutation
 */
export const useDownloadAudioMutation = () => {
  return useMutation({
    mutationFn: (storyId: string) => audioService.downloadAudioWithBrowser(storyId),
    onSuccess: () => {
      toast.success('Audio files downloaded!')
    },
    onError: (error: any) => {
      const errorMessage = error instanceof Error ? error.message : 'Download failed'
      toast.error(errorMessage)
    }
  })
}

/**
 * Retry failed audio mutation
 */
export const useRetryAudioMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (storyId: string) => audioService.retryFailedAudio(storyId),
    onSuccess: (data, storyId) => {
      toast.success('Audio retry started!')
      
      // Invalidate queries to refetch latest data
      queryClient.invalidateQueries({ queryKey: queryKeys.audio.story(storyId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.audio.status(storyId) })
    },
    onError: (error: any) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to retry audio generation'
      toast.error(errorMessage)
    }
  })
}

/**
 * Prefetch audio data for better UX
 */
export const useAudioPrefetch = () => {
  const queryClient = useQueryClient()
  
  const prefetchAudioChunks = (storyId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.audio.story(storyId),
      queryFn: () => audioService.getAudioChunks(storyId),
      staleTime: 30 * 1000,
    })
  }
  
  const prefetchAudioStatus = (storyId: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.audio.status(storyId),
      queryFn: () => audioService.getProcessingStatus(storyId),
      staleTime: 5 * 1000,
    })
  }
  
  const prefetchVoiceOptions = () => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.audio.voices,
      staleTime: 24 * 60 * 60 * 1000,
    })
  }
  
  return { 
    prefetchAudioChunks, 
    prefetchAudioStatus
  }
} 