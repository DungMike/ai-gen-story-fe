import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Volume2, 
  Image,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { 
  BatchProcessingEvent, 
  BatchProgressEvent, 
  BatchCompleteEvent, 
  BatchErrorEvent,
  AutoModeEvent 
} from '@/hooks/use-batch-socket'

export interface BatchProgressProps {
  batchId: string
  onBatchStart?: (event: BatchProcessingEvent) => void
  onBatchProgress?: (event: BatchProgressEvent) => void
  onBatchComplete?: (event: BatchCompleteEvent) => void
  onBatchError?: (event: BatchErrorEvent) => void
  onAutoModeStart?: (event: AutoModeEvent) => void
  onAutoModeProgress?: (event: AutoModeEvent) => void
  onAutoModeComplete?: (event: AutoModeEvent) => void
  onAutoModeError?: (event: AutoModeEvent) => void
}

export interface BatchStatus {
  status: 'idle' | 'processing' | 'completed' | 'failed' | 'paused'
  progress: number
  currentStory: number
  totalStories: number
  completedStories: number
  failedStories: number
  currentStep: 'story' | 'audio' | 'images'
  message: string
  estimatedTimeRemaining?: number
  errors: string[]
  storyIds: string[]
  autoModeEvents: AutoModeEvent[]
}

export const BatchProgress: React.FC<BatchProgressProps> = ({
  batchId,
  onBatchStart,
  onBatchProgress,
  onBatchComplete,
  onBatchError,
  onAutoModeStart,
  onAutoModeProgress,
  onAutoModeComplete,
  onAutoModeError
}) => {
  const [batchStatus, setBatchStatus] = useState<BatchStatus>({
    status: 'idle',
    progress: 0,
    currentStory: 0,
    totalStories: 0,
    completedStories: 0,
    failedStories: 0,
    currentStep: 'story',
    message: 'Waiting to start...',
    errors: [],
    storyIds: [],
    autoModeEvents: []
  })

  const [isPaused, setIsPaused] = useState(false)

  // Handle batch start
  useEffect(() => {
    if (onBatchStart) {
      const handleBatchStart = (event: BatchProcessingEvent) => {
        setBatchStatus(prev => ({
          ...prev,
          status: 'processing',
          totalStories: event.totalStories,
          message: `Starting batch processing for ${event.totalStories} stories...`,
          progress: 0,
          currentStory: 0,
          completedStories: 0,
          failedStories: 0,
          errors: [],
          storyIds: []
        }))
        onBatchStart(event)
      }
      return () => {
        // Cleanup if needed
      }
    }
  }, [onBatchStart])

  // Handle batch progress
  useEffect(() => {
    if (onBatchProgress) {
      const handleBatchProgress = (event: BatchProgressEvent) => {
        setBatchStatus(prev => ({
          ...prev,
          status: 'processing',
          progress: event.progress,
          currentStory: event.currentStory,
          message: event.message,
          estimatedTimeRemaining: calculateEstimatedTime(event.progress)
        }))
        onBatchProgress(event)
      }
      return () => {
        // Cleanup if needed
      }
    }
  }, [onBatchProgress])

  // Handle batch complete
  useEffect(() => {
    if (onBatchComplete) {
      const handleBatchComplete = (event: BatchCompleteEvent) => {
        setBatchStatus(prev => ({
          ...prev,
          status: 'completed',
          progress: 100,
          completedStories: event.completedStories,
          failedStories: event.failedStories,
          storyIds: event.storyIds,
          errors: event.errors,
          message: `Completed! ${event.completedStories} successful, ${event.failedStories} failed`
        }))
        onBatchComplete(event)
      }
      return () => {
        // Cleanup if needed
      }
    }
  }, [onBatchComplete])

  // Handle batch error
  useEffect(() => {
    if (onBatchError) {
      const handleBatchError = (event: BatchErrorEvent) => {
        setBatchStatus(prev => ({
          ...prev,
          status: 'failed',
          errors: [...prev.errors, event.error],
          message: `Error: ${event.error}`
        }))
        onBatchError(event)
      }
      return () => {
        // Cleanup if needed
      }
    }
  }, [onBatchError])

  // Handle auto mode events
  useEffect(() => {
    const handleAutoModeEvent = (event: AutoModeEvent) => {
      setBatchStatus(prev => ({
        ...prev,
        autoModeEvents: [...prev.autoModeEvents, event]
      }))
    }

    if (onAutoModeStart) {
      const handleAutoModeStart = (event: AutoModeEvent) => {
        handleAutoModeEvent(event)
        onAutoModeStart(event)
      }
    }

    if (onAutoModeProgress) {
      const handleAutoModeProgress = (event: AutoModeEvent) => {
        handleAutoModeEvent(event)
        onAutoModeProgress(event)
      }
    }

    if (onAutoModeComplete) {
      const handleAutoModeComplete = (event: AutoModeEvent) => {
        handleAutoModeEvent(event)
        onAutoModeComplete(event)
      }
    }

    if (onAutoModeError) {
      const handleAutoModeError = (event: AutoModeEvent) => {
        handleAutoModeEvent(event)
        onAutoModeError(event)
      }
    }
  }, [onAutoModeStart, onAutoModeProgress, onAutoModeComplete, onAutoModeError])

  // Calculate estimated time remaining
  const calculateEstimatedTime = (progress: number): number => {
    if (progress === 0) return 0
    const elapsed = Date.now() - (batchStatus.estimatedTimeRemaining || Date.now())
    const estimatedTotal = (elapsed / progress) * 100
    return Math.max(0, estimatedTotal - elapsed)
  }

  // Format time
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  // Get status icon
  const getStatusIcon = () => {
    switch (batchStatus.status) {
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  // Get step icon
  const getStepIcon = (step: string) => {
    switch (step) {
      case 'story':
        return <FileText className="w-4 h-4" />
      case 'audio':
        return <Volume2 className="w-4 h-4" />
      case 'images':
        return <Image className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  // Get status badge
  const getStatusBadge = () => {
    const variants = {
      idle: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    }

    return (
      <Badge className={cn('capitalize', variants[batchStatus.status])}>
        {batchStatus.status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <CardTitle>Batch Processing</CardTitle>
                <CardDescription>
                  Batch ID: {batchId}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-500">
                {batchStatus.progress.toFixed(1)}%
              </span>
            </div>
            <Progress value={batchStatus.progress} className="h-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {batchStatus.message}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {batchStatus.currentStory}/{batchStatus.totalStories}
              </div>
              <div className="text-xs text-gray-500">Current Story</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {batchStatus.completedStories}
              </div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {batchStatus.failedStories}
              </div>
              <div className="text-xs text-gray-500">Failed</div>
            </div>
            
            {batchStatus.estimatedTimeRemaining && batchStatus.estimatedTimeRemaining > 0 && (
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {formatTime(batchStatus.estimatedTimeRemaining)}
                </div>
                <div className="text-xs text-gray-500">Estimated Time</div>
              </div>
            )}
          </div>

          {/* Current Step */}
          {batchStatus.status === 'processing' && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              {getStepIcon(batchStatus.currentStep)}
              <div>
                <div className="font-medium text-sm">
                  Current Step: {batchStatus.currentStep.charAt(0).toUpperCase() + batchStatus.currentStep.slice(1)}
                </div>
                <div className="text-xs text-gray-500">
                  Processing story {batchStatus.currentStory} of {batchStatus.totalStories}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {batchStatus.status === 'processing' && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              
              <button
                onClick={() => {
                  setBatchStatus(prev => ({ ...prev, status: 'idle', progress: 0 }))
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auto Mode Events */}
      {batchStatus.autoModeEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5" />
              Auto Mode Events
            </CardTitle>
            <CardDescription>
              Real-time updates from auto mode processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {batchStatus.autoModeEvents.slice(-10).map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    {getStepIcon(event.step)}
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {event.step.charAt(0).toUpperCase() + event.step.slice(1)} - {event.message || 'Processing...'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    {event.progress && (
                      <div className="text-xs text-gray-500">
                        {event.progress}%
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Errors */}
      {batchStatus.errors.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="w-5 h-5" />
              Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {batchStatus.errors.map((error, index) => (
                <div key={index} className="flex items-start gap-2 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Stories */}
      {batchStatus.status === 'completed' && batchStatus.storyIds.length > 0 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="w-5 h-5" />
              Completed Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {batchStatus.storyIds.map((storyId, index) => (
                <div key={storyId} className="flex items-center gap-2 p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Story {index + 1}: {storyId}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 