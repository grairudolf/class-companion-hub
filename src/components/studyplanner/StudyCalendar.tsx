
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
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

const StudyCalendar: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [sessionsForDate, setSessionsForDate] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<StudySession | null>(null);

  useEffect(() => {
    if (user) {
      fetchStudySessions();
    }
  }, [user]);

  useEffect(() => {
    // Filter sessions for selected date
    const filtered = studySessions.filter(session => 
      isSameDay(new Date(session.start_time), selectedDate)
    );
    setSessionsForDate(filtered);
  }, [selectedDate, studySessions]);

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
        .eq('user_id', user?.id);
      
      if (error) throw error;
      setStudySessions(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch study sessions');
    } finally {
      setLoading(false);
    }
  };

  // Function to render date cell with dots for sessions
  const renderDateContent = (date: Date) => {
    const sessionsOnDate = studySessions.filter(session => 
      isSameDay(new Date(session.start_time), date)
    );
    
    if (sessionsOnDate.length > 0) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute bottom-1 flex gap-0.5">
            {sessionsOnDate.length > 3 ? (
              <span className="h-1 w-1 rounded-full bg-primary"></span>
            ) : (
              sessionsOnDate.map((_, idx) => (
                <span key={idx} className="h-1 w-1 rounded-full bg-primary"></span>
              ))
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="p-3 pointer-events-auto"
              components={{
                DayContent: ({ date, ...props }) => (
                  <div {...props}>
                    {date.getDate()}
                    {renderDateContent(date)}
                  </div>
                ),
              }}
            />
          </div>
          <div>
            <h3 className="font-medium mb-2">
              Sessions for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : sessionsForDate.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                No study sessions planned for this date
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {sessionsForDate.map(session => (
                  <div 
                    key={session.id}
                    className="p-2 border rounded-md cursor-pointer hover:bg-muted"
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">{session.course.code}</p>
                      </div>
                      <Badge className={`bg-${session.course.color}`}>
                        {format(new Date(session.start_time), "h:mm a")} - {format(new Date(session.end_time), "h:mm a")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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

export default StudyCalendar;
