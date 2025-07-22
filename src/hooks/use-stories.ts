import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GetAllStoriesParams, storiesService } from '@/services/stories-service'
import { queryKeys } from '@/utils/api'
import type { CreateStoryRequest } from '@/types'

// Hook to get all stories
export function useStories(params: GetAllStoriesParams) {
  return useQuery({
    queryKey: queryKeys.stories.all,
    queryFn: () => storiesService.getAllStories(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Hook to get a specific story
export function useStory(id: string) {
  return useQuery({
    queryKey: queryKeys.stories.detail(id),
    queryFn: () => storiesService.getStoryById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to upload a file
export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => storiesService.uploadFile(file),
    onError: (error: any) => {
      console.error('Error uploading file:', error)
    },
  })
}

// Hook to create a new story
export function useCreateStory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateStoryRequest) => storiesService.createStory(data),
    onSuccess: (newStory) => {
      // Invalidate and refetch stories list
      queryClient.invalidateQueries({ queryKey: queryKeys.stories.all })
      
      // Add the new story to the cache
      queryClient.setQueryData(
        queryKeys.stories.detail(newStory._id),
        newStory
      )
    },
    onError: (error: any) => {
      console.log("🚀 ~ useCreateStory ~ error:", error)
      console.error('Error creating story:', error)
    },
  })
}

// Hook to generate story with AI
export function useGenerateStory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, customPrompt }: { id: string; customPrompt?: string }) =>
      storiesService.generateStory(id, customPrompt),
    onSuccess: (updatedStory, { id }) => {
      // Update the story in cache
      queryClient.setQueryData(
        queryKeys.stories.detail(id),
        updatedStory
      )
      
      // Invalidate stories list to reflect changes
      queryClient.invalidateQueries({ queryKey: queryKeys.stories.all })
    },
    onError: (error: any) => {
      console.error('Error generating story:', error)
    },
  })
}

// Hook to delete a story (if needed in the future)
export function useDeleteStory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      // TODO: Implement deleteStory in storiesService
      throw new Error('Delete story not implemented yet')
    },
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.stories.detail(id) })
      
      // Invalidate stories list
      queryClient.invalidateQueries({ queryKey: queryKeys.stories.all })
    },
    onError: (error: any) => {
      console.error('Error deleting story:', error)
    },
  })
} 