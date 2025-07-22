import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useStories, useCreateStory, useUpdateStory, useInfiniteStories } from '@/hooks/use-api-examples'
import { useUploadFile } from '@/hooks/use-stories'
import { toast } from 'sonner'

// Example 1: Basic Stories List with React Query
export function StoriesList() {
  const { data: stories, isLoading, error, refetch } = useStories()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-destructive mb-4">Failed to load stories</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Stories ({stories?.length || 0})</h2>
        <Button onClick={() => refetch()}>Refresh</Button>
      </div>
      
      {stories?.map((story) => (
        <Card key={story._id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{story.title}</CardTitle>
                <CardDescription>
                  Created {new Date(story.createdAt).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant={story.status.storyGenerated ? "default" : "secondary"}>
                  {story.status.storyGenerated ? "Generated" : "Pending"}
                </Badge>
                <Badge variant="outline">{story.style.genre}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {story.originalContent.substring(0, 200)}...
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline">
                View Details
              </Button>
              <Button size="sm" variant="outline">
                Generate Audio
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Example 2: Infinite Scroll Stories List
export function InfiniteStoriesList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteStories(5)

  const stories = data?.pages.flatMap(page => page.data) || []

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Infinite Stories</h2>
      
      {stories.map((story) => (
        <Card key={story._id}>
          <CardHeader>
            <CardTitle>{story.title}</CardTitle>
            <CardDescription>
              {story.style.genre} • {story.style.tone}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {story.originalContent.substring(0, 150)}...
            </p>
          </CardContent>
        </Card>
      ))}
      
      {hasNextPage && (
        <div className="text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}

// Example 3: Story Creation with React Query
export function CreateStoryForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const createStoryMutation = useCreateStory()
  const uploadFileMutation = useUploadFile()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim() || !file) {
      toast.error('Please fill in all fields and select a file')
      return
    }

    try {
      // First upload the file
      const uploadResult = await uploadFileMutation.mutateAsync(file)
      
      // Then create the story with the file URL
      await createStoryMutation.mutateAsync({
        title,
        customPrompt: content,
        fileUrl: uploadResult.fileUrl
      })
      
      toast.success('Story created successfully!')
      setTitle('')
      setContent('')
      setFile(null)
    } catch (error) {
      toast.error('Failed to create story')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Story</CardTitle>
        <CardDescription>
          Use React Query to create stories with automatic cache updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter story title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">File</label>
            <input
              type="file"
              accept=".txt,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded h-32"
              placeholder="Enter story content"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={createStoryMutation.isPending}
          >
            {createStoryMutation.isPending ? 'Creating...' : 'Create Story'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Example 4: Story Update with Optimistic Updates
export function StoryUpdateForm({ storyId }: { storyId: string }) {
  const [title, setTitle] = useState('')
  const updateStoryMutation = useUpdateStory()

  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    try {
      await updateStoryMutation.mutateAsync({
        id: storyId,
        data: { title }
      })
      
      toast.success('Story updated successfully!')
      setTitle('')
    } catch (error) {
      toast.error('Failed to update story')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Story</CardTitle>
        <CardDescription>
          Optimistic updates with automatic rollback on error
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">New Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter new title"
            />
          </div>
          
          <Button 
            onClick={handleUpdate}
            disabled={updateStoryMutation.isPending}
          >
            {updateStoryMutation.isPending ? 'Updating...' : 'Update Story'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 