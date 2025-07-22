import { StoryResponse } from '@/services/stories-service';
import { UserStoryStatus } from '../constant';

export interface UserStory {
    id: string;
    title: string;
    createdAt: string;
    status: UserStoryStatus;
    aiAssets: {
      images: number;
      videos: number;
    };
  }
  
  export interface UserStoriesPanelProps {
    stories?: StoryResponse[];
    loading?: boolean;
    filter?: UserStoryStatus | 'all';
    search?: string;
    onEdit?: (storyId: string) => void;
    onView?: (storyId: string) => void;
    onFilter?: (status: UserStoryStatus | 'all') => void;
    onSearch?: (search: string) => void;
    onPageChange?: (page: number) => void;
    onNavigate?: (path: string) => void;
    page?: number;
    totalPages?: number;
  }