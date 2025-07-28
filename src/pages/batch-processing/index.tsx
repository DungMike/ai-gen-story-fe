import { useState } from 'react'
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

  // WebSocket integration
  const { isConnected, connectionError } = useBatchSocket({
    batchId: batchId || undefined,
    onBatchStart: (event: BatchProcessingEvent) => {
      console.log('Batch started:', event)
      toast({
        title: "Batch Processing Started",
        description: `Processing ${event.totalStories} stories...`,
        variant: "info"
      })
    },
    onBatchProgress: (event: BatchProgressEvent) => {
      console.log('Batch progress:', event)
    },
    onBatchComplete: (event: BatchCompleteEvent) => {
      console.log('Batch completed:', event)
      toast({
        title: "Batch Processing Completed",
        description: `${event.completedStories} successful, ${event.failedStories} failed`,
        variant: event.failedStories > 0 ? "warning" : "success"
      })
    },
    onBatchError: (event: BatchErrorEvent) => {
      console.log('Batch error:', event)
      toast({
        title: "Batch Processing Error",
        description: event.error,
        variant: "destructive"
      })
    },
    onAutoModeStart: (event: AutoModeEvent) => {
      console.log('Auto mode started:', event)
    },
    onAutoModeProgress: (event: AutoModeEvent) => {
      console.log('Auto mode progress:', event)
    },
    onAutoModeComplete: (event: AutoModeEvent) => {
      console.log('Auto mode completed:', event)
    },
    onAutoModeError: (event: AutoModeEvent) => {
      console.log('Auto mode error:', event)
      toast({
        title: "Auto Mode Error",
        description: event.error || "An error occurred during auto mode processing",
        variant: "destructive"
      })
    }
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
      console.log("🚀 ~ handleUploadFiles ~ result:", result)

      // Update files with uploaded URLs
      const finalFiles = uploadedFiles.map(file => {
        const uploadedFile = result.files.find(uploaded => uploaded.fileName === file.file.name)
        if (uploadedFile) {
          return {
            ...file,
            status: 'completed' as const,
            progress: 100,
            uploadedUrl: uploadedFile.fileUrl
          }
        }
        return file
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
    try {
      const result = await batchCreateMutation.mutateAsync(formData)
      console.log("🚀 ~ handleBatchCreate ~ result:", result)
      
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

  const completedFiles = uploadedFiles.filter(file => file.status === 'completed')

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
      {showConfigForm && completedFiles.length > 0 && !showProgress && (
        <BatchConfigForm
          uploadedFiles={completedFiles.map(file => ({
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