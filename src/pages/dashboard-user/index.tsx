import React, { useEffect, useState } from 'react';
import { UserStoriesPanel } from '@/components/dashboard-user/user-stories-panel';
import { DashboardUserSidebar, DashboardUserTopbar } from '@/components/dashboard-user';
import { useAuth } from '@/hooks/use-auth';
import { GetAllStoriesParams, StoryResponse } from '@/services/stories-service';
import { useStories } from '@/hooks/use-stories';

const DashboardUserPage: React.FC = () => {
  // TODO: Lấy dữ liệu user, stories từ API
  // const user = ...;
  // const stories = ...;
  const {  user } = useAuth();
  const [params, setParams] = useState<GetAllStoriesParams>({
    page: 1,
    limit: 10,
    userId: user?._id,
  });
  const [stories, setStories] = useState<StoryResponse[]>([]);
  const { data: storiesData, isLoading: isStoriesLoading } = useStories(params);

  useEffect(() => {
    if (storiesData) {
      setStories(storiesData.data);
    }
  }, [storiesData]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardUserSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardUserTopbar />
        <main className="flex-1 p-4 md:p-8">
          {/* Chart thống kê (có thể ẩn/hiện tuỳ nhu cầu) */}
          {/* <DashboardUserStatsChart /> */}
          <UserStoriesPanel stories={stories} loading={isStoriesLoading} />
        </main>
      </div>
    </div>
  );
};

export default DashboardUserPage; 