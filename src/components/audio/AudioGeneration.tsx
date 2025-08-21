// Audio Generation Component - UI for generating audio from story content (useQuery optimized)
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Pause,
  Download,
  Trash2,
  RefreshCw,
  Wand2,
  Volume2,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Play
} from 'lucide-react'
import { useAudioGenerationControls, useStoryAudio, useVoiceSelection } from '@/hooks/useAudio'
import { DEFAULT_WORD_PER_CHUNK } from '@/store/audio.store'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface AudioGenerationProps {
  storyId: string
  className?: string
  onAudioGenerated?: () => void
}

export const AudioGeneration: React.FC<AudioGenerationProps> = ({
  storyId,
  className,
  onAudioGenerated
}) => {
  const generation = useAudioGenerationControls()
  const storyAudio = useStoryAudio(storyId)
  const voiceSelection = useVoiceSelection()

  const [showVoiceSelector, setShowVoiceSelector] = useState(false)
  const [wordPerChunk, setWordPerChunk] = useState(DEFAULT_WORD_PER_CHUNK)

  // Handle generation completion
  useEffect(() => {
    if (generation.progress === 100 && !generation.isGenerating) {
      onAudioGenerated?.()
      toast.success('Audio generation completed!')
    }
  }, [generation.progress, generation.isGenerating, onAudioGenerated])

  const handleStartGeneration = async () => {
    await generation.generateAudio(storyId, voiceSelection.selectedVoice, wordPerChunk)
    setShowVoiceSelector(false)
  }

  const handleVoiceSelect = (voiceId: string) => {
    voiceSelection.selectVoice(voiceId)
  }

  const getStatusColor = () => {
    if (storyAudio.error) return 'destructive'
    if (generation.isGenerating) return 'default'
    if (storyAudio.audioStats.hasAudio) return 'default'
    return 'secondary'
  }

  const getStatusIcon = () => {
    if (storyAudio.error) return <AlertCircle className="h-4 w-4" />
    if (generation.isGenerating) return <Clock className="h-4 w-4" />
    if (storyAudio.audioStats.hasAudio) return <CheckCircle className="h-4 w-4" />
    return <Volume2 className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (storyAudio.error) return 'Error'
    if (generation.isGenerating) return 'Generating...'
    if (storyAudio.audioStats.hasAudio) return 'Ready'
    return 'Not Generated'
  }

  // Loading skeleton for voice options
  const VoiceOptionSkeleton = () => (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="p-3 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-5 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className={cn("space-y-4", className)}>
      {/* Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Audio Generation</CardTitle>
            <Badge variant={getStatusColor() as any} className="gap-1">
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Audio Statistics */}
          {storyAudio.isLoading && !storyAudio.audioChunks.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center space-y-2">
                  <Skeleton className="h-8 w-12 mx-auto" />
                  <Skeleton className="h-3 w-16 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-primary">
                  {generation.totalChunks || storyAudio.audioStats.totalChunks}
                </div>
                <div className="text-xs text-muted-foreground">Total Chunks</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {storyAudio.audioStats.completedChunks}
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-orange-600">
                  {storyAudio.audioStats.processingChunks}
                </div>
                <div className="text-xs text-muted-foreground">Processing</div>
              </div>
              <div className="text-center space-y-1">
                <div className="text-2xl font-bold text-red-600">
                  {storyAudio.audioStats.failedChunks}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {generation.isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{generation.currentStep || 'Processing...'}</span>
                <span>{Math.round(generation.progress || 0)}%</span>
              </div>
              <Progress value={generation.progress || 0} className="w-full" />
            </div>
          )}

          {/* Error Display */}
          {(storyAudio.error || generation.error) && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">
                  {String(storyAudio.error || generation.error || 'An error occurred')}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {!generation.isGenerating && (
              <>
                <Button
                  onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                  variant="default"
                  className="gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  Generate Audio
                </Button>

                {storyAudio.audioStats.hasAudio && (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          disabled={storyAudio.isDownloading}
                        >{storyAudio.isDownloading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                          Download Audio
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={storyAudio.downloadAllAudio}
                          disabled={storyAudio.isDownloading}
                        >
                          {storyAudio.isDownloading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Download all
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={storyAudio.openMergedAudio}
                          disabled={storyAudio.isDownloading || generation.isGenerating}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Open merged audio
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      onClick={storyAudio.deleteAllAudio}
                      variant="outline"
                      className="gap-2 text-destructive hover:text-destructive"
                      disabled={storyAudio.isDeleting}
                    >
                      {storyAudio.isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      Delete All
                    </Button>
                  </>
                )}

                <Button
                  onClick={() => storyAudio.refreshAudioChunks()}
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  disabled={storyAudio.isLoading}
                >
                  <RefreshCw className={cn("h-4 w-4", storyAudio.isLoading && "animate-spin")} />
                  Refresh
                </Button>
              </>
            )}

            {generation.isGenerating && (
              <Button
                onClick={generation.reset}
                variant="outline"
                className="gap-2"
              >
                <Pause className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Voice Selection Card */}
      {showVoiceSelector && !generation.isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              Audio Generation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wordPerChunk">Voice Selection</Label>
              <Select value={voiceSelection.selectedVoice} onValueChange={handleVoiceSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Voice Selection" />
                </SelectTrigger>
                <SelectContent>
                  {voiceSelection.voiceOptions.map((voice) => (
                    <SelectItem key={voice} value={voice}>{voice}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Settings */}
            {/* <Separator /> */}
            <div className="space-y-2">
              <Label htmlFor="wordPerChunk">Words per Chunk</Label>
              <Input
                id="wordPerChunk"
                type="number"
                min={100}
                max={1000}
                step={50}
                value={wordPerChunk}
                onChange={(e) => setWordPerChunk(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">
                Recommended: 300-700 words per chunk for optimal audio quality
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowVoiceSelector(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartGeneration}
                className="gap-2"
                disabled={generation.isGenerating}
              >
                <Wand2 className="h-4 w-4" />
                Start Generation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AudioGeneration 