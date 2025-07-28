// Audio Hooks - useQuery for data + Jotai for UI state
import { useEffect, useRef, useCallback, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import {
  playerStateAtom,
  generationStateAtom,
  selectedVoiceAtom,
  // Keep only UI state atoms, remove data atoms
  setPlayingAtom,
  setCurrentTimeAtom,
  setDurationAtom,
  setVolumeAtom,
  setMutedAtom,
  setCurrentChunkAtom,
  setPlaylistAtom,
  resetPlayerAtom, setGenerationProgressAtom,
  setGenerationErrorAtom,
  completeGenerationAtom,
  resetGenerationAtom
} from '@/store/audio.store'
import {
  useAudioChunksQuery,
  useAudioStatusQuery,
  useGenerateAudioMutation,
  useDeleteAudioMutation,
  useDownloadAudioMutation
} from '@/hooks/useAudioQueries'
import type { AudioChunk } from '@/services/audio-service'
import { toast } from 'sonner'
import { VoiceOption } from '@/components/audio/constants'

/**
 * Hook for audio player functionality (UI state only)
 */
export const useAudioPlayerControls = () => {
  const playerState = useAtomValue(playerStateAtom)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  
  const setPlaying = useSetAtom(setPlayingAtom)
  const setCurrentTime = useSetAtom(setCurrentTimeAtom)
  const setDuration = useSetAtom(setDurationAtom)
  const setVolume = useSetAtom(setVolumeAtom)
  const setMuted = useSetAtom(setMutedAtom)
  const setCurrentChunk = useSetAtom(setCurrentChunkAtom)
  const resetPlayer = useSetAtom(resetPlayerAtom)

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0)
      })
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0)
      })
      audioRef.current.addEventListener('ended', () => {
        setPlaying(false)
      })
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [setDuration, setCurrentTime, setPlaying])

  // Sync audio element with store state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerState.volume
      audioRef.current.muted = playerState.isMuted
    }
  }, [playerState.volume, playerState.isMuted])

  const play = useCallback((audioSrc?: string) => {
    if (!audioRef.current) return
    const audioUrl = `${import.meta.env.VITE_SOCKET_URL}/${audioSrc}`
    if (audioSrc && audioRef.current.src !== audioUrl) {
      audioRef.current.src = audioUrl
      audioRef.current.crossOrigin ="anonymous"
    }
    
    audioRef.current.play()
    setPlaying(true)
  }, [setPlaying])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setPlaying(false)
    }
  }, [setPlaying])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
      setCurrentTime(0)
    }
  }, [setPlaying, setCurrentTime])

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [setCurrentTime])

  const togglePlayPause = useCallback(() => {
    if (playerState.isPlaying) {
      pause()
    } else {
      play()
    }
  }, [playerState.isPlaying, play, pause])

  const changeVolume = useCallback((volume: number) => {
    setVolume(Math.max(0, Math.min(1, volume)))
  }, [setVolume])

  const toggleMute = useCallback(() => {
    setMuted(!playerState.isMuted)
  }, [playerState.isMuted, setMuted])

  return {
    ...playerState,
    play,
    pause,
    stop,
    seek,
    togglePlayPause,
    changeVolume,
    toggleMute,
    reset: resetPlayer
  }
}

/**
 * Hook for audio generation functionality (useQuery + Jotai)
 */
export const useAudioGenerationControls = () => {
  const generationState = useAtomValue(generationStateAtom)
  const [voiceOptions, setVoiceOptions] = useState<VoiceOption>()
  
  // ✅ Use mutation for audio generation
  const generateMutation = useGenerateAudioMutation()
  
  const setGenerationProgress = useSetAtom(setGenerationProgressAtom)
  const setGenerationError = useSetAtom(setGenerationErrorAtom)
  const completeGeneration = useSetAtom(completeGenerationAtom)
  const resetGeneration = useSetAtom(resetGenerationAtom)
  const [selectedVoice, setSelectedVoice] = useAtom(selectedVoiceAtom)

  const generateAudio = useCallback(async (
    storyId: string, 
    voiceStyle?: string, 
    wordPerChunk?: number
  ) => {
    const selectedVoiceStyle = voiceStyle || selectedVoice
    
    try {
      await generateMutation.mutateAsync({ 
        storyId, 
        voiceStyle: selectedVoiceStyle, 
        wordPerChunk 
      })
    } catch (error: any) {
      setGenerationError(error.message)
      toast.error(`Failed to start audio generation: ${error.message}`)
    }
  }, [generateMutation, selectedVoice, setGenerationError])

  const selectVoice = useCallback((voiceId: string) => {
    setSelectedVoice(voiceId)
  }, [setSelectedVoice])

  return {
    ...generationState,
    voiceOptions,
    selectedVoice,
    isGenerating: generateMutation.isPending || generationState.isGenerating,
    generateAudio,
    selectVoice,
    setProgress: (progress: number, currentStep: string) => 
      setGenerationProgress({ progress, currentStep }),
    setError: setGenerationError,
    complete: completeGeneration,
    reset: resetGeneration
  }
}

/**
 * Hook for managing audio chunks for a specific story (useQuery + Jotai)
 */
export const useStoryAudio = (storyId: string) => {
  // ✅ Use useQuery for audio chunks data
  const { 
    data: audioChunks = [], 
    isLoading, 
    error, 
    refetch: refreshAudioChunks 
  } = useAudioChunksQuery(storyId)

  
  // ✅ Use useQuery for audio status
  const { 
    data: audioStatus, 
    refetch: checkAudioStatus 
  } = useAudioStatusQuery(storyId)
  
  // ✅ Use mutations for actions
  const downloadMutation = useDownloadAudioMutation()
  const deleteMutation = useDeleteAudioMutation()
  
  const playerState = useAtomValue(playerStateAtom)
  const generationState = useAtomValue(generationStateAtom)
  const setPlaylist = useSetAtom(setPlaylistAtom)

  // Update playlist when chunks change
  useEffect(() => {
    const completedChunks = audioChunks.filter((chunk: AudioChunk) => 
      chunk.status === 'completed' && chunk.audioFile
    )
    setPlaylist(completedChunks)
  }, [audioChunks, setPlaylist])

  const downloadAllAudio = useCallback(async () => {
    if (storyId) {
      try {
        await downloadMutation.mutateAsync(storyId)
      } catch (error: any) {
        toast.error('Failed to download audio files')
      }
    }
  }, [storyId, downloadMutation])

  const deleteAllAudio = useCallback(async () => {
    if (storyId) {
      try {
        await deleteMutation.mutateAsync(storyId)
      } catch (error: any) {
        toast.error('Failed to delete audio chunks')
      }
    }
  }, [storyId, deleteMutation])

  // Calculate audio statistics
  const completedChunks = audioChunks.filter(chunk => chunk.status === 'completed')
  const audioStats = {
    totalChunks: audioChunks.length,
    completedChunks: completedChunks.length,
    processingChunks: audioChunks.filter(chunk => chunk.status === 'processing').length,
    failedChunks: audioChunks.filter(chunk => chunk.status === 'failed').length,
    hasAudio: completedChunks.some(chunk => chunk.audioFile),
    totalDuration: audioChunks.reduce((acc, chunk) => acc + (chunk.metadata?.duration || 0), 0)
  }

  return {
    audioChunks,
    audioStatus,
    audioStats,
    isLoading: isLoading || downloadMutation.isPending || deleteMutation.isPending,
    error,
    isGenerating: generationState.isGenerating,
    generationProgress: generationState.progress,
    currentChunkIndex: playerState.currentChunkIndex,
    refreshAudioChunks,
    checkAudioStatus,
    downloadAllAudio,
    deleteAllAudio,
    isDownloading: downloadMutation.isPending,
    isDeleting: deleteMutation.isPending
  }
}

/**
 * Hook for playlist functionality (useQuery data + Jotai UI state)
 */
export const useAudioPlaylist = (storyId: string) => {
  const { audioChunks } = useStoryAudio(storyId)
  const playerControls = useAudioPlayerControls()
  const setCurrentChunk = useSetAtom(setCurrentChunkAtom)

  const completedChunks = audioChunks.filter((chunk: AudioChunk) => 
    chunk.status === 'completed' && chunk.audioFile
  )

  const playChunk = useCallback((chunkIndex: number) => {
    const chunk = completedChunks[chunkIndex]
    if (chunk && chunk.audioFile) {
      setCurrentChunk(chunkIndex)
      playerControls.play(chunk.audioFile)
    }
  }, [completedChunks, setCurrentChunk, playerControls])

  const playNext = useCallback(() => {
    const currentIndex = playerControls.currentChunkIndex ?? -1
    const nextIndex = currentIndex + 1
    
    if (nextIndex < completedChunks.length) {
      playChunk(nextIndex)
    } else {
      // End of playlist
      playerControls.stop()
      setCurrentChunk(-1)
    }
  }, [playerControls, completedChunks.length, playChunk, setCurrentChunk])

  const playPrevious = useCallback(() => {
    const currentIndex = playerControls.currentChunkIndex ?? 0
    const previousIndex = currentIndex - 1
    
    if (previousIndex >= 0) {
      playChunk(previousIndex)
    }
  }, [playerControls.currentChunkIndex, playChunk])

  const playFromBeginning = useCallback(() => {
    if (completedChunks.length > 0) {
      playChunk(0)
    }
  }, [completedChunks.length, playChunk])

  const togglePlayPauseChunk = useCallback((chunkIndex: number) => {
    if (playerControls.isPlaying) {
      playerControls.pause()
    } else {
      playChunk(chunkIndex);
    }
  }, [playerControls.isPlaying, playerControls.pause, playChunk])

  // Auto-play next chunk when current ends
  useEffect(() => {
    if (!playerControls.isPlaying && 
        playerControls.currentTime === playerControls.duration && 
        playerControls.duration > 0) {
      playNext()
    }
  }, [playerControls.isPlaying, playerControls.currentTime, playerControls.duration, playNext])

  return {
    completedChunks,
    canPlayNext: (playerControls.currentChunkIndex ?? -1) < completedChunks.length - 1,
    canPlayPrevious: (playerControls.currentChunkIndex ?? 0) > 0,
    playChunk,
    playNext,
    playPrevious,
    playFromBeginning,
    togglePlayPauseChunk,
    ...playerControls
  }
}

/**
 * Hook for voice selection and management (useQuery + Jotai)
 */
export const useVoiceSelection = () => {
  const [voiceOptions, setVoiceOptions] = useState<VoiceOption[]>(Object.values(VoiceOption))
  
  const [selectedVoice, setSelectedVoice] = useAtom(selectedVoiceAtom)


  const selectVoice = useCallback((voiceId: string) => {
    setSelectedVoice(voiceId)
  }, [setSelectedVoice])

  return {
    voiceOptions,
    selectedVoice,
    selectVoice,
  }
} 