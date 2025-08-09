import React, { useCallback, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, BookOpen, Edit, Eye, Download, FileText, Play, Image as ImageIcon, Loader2 } from 'lucide-react';
import { UserStoryStatus } from './constant';
import { UserStoriesPanelProps } from './interface';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDownloadAudioMutation, useOpenMergedAudioMutation } from '@/hooks/useAudioQueries';
import { useDownloadImagesMutation } from '@/hooks/use-image-queries';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const UserStoriesPanel: React.FC<UserStoriesPanelProps> = ({
  stories = [],
  loading = false,
  filter = 'all',
  search = '',
  onEdit,
  onView,
  onFilter,
  onSearch,
  onPageChange,
  page = 1,
  totalPages = 1,
}) => {
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  // Download images mutation
  const downloadImagesMutation = useDownloadImagesMutation();
  // Download audio mutation
  const downloadAudioMutation = useDownloadAudioMutation()
  const openMergedAudioMutation = useOpenMergedAudioMutation();
  const getStatusText = (status: any) => {
    if (!status) return 'Chưa hoàn thành';

    const completed = [];
    if (status.storyGenerated) completed.push('Truyện');
    if (status.audioGenerated) completed.push('Audio');
    if (status.imagesGenerated) completed.push('Ảnh');

    if (completed.length === 0) return 'Chưa hoàn thành';
    if (completed.length === 3) return 'Hoàn thành';
    return `Đã tạo: ${completed.join(', ')}`;
  };

  const getStatusColor = (status: any) => {
    if (!status) return 'bg-gray-400';
    if (status.storyGenerated && status.audioGenerated && status.imagesGenerated) return 'bg-green-500';
    if (status.storyGenerated || status.audioGenerated || status.imagesGenerated) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  const openContentModal = (story: any) => {
    setSelectedStory(story);
    setIsContentModalOpen(true);
  };

  const openPromptModal = (story: any) => {
    setSelectedStory(story);
    setIsPromptModalOpen(true);
  };
  const navigate = useNavigate();
  const handleGenerateStory = (storyId: string) => {
    navigate(`/create-story?edit=${storyId}`);
  };

  const handleGenerateImages = (storyId: string) => {
    navigate(`/generate-images/${storyId}`);
  };

  const handleGenerateAudio = (storyId: string) => {
    navigate(`/generate-audio/${storyId}`);
  };

  const handleStoryDetail = (storyId: string) => {
    navigate(`/story/${storyId}`);
  };

  const downloadAllAudio = useCallback(async (storyId: string) => {
    if (storyId) {
      try {
        await downloadAudioMutation.mutateAsync(storyId)
      } catch (error: any) {
        toast.error('Failed to download audio files')
      }
    }
  }, [downloadAudioMutation])

  const openMergedAudio = useCallback(async (storyId: string) => {
    if (storyId) {
      try {
        await openMergedAudioMutation.mutateAsync(storyId)
      } catch (error: any) {
        toast.error('Failed to open  erged audio file')
      }
    }
  }, [downloadAudioMutation])

  const downloadAllImage = useCallback(async (storyId: string) => {
    if (storyId) {
      try {
        await downloadImagesMutation.mutateAsync(storyId)
      } catch (error: any) {
        toast.error('Failed to download image files')
      }
    }
  }, [downloadImagesMutation])

  return (
    <div className="space-y-6">
      {/* Header + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-500" />
            Truyện của bạn
          </h2>
          <p className="text-gray-500 text-sm">Quản lý truyện đã tạo, đang tạo hoặc lưu nháp</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm theo tên truyện..."
              value={search}
              onChange={e => onSearch?.(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={v => onFilter?.(v as UserStoryStatus | 'all')}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="draft">Nháp</SelectItem>
              <SelectItem value="generating">Đang tạo</SelectItem>
              <SelectItem value="completed">Đã hoàn thành</SelectItem>
              <SelectItem value="error">Lỗi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Danh sách truyện - Layout dạng list */}
      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </CardContent>
            </Card>
          ))
        ) : stories.length === 0 ? (
          <Card className="w-full">
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có truyện nào</h3>
              <p className="text-gray-500">Hãy tạo truyện mới hoặc thay đổi bộ lọc/tìm kiếm</p>
            </CardContent>
          </Card>
        ) : (
          stories.map(story => (
            <Card key={story._id} className="w-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {/* Header với tiêu đề và trạng thái */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getStatusColor(story.status)}>
                        {getStatusText(story.status)}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date(story.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit?.(story._id)}>
                      <Edit className="w-4 h-4 mr-1" /> Chỉnh sửa
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleStoryDetail(story._id)}>
                      <Eye className="w-4 h-4 mr-1" /> Xem
                    </Button>
                  </div>
                </div>

                {/* Thông tin style */}
                {story.style && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-xs text-gray-500">Story id</span>
                      <p className="text-sm font-medium">{story._id}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Độ dài</span>
                      <p className="text-sm font-medium">{story.style.length}</p>
                    </div>
                  </div>
                )}

                {/* Thông tin metadata */}
                {story.metadata && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 p-3 bg-blue-50 rounded-lg">
                    <div>
                      <span className="text-xs text-gray-500">Số từ gốc</span>
                      <p className="text-sm font-medium">{story.metadata.originalWordCount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Số từ đã sinh</span>
                      <p className="text-sm font-medium">{story.metadata.generatedWordCount?.toLocaleString() || '-'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Thời gian xử lý</span>
                      <p className="text-sm font-medium">
                        {story.metadata.processingTime ? `${(story.metadata.processingTime / 1000).toFixed(1)}s` : '-'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Trạng thái chi tiết */}
                {story.status && (
                  <div className="space-y-3 mb-4">
                    <div className="flex gap-3 justify-between align-center flex-wrap">
                      <div className="flex gap-2 flex-wrap">
                        <Badge onClick={() => handleGenerateStory(story._id)} variant={story.status.storyGenerated ? "default" : "secondary"} className="flex items-center gap-1 cursor-pointer">
                          <FileText className="w-3 h-3" />
                          Truyện {story.status.storyGenerated ? '✓' : '...'}
                        </Badge>
                        <Badge onClick={() => handleGenerateAudio(story._id)} variant={story.status.audioGenerated ? "default" : "secondary"} className="flex items-center gap-1 cursor-pointer">
                          <Play className="w-3 h-3" />
                          Audio {story.status.audioGenerated ? '✓' : '...'}
                        </Badge>
                        <Badge onClick={() => handleGenerateImages(story._id)} variant={story.status.imagesGenerated ? "default" : "secondary"} className="flex items-center gap-1 cursor-pointer">
                          <ImageIcon className="w-3 h-3" />
                          Ảnh {story.status.imagesGenerated ? '✓' : '...'}
                        </Badge>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {story.status.audioGenerated &&
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                                disabled={downloadAudioMutation.isPending || openMergedAudioMutation.isPending}
                              >
                                {(downloadAudioMutation.isPending || openMergedAudioMutation.isPending) ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                                Audio
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => downloadAllAudio(story._id)}
                                disabled={downloadAudioMutation.isPending}
                              >
                                {downloadAudioMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Download className="h-4 w-4 mr-2" />
                                )}
                                Download all
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openMergedAudioMutation.mutate(story._id)}
                                disabled={openMergedAudioMutation.isPending}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Open merged audio
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        }
                        {story.status.imagesGenerated &&
                          <Button
                            onClick={() => downloadAllImage(story._id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                            disabled={downloadImagesMutation.isPending}
                          >
                            {downloadImagesMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                            Images
                          </Button>
                        }
                      </div>
                    </div>

                    {/* Generate buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {!story.status.storyGenerated && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateStory(story._id)}
                          className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          <FileText className="w-4 h-4" />
                          Tạo truyện
                        </Button>
                      )}

                      {!story.status.imagesGenerated && story.status.storyGenerated && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateImages(story._id)}
                          className="flex items-center gap-1 text-purple-600 border-purple-600 hover:bg-purple-50"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Tạo ảnh
                        </Button>
                      )}

                      {!story.status.audioGenerated && story.status.storyGenerated && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateAudio(story._id)}
                          className="flex items-center gap-1 text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <Play className="w-4 h-4" />
                          Tạo audio
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Nội dung custom prompt */}
                {story.customPrompt && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Custom prompt</span>
                      {story.customPrompt.length > 200 && <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openPromptModal(story)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Xem đầy đủ
                      </Button>
                      }
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical' as const
                      }}>
                        {story.customPrompt.length > 200 ? `${story.customPrompt.substring(0, 200)}...` : story.customPrompt}
                      </p>
                    </div>
                  </div>
                )}

                {/* Nội dung truyện preview */}
                {story.generatedContent && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Nội dung truyện</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openContentModal(story)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Xem đầy đủ
                      </Button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 overflow-hidden" style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical' as const
                      }}>
                        {story.generatedContent.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                )}

                {/* File download */}
                <div className="flex gap-2 flex-wrap">
                  {story.files?.originalFile && (
                    <a href={story.files.originalFile} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Tải file gốc
                      </Button>
                    </a>
                  )}
                  {story.files?.generatedFile && (
                    <a href={story.files.generatedFile} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Tải file đã sinh
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal xem nội dung đầy đủ */}
      <Dialog open={isContentModalOpen} onOpenChange={setIsContentModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedStory?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full">
            <div className="p-4">
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold mb-4">Nội dung gốc:</h4>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm">{selectedStory?.originalContent}</p>
                </div>

                {selectedStory?.generatedContent && (
                  <>
                    <h4 className="text-lg font-semibold mb-4">Nội dung đã sinh:</h4>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="whitespace-pre-wrap text-sm">{selectedStory.generatedContent}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Modal xem custom prompt */}
      <Dialog open={isPromptModalOpen} onOpenChange={setIsPromptModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedStory?.title}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] w-full">
            <div className="p-4">
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold mb-4">Custom prompt:</h4>
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm">{selectedStory?.customPrompt}</p>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
            Trang trước
          </Button>
          <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
          <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)}>
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}; 