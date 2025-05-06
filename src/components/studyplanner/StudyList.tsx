
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { format, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import StudySessionDetails from './StudySessionDetails';

interface StudySession {
  id: string;
  title: string;
  course_id: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  course: {
    code: string;
    name: string;
    color: string;
  };
}

const StudyList: React.FC = () => {
  const { user } = useAuth();
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);

  useEffect(() => {
    if (user) {
      fetchStudySessions();
    }
  }, [user]);

  const fetchStudySessions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('study_sessions')
        .select(`
          *,
          course:course_id (
            code,
            name,
            color
          )
        `)
        .eq('user_id', user?.id)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      setStudySessions(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch study sessions');
    } finally {
      setLoading(false);
    }
  };

  // Filter functions
  const todaySessions = studySessions.filter(session => 
    isToday(new Date(session.start_time))
  );
  
  const tomorrowSessions = studySessions.filter(session => 
    isTomorrow(new Date(session.start_time))
  );
  
  const thisWeekSessions = studySessions.filter(session => 
    isThisWeek(new Date(session.start_time)) && 
    !isToday(new Date(session.start_time)) && 
    !isTomorrow(new Date(session.start_time))
  );
  
  const upcomingSessions = studySessions.filter(session => 
    !isPast(new Date(session.start_time)) && 
    !isThisWeek(new Date(session.start_time))
  );
  
  const pastSessions = studySessions.filter(session => 
    isPast(new Date(session.end_time)) && !isToday(new Date(session.start_time))
  );

  const renderSessionList = (sessions: StudySession[]) => {
    if (sessions.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          No study sessions found
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {sessions.map(session => (
          <div 
            key={session.id}
            className="p-3 border rounded-md cursor-pointer hover:bg-muted"
            onClick={() => setSelectedSession(session)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{session.title}</h4>
                <p className="text-sm text-muted-foreground">{session.course.code}</p>
              </div>
              <div className="flex flex-col items-end">
                <Badge className={`bg-${session.course.color}`}>
                  {format(new Date(session.start_time), "h:mm a")} - {format(new Date(session.end_time), "h:mm a")}
                </Badge>
                <span className="text-xs text-muted-foreground mt-1">
                  {format(new Date(session.start_time), "MMM d, yyyy")}
                </span>
              </div>
            </div>
            {session.location && (
              <p className="text-xs text-muted-foreground mt-1">
                📍 {session.location}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <Card className="p-4">
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="today">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="today">
                Today
                {todaySessions.length > 0 && (
                  <Badge className="ml-2 bg-primary">{todaySessions.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="tomorrow">
                Tomorrow
                {tomorrowSessions.length > 0 && (
                  <Badge className="ml-2 bg-primary">{tomorrowSessions.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="week">
                This Week
                {thisWeekSessions.length > 0 && (
                  <Badge className="ml-2 bg-primary">{thisWeekSessions.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming
                {upcomingSessions.length > 0 && (
                  <Badge className="ml-2 bg-primary">{upcomingSessions.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="past">
                Past
                {pastSessions.length > 0 && (
                  <Badge className="ml-2 bg-primary">{pastSessions.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4 max-h-[400px] overflow-y-auto pr-2">
              <TabsContent value="today">
                {renderSessionList(todaySessions)}
              </TabsContent>
              
              <TabsContent value="tomorrow">
                {renderSessionList(tomorrowSessions)}
              </TabsContent>
              
              <TabsContent value="week">
                {renderSessionList(thisWeekSessions)}
              </TabsContent>
              
              <TabsContent value="upcoming">
                {renderSessionList(upcomingSessions)}
              </TabsContent>
              
              <TabsContent value="past">
                {renderSessionList(pastSessions)}
              </TabsContent>
            </div>
          </Tabs>
        )}
      </Card>
      
      {selectedSession && (
        <StudySessionDetails 
          session={selectedSession} 
          onClose={() => setSelectedSession(null)} 
          onDelete={() => {
            fetchStudySessions();
            setSelectedSession(null);
          }} 
        />
      )}
    </div>
  );
};

export default StudyList;
