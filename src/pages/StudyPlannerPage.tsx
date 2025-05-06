
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, BookOpen, Calendar as CalendarIcon } from 'lucide-react';
import StudySessionForm from '@/components/studyplanner/StudySessionForm';
import StudyCalendar from '@/components/studyplanner/StudyCalendar';
import StudyList from '@/components/studyplanner/StudyList';

const StudyPlannerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Study Planner</h1>
            <p className="text-muted-foreground">Plan your study sessions based on your courses and assignments.</p>
          </div>
        </div>

        <Tabs defaultValue="calendar" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="calendar">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list">
              <BookOpen className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
            <TabsTrigger value="create">
              <Clock className="h-4 w-4 mr-2" />
              Create Study Session
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <StudyCalendar />
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
            <StudyList />
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Study Session</CardTitle>
              </CardHeader>
              <CardContent>
                <StudySessionForm onSuccess={() => setActiveTab('calendar')} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default StudyPlannerPage;
