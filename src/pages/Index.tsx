
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import WeeklyTimetable from '@/components/timetable/WeeklyTimetable';
import UpcomingAssignments from '@/components/assignments/UpcomingAssignments';

const Index: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to your student dashboard.</p>
        </div>

        <DashboardSummary />
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Weekly Schedule</h2>
            <WeeklyTimetable />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Assignments Due</h2>
            <UpcomingAssignments />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
