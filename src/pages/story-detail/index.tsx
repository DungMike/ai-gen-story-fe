import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSocketContext } from '@/contexts/socket-context'
import { useStory } from '@/hooks/use-stories'
import { useAudioWebSocket } from '@/hooks/useAudioWebSocket'
import { useStoryAudio } from '@/hooks/useAudio'
import { useAudioPrefetch } from '@/hooks/useAudioQueries'
import AudioPlayer from '@/components/audio/AudioPlayer'
import AudioGeneration from '@/components/audio/AudioGeneration'
import { toast } from 'sonner'
import { Image as ImageIcon, Play, Volume2, Copy, CheckCircle, FileText, Music, Loader2 } from 'lucide-react'

function StoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isConnected, onStoryProcessing, offStoryProcessing } = useSocketContext()
  const { data: story, refetch } = useStory(id!)
  
  // ✅ Use useQuery-optimized audio hooks
  const { audioStats, isLoading: isAudioLoading } = useStoryAudio(id!)
  const { prefetchAudioChunks, prefetchVoiceOptions } = useAudioPrefetch()
  
  // Initialize audio WebSocket connection
  const audioWebSocket = useAudioWebSocket(id!)

  // ✅ Prefetch audio data for better performance
  useEffect(() => {
    if (id) {
      prefetchAudioChunks(id)
      prefetchVoiceOptions()
    }
  }, [id, prefetchAudioChunks, prefetchVoiceOptions])

  // WebSocket event handling for real-time updates
  useEffect(() => {
    if (isConnected && id) {
      onStoryProcessing((data) => {
        if (data.storyId === id) {
          console.log('Story processing event for current story:', data)
          
          if (data.event === 'story:processing:complete') {
            toast.success('Story updated with new content!')
            refetch()
          } else if (data.event === 'story:processing:error') {
            toast.error(`Story generation failed: ${data.error}`)
          }
        }
      })
    }

    return () => {
      offStoryProcessing()
    }
  }, [isConnected, id, onStoryProcessing, offStoryProcessing, refetch])

  if (!story) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading Story...</CardTitle>
            <CardDescription>Please wait while we load your story</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{story.title}</CardTitle>
              <CardDescription>View and manage your story</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={story?.status?.storyGenerated ? "default" : "secondary"}>
                {story?.status?.storyGenerated ? "Story Ready" : "Story Pending"}
              </Badge>
              <Badge variant={audioStats.hasAudio ? "default" : "secondary"} className="flex items-center gap-1">
                {isAudioLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                {audioStats.hasAudio ? "Audio Ready" : "Audio Pending"}
                {audioStats.totalChunks > 0 && (
                  <span className="ml-1">({audioStats.completedChunks}/{audioStats.totalChunks})</span>
                )}
              </Badge>
              <Badge variant={story?.status?.imagesGenerated ? "default" : "secondary"}>
                {story?.status?.imagesGenerated ? "Images Ready" : "Images Pending"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Story Status</h3>
              <div className="space-y-2">
                <div className="flex justify-start">
                  <span className='mr-2'>Story Generated:</span>
                  <span className={story?.status?.storyGenerated ? 'text-green-600' : 'text-yellow-600'}>
                    {story?.status?.storyGenerated ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-start">
                  <span className='mr-2'>Audio Generated:</span>
                  <span className={audioStats.hasAudio ? 'text-green-600' : 'text-yellow-600'}>
                    {audioStats.hasAudio ? 'Yes' : 'No'}
                    {audioStats.totalChunks > 0 && (
                      <span className="ml-1 text-xs">({audioStats.completedChunks}/{audioStats.totalChunks})</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-start">
                  <span className='mr-2'>Images Generated:</span>
                  <span className={story?.status?.imagesGenerated ? 'text-green-600' : 'text-yellow-600'}>
                    {story?.status?.imagesGenerated ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Story Metadata</h3>
              <div className="space-y-2">
                <div className="flex justify-start">
                  <span className='mr-2'>Original Word Count:</span>
                  <span>{story?.metadata?.originalWordCount}</span>
                </div>
                {story?.metadata?.generatedWordCount && (
                  <div className="flex justify-start">
                    <span className='mr-2'>Generated Word Count:</span>
                    <span>{story?.metadata?.generatedWordCount}</span>
                  </div>
                )}
                {story?.metadata?.processingTime && (
                  <div className="flex justify-start">
                    <span className='mr-2'>Processing Time:</span>
                    <span>{(story?.metadata?.processingTime / 1000).toFixed(1)}s</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {story.generatedContent && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Generated Content</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(story.generatedContent!)
                      .then(() => {
                        toast.success('Content copied to clipboard!')
                      })
                      .catch(() => {
                        toast.error('Failed to copy content')
                      })
                  }}
                  className="flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                <p className="whitespace-pre-wrap text-sm">{story.generatedContent}</p>
              </div>
            </div>
          )}

          {story.customPrompt && (
            <div>
              <h3 className="font-semibold mb-2">Custom Prompt</h3>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                {story.customPrompt}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button
              variant={story?.status?.storyGenerated ? "secondary" : "outline"}
              onClick={() => {
                if (!story?.status?.storyGenerated) {
                  navigate(`/generate-story/${id}`)
                }
              }}
              className={`flex items-center space-x-2 ${story?.status?.storyGenerated ? 'bg-green-500' : ''}`}
              disabled={story?.status?.storyGenerated}
            >
              {story?.status?.storyGenerated ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>
                {story?.status?.storyGenerated ? "Story Generated" : "Generate Story"}
              </span>
            </Button>
            <Button
              onClick={() => {
                if (!story?.status?.imagesGenerated) {
                  navigate(`/generate-images/${id}`)
                }
              }}
              className={`flex items-center space-x-2 ${story?.status?.imagesGenerated ? 'bg-green-500' : ''}`}
              variant={story?.status?.imagesGenerated ? "secondary" : "outline"}
              disabled={story?.status?.imagesGenerated}
            >
              {story?.status?.imagesGenerated ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
              <span>
                {story?.status?.imagesGenerated ? "Images Generated" : "Generate Images"}
              </span>
            </Button>
            
            <Button
              onClick={() => {
                navigate(`/generate-audio/${id}`)
              }}
              className={`flex items-center space-x-2 ${audioStats.hasAudio ? 'bg-green-500' : ''}`}
              variant={audioStats.hasAudio ? "secondary" : "outline"}
            >
              {isAudioLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : audioStats.hasAudio ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span>
                {audioStats.hasAudio ? "Audio Generated" : "Generate Audio"}
                {audioStats.totalChunks > 0 && ` (${audioStats.completedChunks}/${audioStats.totalChunks})`}
              </span>
            </Button>
            
          </div>
        </CardContent>
      </Card>

      {/* Audio Section - Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audio Generation Preview */}
        <AudioGeneration 
          storyId={id!}
          onAudioGenerated={() => {
            refetch()
            toast.success('Audio generated successfully!')
          }}
        />
        
        {/* Audio Player */}
        <AudioPlayer 
          storyId={id!}
          showPlaylist={true}
          autoPlay={false}
        />
      </div>
    </div>
  )
}

export default StoryDetailPage 