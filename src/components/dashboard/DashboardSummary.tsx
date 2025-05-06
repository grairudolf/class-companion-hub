
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, BookOpen, Calendar, CheckSquare } from 'lucide-react';

const DashboardSummary: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard 
        title="Today's Classes" 
        value="3 Classes" 
        description="Next: Computer Science at 10:00 AM"
        icon={<Clock className="h-5 w-5 text-blue-500" />}
      />
      
      <SummaryCard 
        title="Upcoming Assignments" 
        value="4 Due" 
        description="Next: Math Problem Set (Tomorrow)"
        icon={<CheckSquare className="h-5 w-5 text-purple-500" />}
      />
      
      <SummaryCard 
        title="Total Courses" 
        value="5 Courses" 
        description="4 Active, 1 Completed"
        icon={<BookOpen className="h-5 w-5 text-green-500" />}
      />
      
      <SummaryCard 
        title="Week Overview" 
        value="15 Hours" 
        description="Busiest day: Wednesday"
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
