import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UploadedFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'completed' | 'error'
  progress: number
  error?: string
  uploadedUrl?: string
}

interface FileUploadZoneProps {
  onFilesChange: (files: UploadedFile[]) => void
  maxFiles?: number
  maxFileSize?: number // in bytes
  acceptedFileTypes?: string[]
  disabled?: boolean
}

const DEFAULT_MAX_FILES = 10
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const DEFAULT_ACCEPTED_TYPES = ['.txt', '.doc', '.docx']

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesChange,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
  disabled = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragError, setDragError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate unique ID for files
  const generateFileId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Validate file
  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > maxFileSize) {
      return {
        isValid: false,
        error: `File size exceeds ${(maxFileSize / 1024 / 1024).toFixed(1)}MB limit`
      }
    }

    // Check file type
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    if (!acceptedFileTypes.includes(fileExtension)) {
      return {
        isValid: false,
        error: `File type not supported. Allowed types: ${acceptedFileTypes.join(', ')}`
      }
    }

    return { isValid: true }
  }, [maxFileSize, acceptedFileTypes])

  // Add files to the list
  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const newFiles: UploadedFile[] = []

    // Check if adding these files would exceed the limit
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      setDragError(`Maximum ${maxFiles} files allowed`)
      return
    }

    fileArray.forEach((file) => {
      const validation = validateFile(file)

      if (validation.isValid) {
        // Check for duplicate files
        const isDuplicate = uploadedFiles.some(
          uploadedFile => uploadedFile.file.name === file.name && uploadedFile.file.size === file.size
        )

        if (!isDuplicate) {
          newFiles.push({
            id: generateFileId(),
            file,
            status: 'pending',
            progress: 0
          })
        }
      } else {
        setDragError(validation.error || 'Validation failed')
      }
    })

    if (newFiles.length > 0) {
      const updatedFiles = [...uploadedFiles, ...newFiles]
      setUploadedFiles(updatedFiles)
      onFilesChange(updatedFiles)
      setDragError(null)
    }
  }, [uploadedFiles, maxFiles, validateFile, onFilesChange])

  // Remove file from the list
  const removeFile = useCallback((fileId: string) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId)
    setUploadedFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }, [uploadedFiles, onFilesChange])

  // Update file status
  const updateFileStatus = useCallback((fileId: string, updates: Partial<UploadedFile>) => {
    setUploadedFiles(prev =>
      prev.map(file =>
        file.id === fileId ? { ...file, ...updates } : file
      )
    )
  }, [])

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
      setDragError(null)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    setDragError(null)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      addFiles(files)
    }
  }, [disabled, addFiles])

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      addFiles(files)
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [addFiles])

  // Handle click on upload area
  const handleUploadAreaClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [disabled])

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Get status icon
  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Files
        </CardTitle>
        <CardDescription>
          Drag and drop files here or click to browse. Maximum {maxFiles} files, {formatFileSize(maxFileSize)} each.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Zone */}
        <motion.div
          whileHover={{ scale: disabled ? 1 : 1.02 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadAreaClick}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer",
            isDragOver && !disabled
              ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <motion.div
            animate={{
              y: isDragOver && !disabled ? -5 : 0,
              scale: isDragOver && !disabled ? 1.05 : 1
            }}
            transition={{ duration: 0.2 }}
          >
            <Upload className={cn(
              "w-12 h-12 mx-auto mb-4",
              isDragOver && !disabled ? "text-blue-500" : "text-gray-400"
            )} />
          </motion.div>

          <p className="text-lg font-medium mb-2">
            {disabled ? 'Upload disabled' : 'Drop files here or click to browse'}
          </p>

          <p className="text-sm text-gray-500">
            Supported formats: {acceptedFileTypes.join(', ')}
          </p>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFileTypes.join(',')}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
        </motion.div>

        {/* Drag Error */}
        <AnimatePresence>
          {dragError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 dark:text-red-400">{dragError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* File List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
              Selected Files ({uploadedFiles.length}/{maxFiles})
            </h4>

            <div className="space-y-2">
              <AnimatePresence>
                {uploadedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    {getStatusIcon(file.status)}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {file.file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.file.size)}
                      </p>

                      {/* Progress bar for uploading files */}
                      {file.status === 'uploading' && (
                        <div className="mt-2">
                          <Progress value={file.progress} className="h-1" />
                          <p className="text-xs text-gray-500 mt-1">
                            {file.progress}% uploaded
                          </p>
                        </div>
                      )}

                      {/* Error message */}
                      {file.status === 'error' && file.error && (
                        <p className="text-xs text-red-500 mt-1">{file.error}</p>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-500"
                      disabled={file.status === 'uploading'}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 