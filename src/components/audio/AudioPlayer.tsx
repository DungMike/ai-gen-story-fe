// Enhanced Audio Player Component with useQuery optimizations
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Download,
  List,
  Shuffle,
  Repeat,
  Loader2
} from 'lucide-react'
import { useAudioPlaylist, useStoryAudio } from '@/hooks/useAudio'
import type { AudioChunk } from '@/services/audio-service'
import { cn } from '@/lib/utils'

interface AudioPlayerProps {
  storyId: string
  className?: string
  showPlaylist?: boolean
  autoPlay?: boolean
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  storyId,
  className,
  showPlaylist = true,
  autoPlay = false
}) => {
  const playlist = useAudioPlaylist(storyId)
  const { isLoading: isLoadingAudio } = useStoryAudio(storyId)
  const [showFullPlaylist, setShowFullPlaylist] = useState(false)
  const [isShuffleMode, setIsShuffleMode] = useState(false)
  const [isRepeatMode, setIsRepeatMode] = useState(false)

  // Auto-play first chunk if enabled
  useEffect(() => {
    if (autoPlay && playlist.completedChunks.length > 0 && !playlist.isPlaying) {
      playlist.playFromBeginning()
    }
  }, [autoPlay, playlist.completedChunks.length, playlist.isPlaying, playlist.playFromBeginning])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getCurrentChunk = (): AudioChunk | undefined => {
    if (playlist.currentChunkIndex !== undefined && playlist.currentChunkIndex >= 0) {
      return playlist.completedChunks[playlist.currentChunkIndex]
    }
    return undefined
  }

  const currentChunk = getCurrentChunk()

  // Loading skeleton
  const PlayerSkeleton = () => (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-2 flex-1" />
          <Skeleton className="h-3 w-8" />
        </div>
      </CardContent>
    </Card>
  )

  // Show loading skeleton while audio data is being fetched
  if (isLoadingAudio && playlist.completedChunks.length === 0) {
    return <PlayerSkeleton />
  }

  // Show empty state if no audio chunks available
  if (!isLoadingAudio && playlist.completedChunks.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <div className="mb-2">🎵</div>
            <p>No audio available for this story yet.</p>
            <p className="text-sm">Generate audio to start listening.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Main Player Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              Audio Player
              {isLoadingAudio && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {playlist.completedChunks.length} chunks
              </Badge>
              {showPlaylist && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullPlaylist(!showFullPlaylist)}
                >
                  <List className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Current Track Info */}
          {currentChunk && (
            <div className="text-sm text-muted-foreground">
              <p className="truncate">
                Chunk {(playlist.currentChunkIndex ?? 0) + 1}: {currentChunk.text.substring(0, 100)}...
              </p>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={playlist.duration}
              step={1}
              value={playlist.currentTime}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => playlist.seek(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer disabled:opacity-50"
              disabled={!currentChunk}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(playlist.currentTime)}</span>
              <span>{formatTime(playlist.duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShuffleMode(!isShuffleMode)}
              className={cn(isShuffleMode && "text-primary")}
              disabled={playlist.completedChunks.length <= 1}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={playlist.playPrevious}
              disabled={!playlist.canPlayPrevious}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="default"
              size="lg"
              onClick={playlist.togglePlayPause}
              className="h-12 w-12 rounded-full"
              disabled={!currentChunk}
            >
              {playlist.isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={playlist.playNext}
              disabled={!playlist.canPlayNext}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRepeatMode(!isRepeatMode)}
              className={cn(isRepeatMode && "text-primary")}
              disabled={playlist.completedChunks.length === 0}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={playlist.toggleMute}
            >
              {playlist.isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={playlist.volume * 100}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => playlist.changeVolume(Number(e.target.value) / 100)}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-muted-foreground w-8">
              {Math.round(playlist.volume * 100)}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Playlist */}
      {showPlaylist && showFullPlaylist && (
        <Card>
          <CardHeader>
            <CardTitle className="text-md flex items-center gap-2">
              Playlist
              {isLoadingAudio && playlist.completedChunks.length > 0 && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playlist.completedChunks.map((chunk, index) => (
                <div
                  key={chunk._id}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors",
                    playlist.currentChunkIndex === index && "bg-muted"
                  )}
                  onClick={() => playlist.playChunk(index)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {playlist.currentChunkIndex === index && playlist.isPlaying ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Chunk {index + 1}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {chunk.metadata?.duration ? formatTime(chunk.metadata.duration) : '--:--'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {chunk.text.substring(0, 80)}...
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Show skeleton items if still loading more chunks */}
              {isLoadingAudio && (
                <>
                  {[1, 2].map((i) => (
                    <div key={`skeleton-${i}`} className="flex items-center gap-3 p-2 rounded-md">
                      <Skeleton className="h-8 w-8" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-10" />
                        </div>
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {playlist.completedChunks.length} chunks 
                {isLoadingAudio && " (loading...)"}
              </span>
              <span>
                Total: {formatTime(
                  playlist.completedChunks.reduce((total, chunk) => 
                    total + (chunk.metadata?.duration || 0), 0
                  )
                )}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AudioPlayer 