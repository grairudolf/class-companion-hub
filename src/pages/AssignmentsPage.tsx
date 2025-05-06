
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import UpcomingAssignments from '@/components/assignments/UpcomingAssignments';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search } from 'lucide-react';
import AssignmentForm from '@/components/assignments/AssignmentForm';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const AssignmentsPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Assignments</h1>
            <p className="text-muted-foreground">Track and manage your assignments and deadlines.</p>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => setFilterVisible(!filterVisible)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button 
              size="sm" 
              className="flex items-center"
              onClick={() => setFormOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Assignment
            </Button>
          </div>
        </div>

        {filterVisible && (
          <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-md">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4"
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[120px]">
                  {priorityFilter ? `Priority: ${priorityFilter}` : 'Priority: Any'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setPriorityFilter(null)}>
                  Any Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('low')}>
                  Low Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('medium')}>
                  Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriorityFilter('high')}>
                  High Priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" onClick={() => {
              setSearchTerm('');
              setPriorityFilter(null);
            }}>
              Reset
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <UpcomingAssignments 
            refreshTrigger={refreshTrigger}
            searchTerm={searchTerm} 
            priorityFilter={priorityFilter} 
          />
        </div>
      </div>

      <AssignmentForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        onSuccess={handleAddSuccess} 
      />
    </MainLayout>
  );
};

export default AssignmentsPage;
