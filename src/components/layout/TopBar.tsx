
import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TopBar: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold hidden md:block">Student Timetable Manager</h2>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search component - show on larger screens */}
        <div className="hidden md:flex items-center relative">
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-8 pr-4 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        {/* Notification button */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        {/* User menu */}
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default TopBar;
