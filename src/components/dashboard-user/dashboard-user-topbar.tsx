import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Menu, User } from 'lucide-react';

interface DashboardUserTopbarProps {
  user?: {
    fullName?: string;
    avatar?: string;
  };
  onCreateStory?: () => void;
  onToggleSidebar?: () => void;
}

export const DashboardUserTopbar: React.FC<DashboardUserTopbarProps> = ({ user, onCreateStory, onToggleSidebar }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleSidebar}>
          <Menu className="w-6 h-6" />
        </Button>
        <span className="text-lg font-semibold text-gray-900 hidden md:inline">Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="default" size="sm" onClick={onCreateStory}>
          <PlusCircle className="w-4 h-4 mr-1" /> Tạo truyện mới
        </Button>
        
      </div>
    </header>
  );
}; 