import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUploadZone, type UploadedFile } from '@/components/batch-processing/FileUploadZone'
import { BatchConfigForm, type BatchConfigFormData } from '@/components/batch-processing/BatchConfigForm'
import { BatchProgress } from '@/components/batch-processing/BatchProgress'
import { useBatchUpload, useBatchCreate } from '@/hooks/use-batch-processing'
import { useBatchSocket } from '@/hooks/use-batch-socket'
import { useToast } from '@/hooks/use-toast'
import type {
  BatchProcessingEvent,
  BatchProgressEvent,
  BatchCompleteEvent,
  BatchErrorEvent,
  AutoModeEvent
} from '@/hooks/use-batch-socket'

function BatchProcessingPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [showConfigForm, setShowConfigForm] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [batchId, setBatchId] = useState<string | null>(null)

  const batchUploadMutation = useBatchUpload()
  const batchCreateMutation = useBatchCreate()
  const { toast } = useToast()

  // Memoized callback functions to prevent unnecessary re-renders
  const onBatchStart = useCallback((event: BatchProcessingEvent) => {
    console.log('Batch started:', event)
    toast({
      title: "Batch Processing Started",
      description: `Processing ${event.totalStories} stories...`,
      variant: "info"
    })
  }, [toast])

  const onBatchProgress = useCallback((event: BatchProgressEvent) => {
    console.log('Batch progress:', event)
  }, [])

  const onBatchComplete = useCallback((event: BatchCompleteEvent) => {
    console.log('Batch completed:', event)
    toast({
      title: "Batch Processing Completed",
      description: `${event.completedStories} successful, ${event.failedStories} failed`,
      variant: event.failedStories > 0 ? "warning" : "success"
    })
  }, [toast])

  const onBatchError = useCallback((event: BatchErrorEvent) => {
    console.log('Batch error:', event)
    toast({
      title: "Batch Processing Error",
      description: event.error,
      variant: "destructive"
    })
  }, [toast])

  const onAutoModeStart = useCallback((event: AutoModeEvent) => {
    console.log('Auto mode started:', event)
  }, [])

  const onAutoModeProgress = useCallback((event: AutoModeEvent) => {
    console.log('Auto mode progress:', event)
  }, [])

  const onAutoModeComplete = useCallback((event: AutoModeEvent) => {
    console.log('Auto mode completed:', event)
  }, [])

  const onAutoModeError = useCallback((event: AutoModeEvent) => {
    console.log('Auto mode error:', event)
    toast({
      title: "Auto Mode Error",
      description: event.error || "An error occurred during auto mode processing",
      variant: "destructive"
    })
  }, [toast])

  // WebSocket integration
  const { isConnected, connectionError } = useBatchSocket({
    batchId: batchId || undefined,
    onBatchStart,
    onBatchProgress,
    onBatchComplete,
    onBatchError,
    onAutoModeStart,
    onAutoModeProgress,
    onAutoModeComplete,
    onAutoModeError
  })

  const handleFilesChange = (files: UploadedFile[]) => {
    setUploadedFiles(files)
  }

  const handleUploadFiles = async () => {
    if (uploadedFiles.length === 0) return

    const filesToUpload = uploadedFiles.filter(file => file.status === 'pending')
    if (filesToUpload.length === 0) return

    try {
      // Update files to uploading status
      const updatedFiles = uploadedFiles.map(file =>
        filesToUpload.some(uploadFile => uploadFile.id === file.id)
          ? { ...file, status: 'uploading' as const, progress: 0 }
          : file
      )
      setUploadedFiles(updatedFiles)

      // Upload files with progress tracking
      const files = filesToUpload.map(file => file.file)
      const result = await batchUploadMutation.mutateAsync({
        files,
        onProgress: (progress) => {
          // Update individual file progress
          setUploadedFiles(prev =>
            prev.map(file =>
              filesToUpload.some(uploadFile => uploadFile.id === file.id)
                ? { ...file, progress }
                : file
            )
          )
        }
      })

      // Update files with uploaded URLs
      const finalFiles = uploadedFiles.map(file => {

        // Try to match by file name first
        let uploadedFile = result.files.find(uploaded => uploaded.fileName === file.file.name)

        // If not found by name, try to match by file size
        if (!uploadedFile) {
          uploadedFile = result.files.find(uploaded => uploaded.fileSize === file.file.size)
        }

        // If still not found, try to match by file path (extract filename from path)
        if (!uploadedFile) {
          uploadedFile = result.files.find(uploaded => {
            const pathFileName = uploaded.filePath?.split('/').pop()?.split('_').slice(0, -2).join('_')
            const originalFileName = file.file.name.replace(/\.[^/.]+$/, '') // Remove extension
            return pathFileName === originalFileName
          })
        }

        // If still not found, try to match by file size and similar name
        if (!uploadedFile) {
          uploadedFile = result.files.find(uploaded => {
            const sizeMatch = uploaded.fileSize === file.file.size
            const nameSimilar = uploaded.fileName.includes(file.file.name.substring(0, 10)) ||
              file.file.name.includes(uploaded.fileName.substring(0, 10))
            return sizeMatch && nameSimilar
          })
        }


        if (uploadedFile) {
          return {
            ...file,
            status: 'completed' as const,
            progress: 100,
            uploadedUrl: uploadedFile.fileUrl
          }
        }

        // If no match found, mark as error
        console.warn(`No matching uploaded file found for: ${file.file.name}`)
        return {
          ...file,
          status: 'error' as const,
          error: 'File upload completed but could not be matched'
        }
      })

      setUploadedFiles(finalFiles)
      setShowConfigForm(true)

      toast({
        title: "Files Uploaded Successfully",
        description: `${result.totalFiles} files uploaded (${(result.totalSize / 1024).toFixed(1)} KB)`,
        variant: "success"
      })
    } catch (error: any) {
      // Update files with error status
      const errorFiles = uploadedFiles.map(file =>
        filesToUpload.some(uploadFile => uploadFile.id === file.id)
          ? { ...file, status: 'error' as const, error: error.message || 'Upload failed' }
          : file
      )
      setUploadedFiles(errorFiles)

      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload files. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleBatchCreate = async (formData: BatchConfigFormData) => {
    console.log("🚀 ~ handleBatchCreate ~ formData:", formData)
    try {
      const result = await batchCreateMutation.mutateAsync(formData)

      if (result.success) {
        setBatchId(result.data.batchId)
        setShowConfigForm(false)
        setShowProgress(true)

        toast({
          title: "Batch Created Successfully",
          description: `Batch ID: ${result.data.batchId}`,
          variant: "success"
        })
      }
    } catch (error: any) {
      console.error('Error creating batch:', error)
      toast({
        title: "Batch Creation Failed",
        description: error.message || "Failed to create batch. Please try again.",
        variant: "destructive"
      })
    }
  }


  return (
    <div className="space-y-6">
      {/* WebSocket Connection Status */}
      {connectionError && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm">WebSocket Connection Error: {connectionError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!showProgress && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Processing</CardTitle>
            <CardDescription>Process multiple files at once</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploadZone
              onFilesChange={handleFilesChange}
              maxFiles={10}
              maxFileSize={10 * 1024 * 1024} // 10MB
              acceptedFileTypes={['.txt', '.doc', '.docx']}
              disabled={batchUploadMutation.isPending}
            />

            {uploadedFiles.length > 0 && !showConfigForm && (
              <div className="mt-6">
                <button
                  onClick={handleUploadFiles}
                  disabled={batchUploadMutation.isPending || uploadedFiles.every(f => f.status !== 'pending')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {batchUploadMutation.isPending ? 'Uploading...' : 'Upload Files'}
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Configuration Form */}
      {showConfigForm && uploadedFiles.filter(f => f.status === 'completed').length > 0 && !showProgress && (
        <BatchConfigForm
          uploadedFiles={uploadedFiles
            .filter(file => file.status === 'completed' && file.uploadedUrl)
            .map(file => ({
              id: file.id,
              fileName: file.file.name,
              fileUrl: file.uploadedUrl!
            }))}
          onSubmit={handleBatchCreate}
          isSubmitting={batchCreateMutation.isPending}
        />
      )}

      {/* Progress Tracking */}
      {showProgress && batchId && (
        <BatchProgress
          batchId={batchId}
          onBatchStart={(event) => {
            console.log('Batch started:', event)
          }}
          onBatchProgress={(event) => {
            console.log('Batch progress:', event)
          }}
          onBatchComplete={(event) => {
            console.log('Batch completed:', event)
          }}
          onBatchError={(event) => {
            console.log('Batch error:', event)
          }}
          onAutoModeStart={(event) => {
            console.log('Auto mode started:', event)
          }}
          onAutoModeProgress={(event) => {
            console.log('Auto mode progress:', event)
          }}
          onAutoModeComplete={(event) => {
            console.log('Auto mode completed:', event)
          }}
          onAutoModeError={(event) => {
            console.log('Auto mode error:', event)
          }}
        />
      )}

      {/* Back to Upload Button */}
      {showProgress && (
        <div className="flex justify-center">
          <button
            onClick={() => {
              setShowProgress(false)
              setShowConfigForm(false)
              setBatchId(null)
              setUploadedFiles([])
            }}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Start New Batch
          </button>
        </div>
      )}
    </div>
  )
}

export default BatchProcessingPage 