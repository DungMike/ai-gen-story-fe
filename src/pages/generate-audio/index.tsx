import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Volume2, Play, Download, Loader2 } from 'lucide-react'
import { useStory } from '@/hooks/use-stories'
import { useAudioWebSocket } from '@/hooks/useAudioWebSocket'
import { useStoryAudio } from '@/hooks/useAudio'
import { useAudioPrefetch } from '@/hooks/useAudioQueries'
import AudioPlayer from '@/components/audio/AudioPlayer'
import AudioGeneration from '@/components/audio/AudioGeneration'
import { toast } from 'sonner'

function GenerateAudioPage() {
  const { storyId } = useParams<{ storyId: string }>()
  const navigate = useNavigate()
  const { data: story, refetch, isLoading: isStoryLoading } = useStory(storyId!)
  
  // ✅ Use useQuery-optimized hooks
  const { audioStats, isLoading: isAudioLoading } = useStoryAudio(storyId!)
  const { prefetchAudioChunks, prefetchVoiceOptions } = useAudioPrefetch()
  
  // Initialize audio WebSocket connection
  const audioWebSocket = useAudioWebSocket(storyId!)
  
  const [isAudioGenerated, setIsAudioGenerated] = useState(false)

  // ✅ Prefetch audio data for better performance
  useEffect(() => {
    if (storyId) {
      prefetchAudioChunks(storyId)
      prefetchVoiceOptions()
    }
  }, [storyId, prefetchAudioChunks, prefetchVoiceOptions])

  useEffect(() => {
    // Check if we have story data
    if (!story) return
    
    // Check if story has generated content
    if (!story.generatedContent) {
      toast.error('Story content must be generated first')
      navigate(`/story/${storyId}`)
      return
    }
    
    // Update audio generation status using audioStats
    setIsAudioGenerated(audioStats.hasAudio || !!story?.status?.audioGenerated)
  }, [story, storyId, navigate, audioStats.hasAudio])

  const handleAudioGenerated = () => {
    setIsAudioGenerated(true)
    refetch()
    toast.success('Audio generation completed successfully!')
  }

  const handleBackToStory = () => {
    navigate(`/story/${storyId}`)
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-24" />
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center p-4 bg-muted rounded-lg space-y-2">
                  <Skeleton className="h-6 w-24 mx-auto" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  )

  // Show loading skeleton while story is loading
  if (isStoryLoading || !story) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToStory}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Story
                </Button>
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Volume2 className="h-6 w-6 text-purple-600" />
                    Generate Audio
                    {isAudioLoading && (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    )}
                  </CardTitle>
                  <CardDescription>
                    Convert your story to high-quality audio with AI voices
                  </CardDescription>
                </div>
              </div>
              <Badge 
                variant={isAudioGenerated ? "default" : "secondary"}
                className="gap-1"
              >
                <Volume2 className="h-3 w-3" />
                {isAudioGenerated ? "Audio Ready" : "No Audio"}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-lg">{story.title}</h3>
                <p className="text-sm text-muted-foreground">Story Title</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-lg">
                  {story.metadata?.generatedWordCount || story.metadata?.originalWordCount || 0}
                </h3>
                <p className="text-sm text-muted-foreground">Word Count</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-lg">
                  {audioStats.totalChunks || 0}
                </h3>
                <p className="text-sm text-muted-foreground">Audio Chunks</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <h3 className="font-semibold text-lg">
                  {audioStats.hasAudio ? 'Ready' : 'Pending'}
                </h3>
                <p className="text-sm text-muted-foreground">Audio Status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Story Content Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Story Content</CardTitle>
            <CardDescription>
              Preview of the content that will be converted to audio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap">
                {story.generatedContent?.substring(0, 500)}
                {story.generatedContent && story.generatedContent.length > 500 && '...'}
              </p>
            </div>
            {story.generatedContent && story.generatedContent.length > 500 && (
              <p className="text-xs text-muted-foreground mt-2">
                Showing first 500 characters of {story.generatedContent.length} total characters
              </p>
            )}
          </CardContent>
        </Card>

        {/* Audio Generation & Player */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Audio Generation Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Audio Generation
                </CardTitle>
                <CardDescription>
                  Configure and generate audio from your story content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AudioGeneration 
                  storyId={storyId!}
                  onAudioGenerated={handleAudioGenerated}
                />
              </CardContent>
            </Card>
          </div>

          {/* Audio Player */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Audio Player
                </CardTitle>
                <CardDescription>
                  Listen to your generated audio content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AudioPlayer 
                  storyId={storyId!}
                  showPlaylist={true}
                  autoPlay={false}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                {isAudioLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Audio generation uses advanced AI to create natural-sounding speech from your story content.
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleBackToStory}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Story
                </Button>
                {isAudioGenerated && (
                  <Button
                    onClick={() => {
                      // This will be handled by AudioGeneration component
                      toast.info('Use the download button in the Audio Generation section')
                    }}
                    className="gap-2"
                    variant="default"
                  >
                    <Download className="h-4 w-4" />
                    Download Audio
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GenerateAudioPage 