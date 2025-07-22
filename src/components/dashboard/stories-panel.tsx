import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Download, Trash2, Search, Filter, Calendar, User, FileText } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  userId: string;
  userName: string;
  status: {
    storyGenerated: boolean;
    imagesGenerated: boolean;
    audioGenerated: boolean;
  };
  metadata: {
    originalWordCount: number;
    generatedWordCount: number;
    processingTime: number;
    tokensUsed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface StoriesPanelProps {
  stories: Story[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange: (page: number) => void;
  onStoryClick: (storyId: string) => void;
}

export const StoriesPanel: React.FC<StoriesPanelProps> = ({
  stories,
  pagination,
  onPageChange,
  onStoryClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status: Story['status']) => {
    const completed = [status.storyGenerated, status.imagesGenerated, status.audioGenerated].filter(Boolean).length;
    const total = 3;
    
    if (completed === total) {
      return <Badge variant="default">Complete</Badge>;
    } else if (completed > 0) {
      return <Badge variant="secondary">Partial</Badge>;
    } else {
      return <Badge variant="destructive">Pending</Badge>;
    }
  };

  const getStatusText = (status: Story['status']) => {
    const parts = [];
    if (status.storyGenerated) parts.push('Story');
    if (status.imagesGenerated) parts.push('Images');
    if (status.audioGenerated) parts.push('Audio');
    return parts.length > 0 ? parts.join(', ') : 'None';
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'complete') {
      matchesStatus = story.status.storyGenerated && story.status.imagesGenerated && story.status.audioGenerated;
    } else if (statusFilter === 'partial') {
      const completed = [story.status.storyGenerated, story.status.imagesGenerated, story.status.audioGenerated].filter(Boolean).length;
      matchesStatus = completed > 0 && completed < 3;
    } else if (statusFilter === 'pending') {
      matchesStatus = !story.status.storyGenerated && !story.status.imagesGenerated && !story.status.audioGenerated;
    }
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stories Management</h2>
          <p className="text-gray-600">Manage and monitor all stories in the system</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search stories by title or user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stories List */}
      <div className="grid gap-4">
        {filteredStories.map((story) => (
          <Card key={story.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onStoryClick(story.id)}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{story.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {story.userName}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(story.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {story.metadata.generatedWordCount} words
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        {getStatusBadge(story.status)}
                        <span className="text-sm text-gray-500">
                          {getStatusText(story.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Tokens: {story.metadata.tokensUsed.toLocaleString()}</span>
                        <span>Time: {story.metadata.processingTime}ms</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} stories
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => onPageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => onPageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {filteredStories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 