import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { apiClient, queryKeys } from '@/utils/api'
import type { CreateStoryRequest } from '@/types'

// Define StoryResponse type locally for this example
interface StoryResponse {
  _id: string
  title: string
  originalContent: string
  generatedContent?: string
  customPrompt?: string
  style: {
    genre: string
    tone: string
    length: string
    targetAudience: string
  }
  status: {
    storyGenerated: boolean
    audioGenerated: boolean
    imagesGenerated: boolean
  }
  metadata: {
    originalWordCount: number
    generatedWordCount?: number
    processingTime?: number
  }
  files: {
    originalFile: string
    generatedFile?: string
  }
  createdAt: string
  updatedAt: string
}

// ============================================================================
// BASIC QUERY PATTERNS
// ============================================================================

// 1. Simple GET request
export function useStories() {
  return useQuery({
    queryKey: queryKeys.stories.all,
    queryFn: () => apiClient.get<StoryResponse[]>('/stories'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

// 2. Query with parameters
export function useStory(id: string) {
  return useQuery({
    queryKey: queryKeys.stories.detail(id),
    queryFn: () => apiClient.get<StoryResponse>(`/stories/${id}`),
    enabled: !!id, // Only run if id exists
    staleTime: 10 * 60 * 1000,
  })
}

// 3. Query with filters
export function useStoriesWithFilters(filters: { genre?: string; status?: string }) {
  return useQuery({
    queryKey: queryKeys.stories.list(filters),
    queryFn: () => apiClient.get<StoryResponse[]>('/stories', { params: filters }),
    staleTime: 2 * 60 * 1000,
  })
}

// ============================================================================
// MUTATION PATTERNS
// ============================================================================

// 4. Simple mutation
export function useCreateStory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateStoryRequest) => apiClient.post<StoryResponse>('/stories', data),
    onSuccess: (newStory) => {
      // Invalidate and refetch stories list
      queryClient.invalidateQueries({ queryKey: queryKeys.stories.all })
      
      // Add to cache immediately
      queryClient.setQueryData(
        queryKeys.stories.detail(newStory._id),
        newStory
      )
      
      // Show success message
      // toast.success('Story created successfully!')
    },
    onError: (error: any) => {
      console.error('Error creating story:', error)
      // toast.error('Failed to create story')
    },
  })
}

// 5. Mutation with optimistic updates
export function useUpdateStory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StoryResponse> }) =>
      apiClient.put<StoryResponse>(`/stories/${id}`, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.stories.detail(id) })
      
      // Snapshot previous value
      const previousStory = queryClient.getQueryData<StoryResponse>(
        queryKeys.stories.detail(id)
      )
      
      // Optimistically update
      queryClient.setQueryData<StoryResponse>(
        queryKeys.stories.detail(id),
        (old) => old ? { ...old, ...data } : undefined
      )
      
      return { previousStory }
    },
    onError: (_err, { id }, context) => {
      // Rollback on error
      if (context?.previousStory) {
        queryClient.setQueryData(
          queryKeys.stories.detail(id),
          context.previousStory
        )
      }
    },
    onSettled: (_, __, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.stories.detail(id) })
    },
  })
}

// 6. Mutation with dependent queries
export function useGenerateStory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, customPrompt }: { id: string; customPrompt?: string }) =>
      apiClient.post<StoryResponse>(`/stories/${id}/generate`, { customPrompt }),
    onSuccess: (updatedStory, { id }) => {
      // Update the story in cache
      queryClient.setQueryData(
        queryKeys.stories.detail(id),
        updatedStory
      )
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.stories.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats })
    },
  })
}

// ============================================================================
// INFINITE QUERY PATTERNS
// ============================================================================

// 7. Infinite query for pagination
export function useInfiniteStories(pageSize = 10) {
  return useInfiniteQuery({
    queryKey: queryKeys.stories.all,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      apiClient.get<{ data: StoryResponse[]; total: number; page: number }>(
        '/stories',
        { params: { page: pageParam, limit: pageSize } }
      ),
    getNextPageParam: (lastPage) => {
      const { page, total } = lastPage
      const hasNextPage = page * pageSize < total
      return hasNextPage ? page + 1 : undefined
    },
    getPreviousPageParam: (firstPage) => {
      const { page } = firstPage
      return page > 1 ? page - 1 : undefined
    },
    staleTime: 5 * 60 * 1000,
  })
}

// ============================================================================
// ADVANCED PATTERNS
// ============================================================================

// 8. Query with retry logic
export function useStoriesWithRetry() {
  return useQuery({
    queryKey: queryKeys.stories.all,
    queryFn: () => apiClient.get<StoryResponse[]>('/stories'),
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

// 9. Query with background refetching
export function useStoriesWithBackgroundRefetch() {
  return useQuery({
    queryKey: queryKeys.stories.all,
    queryFn: () => apiClient.get<StoryResponse[]>('/stories'),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: false, // Only when window is focused
  })
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

// 11. Batch mutations
export function useBatchDeleteStories() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ids: string[]) =>
      apiClient.post('/stories/batch-delete', { ids }),
    onSuccess: (_, ids) => {
      // Remove from cache
      ids.forEach(id => {
        queryClient.removeQueries({ queryKey: queryKeys.stories.detail(id) })
      })
      
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.stories.all })
    },
  })
}

// ============================================================================
// CUSTOM HOOKS WITH BUSINESS LOGIC
// ============================================================================

// 12. Custom hook with business logic
export function useStoryWithAnalytics(id: string) {
  const storyQuery = useStory(id)
  const analyticsQuery = useQuery({
    queryKey: ['analytics', 'story', id],
    queryFn: () => apiClient.get(`/analytics/stories/${id}`),
    enabled: !!id && storyQuery.isSuccess,
  })
  
  return {
    story: storyQuery.data,
    analytics: analyticsQuery.data,
    isLoading: storyQuery.isLoading || analyticsQuery.isLoading,
    error: storyQuery.error || analyticsQuery.error,
  }
}

// 13. Hook with multiple dependent queries
export function useStoryWithRelatedData(id: string) {
  const storyQuery = useStory(id)
  const audioQuery = useQuery({
    queryKey: ['audio', 'story', id],
    queryFn: () => apiClient.get(`/audio/${id}/chunks`),
    enabled: !!id && storyQuery.isSuccess && storyQuery.data?.status.audioGenerated,
  })
  const imagesQuery = useQuery({
    queryKey: ['images', 'story', id],
    queryFn: () => apiClient.get(`/images/${id}/chunks`),
    enabled: !!id && storyQuery.isSuccess && storyQuery.data?.status.imagesGenerated,
  })
  
  return {
    story: storyQuery.data,
    audio: audioQuery.data,
    images: imagesQuery.data,
    isLoading: storyQuery.isLoading || audioQuery.isLoading || imagesQuery.isLoading,
    error: storyQuery.error || audioQuery.error || imagesQuery.error,
  }
}

// ============================================================================
// ERROR HANDLING PATTERNS
// ============================================================================

// 14. Query with custom error handling
export function useStoriesWithErrorHandling() {
  return useQuery({
    queryKey: queryKeys.stories.all,
    queryFn: async () => {
      try {
        return await apiClient.get<StoryResponse[]>('/stories')
      } catch (error: any) {
        if (error.response?.status === 401) {
          // Handle unauthorized
          throw new Error('Please log in to view stories')
        }
        if (error.response?.status === 403) {
          // Handle forbidden
          throw new Error('You do not have permission to view stories')
        }
        throw error
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('log in') || error.message.includes('permission')) {
        return false
      }
      return failureCount < 3
    },
  })
}

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

// 15. Custom cache management
export function useStoriesWithCacheManagement() {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: queryKeys.stories.all,
    queryFn: () => apiClient.get<StoryResponse[]>('/stories'),
  })
  
  const prefetchStory = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.stories.detail(id),
      queryFn: () => apiClient.get<StoryResponse>(`/stories/${id}`),
      staleTime: 5 * 60 * 1000,
    })
  }
  
  const clearCache = () => {
    queryClient.clear()
  }
  
  return {
    ...query,
    prefetchStory,
    clearCache,
  }
} 