
import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
