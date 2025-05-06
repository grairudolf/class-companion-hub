
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Edit, Trash2, Filter, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import CourseForm from './CourseForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  color: string;
  credits: number;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [creditFilter, setCreditFilter] = useState<number | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      setLoading(true);
      let { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    if (!courseToDelete) return;
    
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseToDelete);
      
      if (error) throw error;
      
      setCourses(courses.filter(course => course.id !== courseToDelete));
      toast.success('Course deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    } finally {
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  const confirmDelete = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const handleAddSuccess = () => {
    fetchCourses();
  };

  const addCourse = () => {
    setSelectedCourse(undefined);
    setFormOpen(true);
  };

  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCreditFilter(null);
    setFilterVisible(false);
  };

  // Filter courses based on search and credit filter
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm === '' || 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCredits = creditFilter === null || course.credits === creditFilter;
    
    return matchesSearch && matchesCredits;
  });

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              My Courses
            </CardTitle>
            <div className="flex items-center gap-2">
              {filterVisible && (
                <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 w-40 md:w-64"
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Credits: {creditFilter === null ? 'Any' : creditFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setCreditFilter(null)}>
                        Any Credits
                      </DropdownMenuItem>
                      {[1, 2, 3, 4, 5, 6].map(credit => (
                        <DropdownMenuItem 
                          key={credit} 
                          onClick={() => setCreditFilter(credit)}
                        >
                          {credit} Credit{credit !== 1 ? 's' : ''}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={clearFilters}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center"
                onClick={toggleFilter}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button 
                size="sm" 
                className="flex items-center"
                onClick={addCourse}
              >
                <span className="sr-only md:not-sr-only md:mr-2">Add Course</span>
                <span className="inline-block md:hidden">+</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className={`h-2 ${course.color}`}></div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{course.code}</h3>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {course.credits} credit{course.credits !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm font-medium mt-1">{course.name}</p>
                    <div className="mt-3 text-xs text-muted-foreground">
                      <p>{course.instructor}</p>
                      <p className="mt-1">{course.schedule}</p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => confirmDelete(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto opacity-30 mb-4" />
              <h3 className="font-medium text-lg">No courses found</h3>
              <p className="text-muted-foreground mt-1">
                {courses.length === 0 ? "You haven't added any courses yet." : "No courses match your filters."}
              </p>
              {courses.length === 0 && (
                <Button 
                  className="mt-4" 
                  onClick={addCourse}
                >
                  Add Your First Course
                </Button>
              )}
              {courses.length > 0 && filteredCourses.length === 0 && (
                <Button 
                  variant="outline"
                  className="mt-4" 
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <CourseForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        course={selectedCourse} 
        onSuccess={handleAddSuccess} 
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              course from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CourseList;
