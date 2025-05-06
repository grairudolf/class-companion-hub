
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  dueDate: Date;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Mock data for assignments
const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Problem Set 3',
    courseId: 'math201',
    courseName: 'Calculus II',
    courseCode: 'MATH 201',
    dueDate: new Date(2025, 4, 7, 23, 59), // May 7, 2025, 11:59 PM
    description: 'Complete problems 1-15 on page 287',
    completed: false,
    priority: 'high'
  },
  {
    id: '2',
    title: 'Research Paper Outline',
    courseId: 'eng103',
    courseName: 'English Composition',
    courseCode: 'ENG 103',
    dueDate: new Date(2025, 4, 9, 23, 59), // May 9, 2025, 11:59 PM
    description: 'Create an outline for your research paper',
    completed: false,
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Lab Report 2',
    courseId: 'phys202',
    courseName: 'Physics II',
    courseCode: 'PHYS 202',
    dueDate: new Date(2025, 4, 12, 17, 0), // May 12, 2025, 5:00 PM
    description: 'Write a report on the electric field experiment',
    completed: false,
    priority: 'medium'
  },
  {
    id: '4',
    title: 'Programming Assignment #1',
    courseId: 'cs101',
    courseName: 'Introduction to Computer Science',
    courseCode: 'CS 101',
    dueDate: new Date(2025, 4, 8, 23, 59), // May 8, 2025, 11:59 PM
    description: 'Implement a simple calculator using JavaScript',
    completed: false,
    priority: 'high'
  },
];

const UpcomingAssignments: React.FC = () => {
  // Sort assignments by due date (closest first)
  const sortedAssignments = [...mockAssignments].sort((a, b) => 
    a.dueDate.getTime() - b.dueDate.getTime()
  );

  // Format date for display
  const formatDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    if (dateOnly.getTime() === today.getTime()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (dateOnly.getTime() === tomorrow.getTime()) {
      return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      }) + ', ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // Priority badge colors
  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <CheckSquare className="h-5 w-5 mr-2" />
          Upcoming Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedAssignments.map((assignment) => (
            <div 
              key={assignment.id}
              className="flex items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
              style={{ 
                borderLeftColor: assignment.priority === 'high' 
                  ? '#ef4444' 
                  : assignment.priority === 'medium' 
                    ? '#f59e0b' 
                    : '#10b981' 
              }}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{assignment.title}</h4>
                  <Badge variant="outline" className={priorityColors[assignment.priority]}>
                    {assignment.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{assignment.courseCode}</p>
                <div className="flex items-center mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    {assignment.priority === 'high' && (
                      <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                    )}
                    Due: {formatDate(assignment.dueDate)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAssignments;
