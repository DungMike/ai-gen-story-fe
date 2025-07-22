# React Query Implementation Guide

## 🚀 Overview

React Query (TanStack Query) is a powerful library for managing server state in React applications. It provides caching, background updates, and optimistic updates out of the box.

## 📋 Table of Contents

1. [Basic Setup](#basic-setup)
2. [Query Patterns](#query-patterns)
3. [Mutation Patterns](#mutation-patterns)
4. [Advanced Patterns](#advanced-patterns)
5. [Best Practices](#best-practices)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)

## 🔧 Basic Setup

### 1. Install Dependencies
```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

### 2. Setup Query Client
```typescript
// src/providers/query-provider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      retry: false,
    },
  },
})

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### 3. Wrap Your App
```typescript
// src/App.tsx
import { QueryProvider } from '@/providers/query-provider'

function App() {
  return (
    <QueryProvider>
      {/* Your app components */}
    </QueryProvider>
  )
}
```

## 🔍 Query Patterns

### 1. Basic Query
```typescript
import { useQuery } from '@tanstack/react-query'

function StoriesList() {
  const { data: stories, isLoading, error, refetch } = useQuery({
    queryKey: ['stories'],
    queryFn: () => apiClient.get('/stories'),
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {stories?.map(story => (
        <div key={story.id}>{story.title}</div>
      ))}
    </div>
  )
}
```

### 2. Query with Parameters
```typescript
function StoryDetail({ id }: { id: string }) {
  const { data: story, isLoading } = useQuery({
    queryKey: ['stories', id],
    queryFn: () => apiClient.get(`/stories/${id}`),
    enabled: !!id, // Only run if id exists
  })

  if (isLoading) return <div>Loading...</div>
  if (!story) return <div>Story not found</div>

  return <div>{story.title}</div>
}
```

### 3. Query with Filters
```typescript
function StoriesWithFilters({ genre, status }: { genre?: string; status?: string }) {
  const { data: stories } = useQuery({
    queryKey: ['stories', 'list', { genre, status }],
    queryFn: () => apiClient.get('/stories', { params: { genre, status } }),
  })

  return (
    <div>
      {stories?.map(story => (
        <div key={story.id}>{story.title}</div>
      ))}
    </div>
  )
}
```

### 4. Infinite Query (Pagination)
```typescript
import { useInfiniteQuery } from '@tanstack/react-query'

function InfiniteStoriesList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['stories'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      apiClient.get('/stories', { params: { page: pageParam, limit: 10 } }),
    getNextPageParam: (lastPage) => {
      const { page, total } = lastPage
      return page * 10 < total ? page + 1 : undefined
    },
  })

  const stories = data?.pages.flatMap(page => page.data) || []

  return (
    <div>
      {stories.map(story => (
        <div key={story.id}>{story.title}</div>
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  )
}
```

## ✏️ Mutation Patterns

### 1. Basic Mutation
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

function CreateStoryForm() {
  const queryClient = useQueryClient()
  const createStoryMutation = useMutation({
    mutationFn: (data) => apiClient.post('/stories', data),
    onSuccess: (newStory) => {
      // Invalidate and refetch stories list
      queryClient.invalidateQueries({ queryKey: ['stories'] })
      
      // Add to cache immediately
      queryClient.setQueryData(['stories', newStory.id], newStory)
      
      toast.success('Story created successfully!')
    },
    onError: (error) => {
      toast.error('Failed to create story')
    },
  })

  const handleSubmit = async (formData) => {
    await createStoryMutation.mutateAsync(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={createStoryMutation.isPending}>
        {createStoryMutation.isPending ? 'Creating...' : 'Create Story'}
      </button>
    </form>
  )
}
```

### 2. Mutation with Optimistic Updates
```typescript
function UpdateStoryForm({ storyId }: { storyId: string }) {
  const queryClient = useQueryClient()
  const updateStoryMutation = useMutation({
    mutationFn: ({ id, data }) => apiClient.put(`/stories/${id}`, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['stories', id] })
      
      // Snapshot previous value
      const previousStory = queryClient.getQueryData(['stories', id])
      
      // Optimistically update
      queryClient.setQueryData(['stories', id], (old) => 
        old ? { ...old, ...data } : undefined
      )
      
      return { previousStory }
    },
    onError: (err, { id }, context) => {
      // Rollback on error
      if (context?.previousStory) {
        queryClient.setQueryData(['stories', id], context.previousStory)
      }
    },
    onSettled: (_, __, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['stories', id] })
    },
  })

  return (
    <button
      onClick={() => updateStoryMutation.mutateAsync({ id: storyId, data: { title: 'New Title' } })}
      disabled={updateStoryMutation.isPending}
    >
      {updateStoryMutation.isPending ? 'Updating...' : 'Update Story'}
    </button>
  )
}
```

### 3. Batch Mutations
```typescript
function BatchDeleteStories() {
  const queryClient = useQueryClient()
  const batchDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => apiClient.post('/stories/batch-delete', { ids }),
    onSuccess: (_, ids) => {
      // Remove from cache
      ids.forEach(id => {
        queryClient.removeQueries({ queryKey: ['stories', id] })
      })
      
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: ['stories'] })
    },
  })

  return (
    <button
      onClick={() => batchDeleteMutation.mutateAsync(['1', '2', '3'])}
      disabled={batchDeleteMutation.isPending}
    >
      {batchDeleteMutation.isPending ? 'Deleting...' : 'Delete Selected'}
    </button>
  )
}
```

## 🎯 Advanced Patterns

### 1. Dependent Queries
```typescript
function StoryWithAnalytics({ storyId }: { storyId: string }) {
  const storyQuery = useQuery({
    queryKey: ['stories', storyId],
    queryFn: () => apiClient.get(`/stories/${storyId}`),
  })

  const analyticsQuery = useQuery({
    queryKey: ['analytics', 'story', storyId],
    queryFn: () => apiClient.get(`/analytics/stories/${storyId}`),
    enabled: !!storyId && storyQuery.isSuccess, // Only run if story is loaded
  })

  return {
    story: storyQuery.data,
    analytics: analyticsQuery.data,
    isLoading: storyQuery.isLoading || analyticsQuery.isLoading,
    error: storyQuery.error || analyticsQuery.error,
  }
}
```

### 2. Custom Hooks with Business Logic
```typescript
function useStoryWithRelatedData(storyId: string) {
  const storyQuery = useQuery({
    queryKey: ['stories', storyId],
    queryFn: () => apiClient.get(`/stories/${storyId}`),
  })

  const audioQuery = useQuery({
    queryKey: ['audio', 'story', storyId],
    queryFn: () => apiClient.get(`/audio/${storyId}/chunks`),
    enabled: !!storyId && storyQuery.isSuccess && storyQuery.data?.status.audioGenerated,
  })

  const imagesQuery = useQuery({
    queryKey: ['images', 'story', storyId],
    queryFn: () => apiClient.get(`/images/${storyId}/chunks`),
    enabled: !!storyId && storyQuery.isSuccess && storyQuery.data?.status.imagesGenerated,
  })

  return {
    story: storyQuery.data,
    audio: audioQuery.data,
    images: imagesQuery.data,
    isLoading: storyQuery.isLoading || audioQuery.isLoading || imagesQuery.isLoading,
    error: storyQuery.error || audioQuery.error || imagesQuery.error,
  }
}
```

### 3. Query with Retry Logic
```typescript
function useStoriesWithRetry() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: () => apiClient.get('/stories'),
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
```

### 4. Background Refetching
```typescript
function useStoriesWithBackgroundRefetch() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: () => apiClient.get('/stories'),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: false, // Only when window is focused
  })
}
```

## 🛡️ Error Handling

### 1. Global Error Handling
```typescript
// In your QueryClient setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) {
          // Redirect to login
          window.location.href = '/login'
          return false
        }
        return failureCount < 3
      },
    },
    mutations: {
      onError: (error: any) => {
        const message = error?.response?.data?.message || error?.message || 'An error occurred'
        toast.error(message)
      },
    },
  },
})
```

### 2. Custom Error Handling
```typescript
function useStoriesWithErrorHandling() {
  return useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      try {
        return await apiClient.get('/stories')
      } catch (error: any) {
        if (error.response?.status === 401) {
          throw new Error('Please log in to view stories')
        }
        if (error.response?.status === 403) {
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
```

## ⚡ Performance Optimization

### 1. Cache Management
```typescript
function useStoriesWithCacheManagement() {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['stories'],
    queryFn: () => apiClient.get('/stories'),
  })
  
  const prefetchStory = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: ['stories', id],
      queryFn: () => apiClient.get(`/stories/${id}`),
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
```

### 2. Selective Invalidation
```typescript
// Instead of invalidating all stories
queryClient.invalidateQueries({ queryKey: ['stories'] })

// Invalidate specific stories
queryClient.invalidateQueries({ 
  queryKey: ['stories'],
  predicate: (query) => query.queryKey[1] === storyId 
})

// Remove specific queries from cache
queryClient.removeQueries({ queryKey: ['stories', storyId] })
```

### 3. Optimistic Updates
```typescript
// Update cache immediately without waiting for server response
queryClient.setQueryData(['stories', id], (old) => ({
  ...old,
  title: newTitle,
  updatedAt: new Date().toISOString(),
}))
```

## 📚 Best Practices

### 1. Query Key Structure
```typescript
// Good: Hierarchical and descriptive
['stories']                    // All stories
['stories', 'list']           // Stories list with filters
['stories', 'detail', id]     // Specific story
['stories', 'search', term]   // Search results

// Bad: Flat and unclear
['data']
['items']
['stuff']
```

### 2. Stale Time Configuration
```typescript
// Frequently changing data
staleTime: 0 // Always refetch

// Semi-static data
staleTime: 5 * 60 * 1000 // 5 minutes

// Static data
staleTime: 30 * 60 * 1000 // 30 minutes

// Never changing data
staleTime: Infinity
```

### 3. Error Boundaries
```typescript
import { ErrorBoundary } from 'react-error-boundary'

function App() {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong</div>}
      onError={(error) => {
        // Log error to monitoring service
        console.error('App error:', error)
      }}
    >
      <QueryProvider>
        {/* Your app */}
      </QueryProvider>
    </ErrorBoundary>
  )
}
```

### 4. Loading States
```typescript
function StoriesList() {
  const { data: stories, isLoading, isFetching, error } = useQuery({
    queryKey: ['stories'],
    queryFn: () => apiClient.get('/stories'),
  })

  if (isLoading) {
    return <div>Loading stories...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      {isFetching && <div>Refreshing...</div>}
      {stories?.map(story => (
        <div key={story.id}>{story.title}</div>
      ))}
    </div>
  )
}
```

## 🎯 Summary

React Query provides:

- ✅ **Automatic Caching**: Data is cached and shared across components
- ✅ **Background Updates**: Data stays fresh automatically
- ✅ **Optimistic Updates**: UI updates immediately while API calls happen
- ✅ **Error Handling**: Centralized error management
- ✅ **Loading States**: Built-in loading indicators
- ✅ **DevTools**: Debug queries and mutations in development
- ✅ **TypeScript Support**: Full type safety
- ✅ **Performance**: Optimized for React rendering

This guide covers the most common patterns and best practices for implementing React Query in your application. Start with the basic patterns and gradually add more advanced features as needed. 