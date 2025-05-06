
import React from 'react';
import { Card } from '@/components/ui/card';

interface ClassEvent {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  day: number; // 0-6 (Sunday-Saturday)
  startTime: string; // 24h format "HH:MM"
  endTime: string; // 24h format "HH:MM"
  location: string;
  instructor: string;
  color: string;
}

// Mock data for the timetable
const mockClasses: ClassEvent[] = [
  {
    id: '1',
    courseId: 'cs101',
    courseName: 'Introduction to Computer Science',
    courseCode: 'CS 101',
    day: 1, // Monday
    startTime: '09:00',
    endTime: '10:30',
    location: 'Room A101',
    instructor: 'Dr. Smith',
    color: 'bg-course-blue'
  },
  {
    id: '2',
    courseId: 'math201',
    courseName: 'Calculus II',
    courseCode: 'MATH 201',
    day: 1, // Monday
    startTime: '11:00',
    endTime: '12:30',
    location: 'Room B205',
    instructor: 'Prof. Johnson',
    color: 'bg-course-green'
  },
  {
    id: '3',
    courseId: 'eng103',
    courseName: 'English Composition',
    courseCode: 'ENG 103',
    day: 2, // Tuesday
    startTime: '14:00',
    endTime: '15:30',
    location: 'Room C310',
    instructor: 'Dr. Williams',
    color: 'bg-course-purple'
  },
  {
    id: '4',
    courseId: 'cs101',
    courseName: 'Introduction to Computer Science',
    courseCode: 'CS 101',
    day: 3, // Wednesday
    startTime: '09:00',
    endTime: '10:30',
    location: 'Room A101',
    instructor: 'Dr. Smith',
    color: 'bg-course-blue'
  },
  {
    id: '5',
    courseId: 'phys202',
    courseName: 'Physics II',
    courseCode: 'PHYS 202',
    day: 3, // Wednesday
    startTime: '13:00',
    endTime: '15:30',
    location: 'Lab L105',
    instructor: 'Prof. Brown',
    color: 'bg-course-orange'
  },
  {
    id: '6',
    courseId: 'math201',
    courseName: 'Calculus II',
    courseCode: 'MATH 201',
    day: 3, // Wednesday
    startTime: '11:00',
    endTime: '12:30',
    location: 'Room B205',
    instructor: 'Prof. Johnson',
    color: 'bg-course-green'
  },
  {
    id: '7',
    courseId: 'hist105',
    courseName: 'World History',
    courseCode: 'HIST 105',
    day: 4, // Thursday
    startTime: '11:00',
    endTime: '12:30',
    location: 'Room D120',
    instructor: 'Dr. Taylor',
    color: 'bg-course-red'
  },
  {
    id: '8',
    courseId: 'eng103',
    courseName: 'English Composition',
    courseCode: 'ENG 103',
    day: 4, // Thursday
    startTime: '14:00',
    endTime: '15:30',
    location: 'Room C310',
    instructor: 'Dr. Williams',
    color: 'bg-course-purple'
  },
  {
    id: '9',
    courseId: 'phys202',
    courseName: 'Physics II',
    courseCode: 'PHYS 202',
    day: 5, // Friday
    startTime: '13:00',
    endTime: '14:30',
    location: 'Room A205',
    instructor: 'Prof. Brown',
    color: 'bg-course-orange'
  }
];

// Array of days
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Array of time slots (8 AM to 6 PM)
const timeSlots = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 8;
  return `${hour}:00`;
});

interface ClassCardProps {
  classEvent: ClassEvent;
}

const ClassCard: React.FC<ClassCardProps> = ({ classEvent }) => {
  return (
    <div className={`course-card ${classEvent.color}`}>
      <div className="font-medium">{classEvent.courseCode}</div>
      <div className="text-[10px] opacity-90">{classEvent.location}</div>
      <div className="text-[10px] mt-1 opacity-80">{classEvent.startTime} - {classEvent.endTime}</div>
    </div>
  );
};

const WeeklyTimetable: React.FC = () => {
  // Function to render class cards for a specific day and time
  const getClassesForDayAndTime = (day: number, time: string) => {
    const timeHour = parseInt(time.split(':')[0]);
    
    return mockClasses.filter(classEvent => {
      // Check if this class is on the correct day
      if (classEvent.day !== day) return false;
      
      // Parse the start and end time hours
      const startHour = parseInt(classEvent.startTime.split(':')[0]);
      const endHour = parseInt(classEvent.endTime.split(':')[0]);
      
      // Check if this class falls within this time slot
      // A class is shown at a time slot if it starts at that hour or if it spans that hour
      return (startHour === timeHour) || (startHour < timeHour && endHour > timeHour);
    });
  };

  return (
    <Card className="p-2">
      <div className="timetable-grid">
        {/* Empty corner cell */}
        <div className="timetable-header"></div>
        
        {/* Day headers */}
        {days.map((day, index) => (
          <div key={`day-${index}`} className="timetable-header">
            {day}
          </div>
        ))}
        
        {/* Time rows */}
        {timeSlots.map((time, timeIndex) => (
          <React.Fragment key={`time-${timeIndex}`}>
            {/* Time indicator */}
            <div className="timetable-time">{time}</div>
            
            {/* Day cells */}
            {Array.from({ length: 7 }, (_, dayIndex) => {
              const classes = getClassesForDayAndTime(dayIndex, time);
              
              return (
                <div key={`cell-${dayIndex}-${timeIndex}`} className="timetable-cell">
                  {classes.map(classEvent => (
                    <ClassCard key={classEvent.id} classEvent={classEvent} />
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

export default WeeklyTimetable;
