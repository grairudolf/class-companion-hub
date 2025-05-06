
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import CourseList from '@/components/courses/CourseList';

const CoursesPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Courses</h1>
            <p className="text-muted-foreground">Manage your enrolled courses.</p>
          </div>
        </div>

        <CourseList />
      </div>
    </MainLayout>
  );
};

export default CoursesPage;
