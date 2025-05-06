
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, BookOpen, Clock, CheckSquare, Settings, Home } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="bg-white dark:bg-gray-800 w-full md:w-64 md:h-screen md:flex-shrink-0 border-r border-gray-200 dark:border-gray-700 md:sticky md:top-0">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center justify-center md:justify-start mb-8 mt-2">
          <div className="bg-primary p-2 rounded-md">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="ml-2 text-xl font-bold">StudyMate</h1>
        </div>
        
        <nav className="space-y-1 flex-1">
          <NavigationItem to="/" icon={<Home />} label="Dashboard" />
          <NavigationItem to="/timetable" icon={<Calendar />} label="Timetable" />
          <NavigationItem to="/courses" icon={<BookOpen />} label="Courses" />
          <NavigationItem to="/assignments" icon={<CheckSquare />} label="Assignments" />
        </nav>
        
        <div className="pt-4 mt-auto border-t border-gray-200 dark:border-gray-700">
          <NavigationItem to="/settings" icon={<Settings />} label="Settings" />
        </div>
      </div>
    </aside>
  );
};

interface NavigationItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive 
          ? 'bg-primary text-white' 
          : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

export default Sidebar;
