
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  color: string;
  credits: number;
}

// Mock course data
const mockCourses: Course[] = [
  {
    id: 'cs101',
    code: 'CS 101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Smith',
    schedule: 'Mon, Wed 9:00 - 10:30 AM',
    color: 'bg-course-blue',
    credits: 3
  },
  {
    id: 'math201',
    code: 'MATH 201',
    name: 'Calculus II',
    instructor: 'Prof. Johnson',
    schedule: 'Mon, Wed 11:00 - 12:30 PM',
    color: 'bg-course-green',
    credits: 4
  },
  {
    id: 'eng103',
    code: 'ENG 103',
    name: 'English Composition',
    instructor: 'Dr. Williams',
    schedule: 'Tue, Thu 2:00 - 3:30 PM',
    color: 'bg-course-purple',
    credits: 3
  },
  {
    id: 'phys202',
    code: 'PHYS 202',
    name: 'Physics II',
    instructor: 'Prof. Brown',
    schedule: 'Wed 1:00 - 3:30 PM, Fri 1:00 - 2:30 PM',
    color: 'bg-course-orange',
    credits: 4
  },
  {
    id: 'hist105',
    code: 'HIST 105',
    name: 'World History',
    instructor: 'Dr. Taylor',
    schedule: 'Thu 11:00 - 12:30 PM',
    color: 'bg-course-red',
    credits: 3
  },
];

const CourseList: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BookOpen className="h-5 w-5 mr-2" />
          Current Courses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <div className={`h-2 ${course.color}`}></div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{course.code}</h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {course.credits} credits
                  </span>
                </div>
                <p className="text-sm font-medium mt-1">{course.name}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  <p>{course.instructor}</p>
                  <p className="mt-1">{course.schedule}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseList;
