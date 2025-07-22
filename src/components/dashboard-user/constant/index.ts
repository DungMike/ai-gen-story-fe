import { BookOpen, CreditCard, LifeBuoy, PlusCircle, User } from 'lucide-react';

export type UserStoryStatus = 'draft' | 'generating' | 'completed' | 'error';


export const statusMap: Record<UserStoryStatus, { label: string; color: string }> = {
    draft: { label: 'Nháp', color: 'bg-gray-400' },
    generating: { label: 'Đang tạo', color: 'bg-blue-500 animate-pulse' },
    completed: { label: 'Đã hoàn thành', color: 'bg-green-500' },
    error: { label: 'Lỗi', color: 'bg-red-500' },
  };

  
export const menuDashboardUser = [
    { label: 'Tạo truyện mới', icon: PlusCircle, route: '/create-story' },
    { label: 'Truyện của tôi', icon: BookOpen, route: '/dashboard-user' },
    { label: 'Tài khoản', icon: User, route: '/account' },
    { label: 'Gói subscription', icon: CreditCard, route: '/subscription' },
    { label: 'Support', icon: LifeBuoy, route: '/support' },
  ];