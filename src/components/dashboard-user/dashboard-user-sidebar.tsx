import React from 'react';
import { BookOpen, PlusCircle, User, CreditCard, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { menuDashboardUser } from './constant';

interface DashboardUserSidebarProps {
  user?: {
    fullName?: string;
    avatar?: string;
    planType?: string;
  };
  onNavigate?: (route: string) => void;
}


export const DashboardUserSidebar: React.FC<DashboardUserSidebarProps> = ({ user, onNavigate }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen p-6 gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-300 to-blue-200 flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div className="text-base font-semibold text-gray-900">{user?.fullName || 'User'}</div>
        {user?.planType && (
          <span className="text-xs text-purple-500 bg-purple-50 rounded px-2 py-0.5 mt-1">{user.planType}</span>
        )}
      </div>
      <nav className="flex flex-col gap-2 mt-4">
        {menuDashboardUser.map(item => (
          <Button
            key={item.route}
            variant="ghost"
            className="justify-start w-full text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
            onClick={() => onNavigate?.(item.route)}
          >
            <item.icon className="w-5 h-5 mr-2" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
}; 