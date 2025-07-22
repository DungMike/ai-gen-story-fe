import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, FileText, Image, Music, DollarSign } from 'lucide-react';

interface OverviewPanelProps {
  stats: {
    totalStories: number;
    totalImages: number;
    totalAudio: number;
    totalUsers: number;
    totalTokens: number;
    totalCost: number;
    storiesThisMonth: number;
    imagesThisMonth: number;
    audioThisMonth: number;
    activeUsers: number;
  };
  charts: {
    storiesByDay: Array<{ date: string; count: number }>;
    imagesByDay: Array<{ date: string; count: number }>;
    audioByDay: Array<{ date: string; count: number }>;
    tokenUsageByDay: Array<{ date: string; tokens: number; cost: number }>;
    genreDistribution: Array<{ genre: string; count: number; percentage: number }>;
    processingStatus: Array<{ status: string; count: number; percentage: number }>;
  };
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ stats, charts }) => {
  const statCards = [
    {
      title: 'Total Stories',
      value: stats.totalStories.toLocaleString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Images',
      value: stats.totalImages.toLocaleString(),
      icon: Image,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Audio',
      value: stats.totalAudio.toLocaleString(),
      icon: Music,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Total Tokens',
      value: stats.totalTokens.toLocaleString(),
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '+20%',
      changeType: 'positive'
    },
    {
      title: 'Total Cost',
      value: `$${stats.totalCost.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: '+18%',
      changeType: 'negative'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === 'positive' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stories by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Stories Created</CardTitle>
            <CardDescription>Number of stories created per day</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart
              data={charts.storiesByDay}
              type="line"
              xKey="date"
              yKey="count"
              height={300}
              title="Stories by Day"
            />
          </CardContent>
        </Card>

        {/* Token Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Token Usage</CardTitle>
            <CardDescription>Daily token consumption and cost</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart
              data={charts.tokenUsageByDay}
              type="area"
              xKey="date"
              dataKeys={['tokens', 'cost']}
              height={300}
              title="Token Usage by Day"
            />
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Genre Distribution</CardTitle>
            <CardDescription>Stories by genre</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart
              data={charts.genreDistribution}
              type="pie"
              xKey="genre"
              yKey="count"
              height={300}
              title="Genre Distribution"
            />
          </CardContent>
        </Card>

        {/* Processing Status */}
        <Card>
          <CardHeader>
            <CardTitle>Processing Status</CardTitle>
            <CardDescription>Current processing status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {charts.processingStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={status.status === 'Completed' ? 'default' : status.status === 'Processing' ? 'secondary' : 'destructive'}>
                      {status.status}
                    </Badge>
                    <span className="text-sm text-gray-600">{status.count} items</span>
                  </div>
                  <span className="text-sm font-medium">{status.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <Card>
        <CardHeader>
          <CardTitle>This Month's Activity</CardTitle>
          <CardDescription>Summary of this month's activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.storiesThisMonth}</p>
              <p className="text-sm text-gray-600">Stories Created</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.imagesThisMonth}</p>
              <p className="text-sm text-gray-600">Images Generated</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.audioThisMonth}</p>
              <p className="text-sm text-gray-600">Audio Files</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 