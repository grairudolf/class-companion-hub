
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, AlertCircle, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface Assignment {
  id: string;
  title: string;
  course_id: string;
  due_date: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  course: {
    code: string;
    name: string;
    color: string;
  };
}

interface UpcomingAssignmentsProps {
  refreshTrigger?: number;
  searchTerm?: string;
  priorityFilter?: string | null;
  limit?: number;
}

const UpcomingAssignments: React.FC<UpcomingAssignmentsProps> = ({ 
  refreshTrigger = 0,
  searchTerm = '', 
  priorityFilter = null,
  limit
}) => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [countdown, setCountdown] = useState<string | null>(null);
  const [nextDueAssignment, setNextDueAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user, refreshTrigger]);

  useEffect(() => {
    // Set up countdown timer for the closest upcoming assignment
    const timer = setInterval(() => {
      if (nextDueAssignment) {
        const now = new Date();
        const dueDate = new Date(nextDueAssignment.due_date);
        const diff = dueDate.getTime() - now.getTime();
        
        if (diff <= 0) {
          setCountdown('Due now!');
          return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
          setCountdown(`${days}d ${hours}h ${minutes}m remaining`);
        } else if (hours > 0) {
          setCountdown(`${hours}h ${minutes}m remaining`);
        } else {
          setCountdown(`${minutes}m remaining`);
        }
      }
    }, 1000 * 60); // Update every minute
    
    return () => clearInterval(timer);
  }, [nextDueAssignment]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          course:course_id (
            code,
            name,
            color
          )
        `)
        .eq('user_id', user?.id)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      setAssignments(data || []);
      
      // Find the next due assignment that's not completed
      const now = new Date();
      const upcoming = (data || [])
        .filter(a => !a.completed && new Date(a.due_date) > now)
        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
      
      if (upcoming.length > 0) {
        setNextDueAssignment(upcoming[0]);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({ completed })
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setAssignments(assignments.map(assignment => 
        assignment.id === id ? { ...assignment, completed } : assignment
      ));
      
      toast.success(completed ? 'Assignment marked as completed' : 'Assignment marked as incomplete');
      
      // Update next due assignment if needed
      if (nextDueAssignment?.id === id && completed) {
        const now = new Date();
        const upcoming = assignments
          .filter(a => a.id !== id && !a.completed && new Date(a.due_date) > now)
          .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
        
        setNextDueAssignment(upcoming.length > 0 ? upcoming[0] : null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update assignment');
    }
  };

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

  // Filter and process assignments based on tab, search, and priority
  const filterAssignments = (assignments: Assignment[]) => {
    let filtered = [...assignments];
    
    // Filter by tab
    const now = new Date();
    if (activeTab === 'upcoming') {
      filtered = filtered.filter(a => !a.completed && new Date(a.due_date) >= now);
    } else if (activeTab === 'completed') {
      filtered = filtered.filter(a => a.completed);
    } else if (activeTab === 'overdue') {
      filtered = filtered.filter(a => !a.completed && new Date(a.due_date) < now);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply priority filter
    if (priorityFilter) {
      filtered = filtered.filter(a => a.priority === priorityFilter);
    }
    
    // Apply limit if specified
    if (limit && filtered.length > limit) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  };

  const filteredAssignments = filterAssignments(assignments);

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
          {limit ? 'Upcoming Assignments' : 'Assignments'}
          {nextDueAssignment && countdown && (
            <Badge variant="outline" className="ml-2 bg-primary">
              {countdown}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!limit && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredAssignments.length > 0 ? (
            filteredAssignments.map((assignment) => {
              const dueDate = new Date(assignment.due_date);
              const isOverdue = !assignment.completed && dueDate < new Date();
              
              return (
                <div 
                  key={assignment.id}
                  className={`flex items-start p-3 rounded-md border-l-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    assignment.completed 
                      ? 'bg-gray-50 dark:bg-gray-800 border-green-500' 
                      : isOverdue
                        ? 'border-red-500'
                        : assignment.priority === 'high' 
                          ? 'border-red-500' 
                          : assignment.priority === 'medium' 
                            ? 'border-yellow-500' 
                            : 'border-green-500'
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`mr-2 rounded-full h-6 w-6 ${
                      assignment.completed 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                    onClick={() => markAsCompleted(assignment.id, !assignment.completed)}
                  >
                    {assignment.completed && <Check className="h-3 w-3" />}
                  </Button>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold ${assignment.completed ? 'line-through opacity-70' : ''}`}>
                        {assignment.title}
                      </h4>
                      <Badge variant="outline" className={priorityColors[assignment.priority]}>
                        {assignment.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{assignment.course.code}</p>
                    {assignment.description && (
                      <p className="text-sm mt-1 text-muted-foreground line-clamp-2">
                        {assignment.description}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        {isOverdue && (
                          <AlertCircle className="h-3 w-3 mr-1 text-red-500" />
                        )}
                        {assignment.completed ? 'Completed' : `Due: ${formatDate(dueDate)}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <CheckSquare className="h-12 w-12 mx-auto opacity-30 mb-4" />
              <h3 className="font-medium text-lg">No assignments found</h3>
              <p className="text-muted-foreground mt-1">
                {assignments.length === 0 
                  ? "You haven't added any assignments yet." 
                  : "No assignments match your filters."}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAssignments;
