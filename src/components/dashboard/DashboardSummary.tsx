
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, Calendar, CheckSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { format, isToday } from 'date-fns';

interface CourseClass {
  id: string;
  courseCode: string;
  courseName: string;
  startTime: Date;
  endTime: Date;
  location: string;
}

interface DashboardData {
  todaysClasses: number;
  nextClass: CourseClass | null;
  upcomingAssignments: number;
  nextAssignmentDue: string;
  totalCourses: number;
  activeCourses: number;
  weeklyHours: number;
  busiestDay: string;
}

const DashboardSummary: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    todaysClasses: 0,
    nextClass: null,
    upcomingAssignments: 0,
    nextAssignmentDue: '',
    totalCourses: 0,
    activeCourses: 0,
    weeklyHours: 0,
    busiestDay: ''
  });
  const [timeToNextClass, setTimeToNextClass] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Update countdown timer every minute
  useEffect(() => {
    if (dashboardData.nextClass) {
      updateTimeToNextClass();
      const timer = setInterval(updateTimeToNextClass, 60000);
      return () => clearInterval(timer);
    }
  }, [dashboardData.nextClass]);

  const updateTimeToNextClass = () => {
    if (!dashboardData.nextClass) return;
    
    const now = new Date();
    const nextClassTime = new Date(dashboardData.nextClass.startTime);
    
    // If next class time has already passed, show "In Progress" or "Completed"
    if (nextClassTime <= now) {
      const endTime = new Date(dashboardData.nextClass.endTime);
      if (now < endTime) {
        setTimeToNextClass('In Progress');
      } else {
        setTimeToNextClass('Completed');
      }
      return;
    }
    
    // Calculate time difference
    const diffMs = nextClassTime.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      setTimeToNextClass(`in ${diffHours}h ${diffMinutes}m`);
    } else {
      setTimeToNextClass(`in ${diffMinutes} minutes`);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get today's date and day of week (0-6, Sunday-Saturday)
      const today = new Date();
      const dayOfWeek = today.getDay();

      // Fetch courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', user?.id);
      
      if (coursesError) throw coursesError;
      
      // Mock data for weekly schedule (replace with actual schedule data when available)
      const { data: timetableData } = await supabase
        .from('timetable')
        .select('*')
        .eq('user_id', user?.id);
      
      // Calculate weekly hours and busiest day (mock calculation)
      const weeklyHours = 15; // Replace with actual calculation
      const busiestDay = 'Wednesday'; // Replace with actual calculation
      
      // Get today's classes
      const todaysClasses = (timetableData || [])
        .filter((entry: any) => entry.day_of_week === dayOfWeek)
        .sort((a: any, b: any) => {
          const aTime = new Date(`1970-01-01T${a.start_time}`);
          const bTime = new Date(`1970-01-01T${b.start_time}`);
          return aTime.getTime() - bTime.getTime();
        });
      
      // Find next class today
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      let nextClass: CourseClass | null = null;
      
      for (const entry of todaysClasses || []) {
        if (entry.start_time > currentTime) {
          const course = courses?.find(c => c.id === entry.course_id);
          if (course) {
            const startTime = new Date();
            const [startHours, startMinutes] = entry.start_time.split(':').map(Number);
            startTime.setHours(startHours, startMinutes, 0);
            
            const endTime = new Date();
            const [endHours, endMinutes] = entry.end_time.split(':').map(Number);
            endTime.setHours(endHours, endMinutes, 0);
            
            nextClass = {
              id: entry.id,
              courseCode: course.code,
              courseName: course.name,
              startTime,
              endTime,
              location: entry.location
            };
            break;
          }
        }
      }
      
      // Fetch assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', user?.id)
        .eq('completed', false)
        .gt('due_date', new Date().toISOString())
        .order('due_date', { ascending: true });
      
      if (assignmentsError) throw assignmentsError;
      
      // Get next assignment due
      let nextAssignmentDue = '';
      if (assignments && assignments.length > 0) {
        const nextAssignment = assignments[0];
        const dueDate = new Date(nextAssignment.due_date);
        
        if (isToday(dueDate)) {
          nextAssignmentDue = `Today at ${format(dueDate, 'h:mm a')}`;
        } else {
          nextAssignmentDue = format(dueDate, 'MMM d');
        }
      }
      
      // Update dashboard data
      setDashboardData({
        todaysClasses: todaysClasses?.length || 0,
        nextClass,
        upcomingAssignments: assignments?.length || 0,
        nextAssignmentDue,
        totalCourses: courses?.length || 0,
        activeCourses: courses?.length || 0, // Replace with actual logic if needed
        weeklyHours,
        busiestDay
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard 
        title="Today's Classes" 
        value={loading ? '...' : `${dashboardData.todaysClasses} Classes`} 
        description={loading ? 'Loading...' : dashboardData.nextClass 
          ? `Next: ${dashboardData.nextClass.courseCode} ${timeToNextClass}` 
          : 'No more classes today'}
        icon={<Clock className="h-5 w-5 text-blue-500" />}
      />
      
      <SummaryCard 
        title="Upcoming Assignments" 
        value={loading ? '...' : `${dashboardData.upcomingAssignments} Due`} 
        description={loading ? 'Loading...' : dashboardData.upcomingAssignments > 0 
          ? `Next: ${dashboardData.nextAssignmentDue}` 
          : 'No upcoming assignments'}
        icon={<CheckSquare className="h-5 w-5 text-purple-500" />}
      />
      
      <SummaryCard 
        title="Total Courses" 
        value={loading ? '...' : `${dashboardData.totalCourses} Courses`} 
        description={loading ? 'Loading...' : `${dashboardData.activeCourses} Active, ${dashboardData.totalCourses - dashboardData.activeCourses} Completed`}
        icon={<BookOpen className="h-5 w-5 text-green-500" />}
      />
      
      <SummaryCard 
        title="Week Overview" 
        value={loading ? '...' : `${dashboardData.weeklyHours} Hours`} 
        description={loading ? 'Loading...' : `Busiest day: ${dashboardData.busiestDay}`}
        icon={<Calendar className="h-5 w-5 text-orange-500" />}
      />
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, description, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default DashboardSummary;
