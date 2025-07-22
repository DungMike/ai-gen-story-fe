import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OverviewPanel } from '@/components/dashboard/overview-panel';
import { StoriesPanel } from '@/components/dashboard/stories-panel';
import { 
  BarChart3, 
  FileText, 
  Image, 
  Music, 
  Users, 
  DollarSign,
  Activity,
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Navigate } from 'react-router-dom';
import DashboardUserPage from '../dashboard-user';

// Mock data for demonstration
const mockOverviewData = {
  stats: {
    totalStories: 1250,
    totalImages: 3800,
    totalAudio: 1200,
    totalUsers: 85,
    totalTokens: 1500000,
    totalCost: 45.50,
    storiesThisMonth: 45,
    imagesThisMonth: 120,
    audioThisMonth: 38,
    activeUsers: 65
  },
  charts: {
    storiesByDay: [
      { date: '2024-01-01', count: 12 },
      { date: '2024-01-02', count: 15 },
      { date: '2024-01-03', count: 8 },
      { date: '2024-01-04', count: 20 },
      { date: '2024-01-05', count: 18 },
      { date: '2024-01-06', count: 25 },
      { date: '2024-01-07', count: 22 }
    ],
    imagesByDay: [
      { date: '2024-01-01', count: 35 },
      { date: '2024-01-02', count: 42 },
      { date: '2024-01-03', count: 28 },
      { date: '2024-01-04', count: 55 },
      { date: '2024-01-05', count: 48 },
      { date: '2024-01-06', count: 62 },
      { date: '2024-01-07', count: 58 }
    ],
    audioByDay: [
      { date: '2024-01-01', count: 8 },
      { date: '2024-01-02', count: 12 },
      { date: '2024-01-03', count: 6 },
      { date: '2024-01-04', count: 15 },
      { date: '2024-01-05', count: 11 },
      { date: '2024-01-06', count: 18 },
      { date: '2024-01-07', count: 14 }
    ],
    tokenUsageByDay: [
      { date: '2024-01-01', tokens: 45000, cost: 1.35 },
      { date: '2024-01-02', tokens: 52000, cost: 1.56 },
      { date: '2024-01-03', tokens: 38000, cost: 1.14 },
      { date: '2024-01-04', tokens: 65000, cost: 1.95 },
      { date: '2024-01-05', tokens: 58000, cost: 1.74 },
      { date: '2024-01-06', tokens: 72000, cost: 2.16 },
      { date: '2024-01-07', tokens: 68000, cost: 2.04 }
    ],
    genreDistribution: [
      { genre: 'Fantasy', count: 45, percentage: 30 },
      { genre: 'Romance', count: 35, percentage: 23 },
      { genre: 'Action', count: 30, percentage: 20 },
      { genre: 'Mystery', count: 25, percentage: 17 },
      { genre: 'Sci-fi', count: 15, percentage: 10 }
    ],
    processingStatus: [
      { status: 'Completed', count: 120, percentage: 80 },
      { status: 'Processing', count: 15, percentage: 10 },
      { status: 'Failed', count: 15, percentage: 10 }
    ]
  },
  recentActivity: [
    {
      id: '1',
      type: 'story' as const,
      action: 'completed' as const,
      title: 'The Dragon\'s Quest',
      userId: 'user1',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'image' as const,
      action: 'created' as const,
      title: 'Fantasy Landscape',
      userId: 'user2',
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    }
  ]
};

const mockStoriesData = {
  stories: [
    {
      id: '1',
      title: 'The Dragon\'s Quest',
      userId: 'user1',
      userName: 'John Doe',
      status: {
        storyGenerated: true,
        imagesGenerated: true,
        audioGenerated: true
      },
      metadata: {
        originalWordCount: 500,
        generatedWordCount: 1200,
        processingTime: 45000,
        tokensUsed: 8500
      },
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '2',
      title: 'Mystery Manor',
      userId: 'user2',
      userName: 'Jane Smith',
      status: {
        storyGenerated: true,
        imagesGenerated: true,
        audioGenerated: false
      },
      metadata: {
        originalWordCount: 300,
        generatedWordCount: 800,
        processingTime: 32000,
        tokensUsed: 6200
      },
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-04')
    },
    {
      id: '3',
      title: 'Space Adventure',
      userId: 'user3',
      userName: 'Bob Johnson',
      status: {
        storyGenerated: false,
        imagesGenerated: false,
        audioGenerated: false
      },
      metadata: {
        originalWordCount: 200,
        generatedWordCount: 0,
        processingTime: 0,
        tokensUsed: 0
      },
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03')
    }
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 1250,
    totalPages: 125,
    hasNext: true,
    hasPrev: false
  } 
};

type TabType = 'overview' | 'stories' | 'media' | 'tokens' | 'users';

function DashboardPage() {
  const { userRole } = useAuth();
  console.log("🚀 ~ DashboardPage ~ userRole:", userRole)

  if(userRole !== 'admin') {
    return <DashboardUserPage />
  }
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: BarChart3,
      description: 'System statistics and analytics'
    },
    {
      id: 'stories' as TabType,
      label: 'Stories',
      icon: FileText,
      description: 'Manage and monitor stories'
    },
    {
      id: 'media' as TabType,
      label: 'Media',
      icon: Image,
      description: 'Images and audio files'
    },
    {
      id: 'tokens' as TabType,
      label: 'Token Usage',
      icon: DollarSign,
      description: 'AI token consumption and costs'
    },
    {
      id: 'users' as TabType,
      label: 'Users',
      icon: Users,
      description: 'User management and analytics'
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleStoryClick = (storyId: string) => {
    console.log('Story clicked:', storyId);
    // Navigate to story detail page
  };

  const handlePageChange = (page: number) => {
    console.log('Page changed:', page);
    // Handle pagination
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPanel stats={mockOverviewData.stats} charts={mockOverviewData.charts} />;
      case 'stories':
        return (
          <StoriesPanel
            stories={mockStoriesData.stories}
            pagination={mockStoriesData.pagination}
            onPageChange={handlePageChange}
            onStoryClick={handleStoryClick}
          />
        );
      case 'media':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Media Management</CardTitle>
              <CardDescription>Manage images and audio files</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Media management coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'tokens':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Token Usage & Costs</CardTitle>
              <CardDescription>Monitor AI token consumption and costs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Token usage analytics coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'users':
        return (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and their activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management coming soon...</p>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">AI Story Generation System Administration</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
}

export default DashboardPage; 