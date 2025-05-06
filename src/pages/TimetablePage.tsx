
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import WeeklyTimetable from '@/components/timetable/WeeklyTimetable';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus } from 'lucide-react';

const TimetablePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Timetable</h1>
            <p className="text-muted-foreground">Manage your weekly class schedule.</p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Weekly View
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Daily View
            </Button>
            <Button size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Spring Semester 2025</h2>
            <div className="flex space-x-2">
              {/* Pagination controls could go here */}
            </div>
          </div>
          
          <WeeklyTimetable />
        </div>
      </div>
    </MainLayout>
  );
};

export default TimetablePage;
