
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CourseList from '@/components/courses/CourseList';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';

const CoursesPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Courses</h1>
            <p className="text-muted-foreground">Manage your enrolled courses.</p>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>

        <CourseList />
      </div>
    </MainLayout>
  );
};

export default CoursesPage;
