
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const colors = [
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
];

const courseSchema = z.object({
  code: z.string().min(2, { message: 'Course code must be at least 2 characters' }),
  name: z.string().min(3, { message: 'Course name must be at least 3 characters' }),
  instructor: z.string().min(3, { message: 'Instructor name must be at least 3 characters' }),
  schedule: z.string().min(3, { message: 'Schedule must be at least 3 characters' }),
  credits: z.coerce.number().min(1).max(6),
  color: z.string(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface Course {
  id?: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  color: string;
  credits: number;
}

interface CourseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course;
  onSuccess: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ open, onOpenChange, course, onSuccess }) => {
  const { user } = useAuth();
  const isEditing = !!course?.id;
  
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      code: course?.code || '',
      name: course?.name || '',
      instructor: course?.instructor || '',
      schedule: course?.schedule || '',
      credits: course?.credits || 3,
      color: course?.color || 'bg-blue-500',
    },
  });
  
  async function onSubmit(values: CourseFormValues) {
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('courses')
          .update({
            code: values.code,
            name: values.name,
            instructor: values.instructor,
            schedule: values.schedule,
            credits: values.credits,
            color: values.color,
            updated_at: new Date().toISOString(),
          })
          .eq('id', course.id);
          
        if (error) throw error;
        toast.success('Course updated successfully');
      } else {
        const { error } = await supabase
          .from('courses')
          .insert({
            code: values.code,
            name: values.name,
            instructor: values.instructor,
            schedule: values.schedule,
            credits: values.credits,
            color: values.color,
            user_id: user!.id,
          });
          
        if (error) throw error;
        toast.success('Course added successfully');
      }
      
      onOpenChange(false);
      onSuccess();
      form.reset();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="CS 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Introduction to Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instructor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructor</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule</FormLabel>
                  <FormControl>
                    <Input placeholder="Mon, Wed 9:00 - 10:30 AM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {colors.map((color) => (
                      <div
                        key={color.value}
                        onClick={() => form.setValue('color', color.value)}
                        className={`h-8 rounded-md cursor-pointer ${color.value} ${
                          field.value === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update Course' : 'Add Course'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseForm;
