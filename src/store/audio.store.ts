// Audio Store - Jotai atoms for UI state only (data fetching moved to useQuery)
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { AudioChunk, VoiceOption } from '@/services/audio-service'

// UI-only types (keep these here since they're UI-specific)
export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  currentChunkIndex?: number;
  playlist?: AudioChunk[];
}

export interface AudioGenerationUIState {
  isGenerating: boolean;
  progress: number;
  currentStep: string;
  error?: string;
}

// Constants (moved from types file)
export const DEFAULT_VOICE = 'voice-1'
export const DEFAULT_WORD_PER_CHUNK = 500

// Initial States
const initialPlayerState: AudioPlayerState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  currentChunkIndex: undefined,
  playlist: undefined
}

const initialGenerationState: AudioGenerationUIState = {
  isGenerating: false,
  progress: 0,
  currentStep: '',
  error: undefined
}

// =============================================================================
// BASE ATOMS (UI State Only)
// =============================================================================

// Player State Atoms
export const playerStateAtom = atom<AudioPlayerState>(initialPlayerState)

// Generation State Atoms
export const generationStateAtom = atom<AudioGenerationUIState>(initialGenerationState)

// Persisted Settings Atoms
export const selectedVoiceAtom = atomWithStorage('audio-selected-voice', DEFAULT_VOICE)
export const volumeAtom = atomWithStorage('audio-volume', 1)

// =============================================================================
// UI ACTION ATOMS (Player Controls)
// =============================================================================

export const setPlayingAtom = atom(
  null,
  (get, set, isPlaying: boolean) => {
    const currentState = get(playerStateAtom)
    set(playerStateAtom, { ...currentState, isPlaying })
  }
)

export const setCurrentTimeAtom = atom(
  null,
  (get, set, currentTime: number) => {
    const currentState = get(playerStateAtom)
    set(playerStateAtom, { ...currentState, currentTime })
  }
)

export const setDurationAtom = atom(
  null,
  (get, set, duration: number) => {
    const currentState = get(playerStateAtom)
    set(playerStateAtom, { ...currentState, duration })
  }
)

export const setVolumeAtom = atom(
  null,
  (get, set, volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    const currentState = get(playerStateAtom)
    set(playerStateAtom, { ...currentState, volume: clampedVolume })
    set(volumeAtom, clampedVolume)
  }
)

export const setMutedAtom = atom(
  null,
  (get, set, isMuted: boolean) => {
    const currentState = get(playerStateAtom)
    set(playerStateAtom, { ...currentState, isMuted })
  }
)

export const setCurrentChunkAtom = atom(
  null,
  (get, set, currentChunkIndex: number) => {
    const currentState = get(playerStateAtom)
    set(playerStateAtom, { ...currentState, currentChunkIndex })
  }
)

export const setPlaylistAtom = atom(
  null,
  (get, set, playlist: AudioChunk[]) => {
    const currentState = get(playerStateAtom)
    set(playerStateAtom, { ...currentState, playlist })
  }
)

export const resetPlayerAtom = atom(
  null,
  (get, set) => {
    set(playerStateAtom, initialPlayerState)
  }
)

// =============================================================================
// UI ACTION ATOMS (Generation Controls)
// =============================================================================

export const startGenerationAtom = atom(
  null,
  (get, set, params: { storyId: string; voiceStyle: string; wordPerChunk?: number }) => {
    set(generationStateAtom, {
      ...get(generationStateAtom),
      isGenerating: true,
      progress: 0,
      currentStep: 'Starting generation...',
      error: undefined
    })
  }
)

export const setGenerationProgressAtom = atom(
  null,
  (get, set, params: { progress: number; currentStep: string }) => {
    const currentState = get(generationStateAtom)
    set(generationStateAtom, {
      ...currentState,
      progress: params.progress,
      currentStep: params.currentStep
    })
  }
)

export const setGenerationErrorAtom = atom(
  null,
  (get, set, error: string) => {
    const currentState = get(generationStateAtom)
    set(generationStateAtom, {
      ...currentState,
      isGenerating: false,
      error
    })
  }
)

export const completeGenerationAtom = atom(
  null,
  (get, set) => {
    const currentState = get(generationStateAtom)
    set(generationStateAtom, {
      ...currentState,
      isGenerating: false,
      progress: 100,
      currentStep: 'Completed',
      error: undefined
    })
  }
)

export const resetGenerationAtom = atom(
  null,
  (get, set) => {
    set(generationStateAtom, initialGenerationState)
  }
)

export const clearErrorAtom = atom(
  null,
  (get, set) => {
    const currentState = get(generationStateAtom)
    set(generationStateAtom, { ...currentState, error: undefined })
  }
) 