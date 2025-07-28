// Audio Queries - React Query hooks with unified architecture
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { imagesService } from '@/services/images-service'

/**
 * Download image mutation
 */
export const useDownloadImagesMutation = () => {
  return useMutation({
    mutationFn: (storyId: string) => imagesService.downloadImages(storyId),
    onSuccess: (blob, variables) => {
      // variables chính là storyId
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `story-images-${variables}.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Images downloaded successfully!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to download images'
      toast.error(message)
    }
  })
}