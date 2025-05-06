
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, MapPin, Info, Trash2 } from 'lucide-react';
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

interface StudySessionDetailsProps {
  session: {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    location: string;
    course: {
      code: string;
      name: string;
      color: string;
    };
  };
  onClose: () => void;
  onDelete: () => void;
}

const StudySessionDetails: React.FC<StudySessionDetailsProps> = ({ session, onClose, onDelete }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { user } = useAuth();

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', session.id)
        .eq('user_id', user?.id);
      
      if (error) throw error;
      
      toast.success('Study session deleted successfully');
      setDeleteDialogOpen(false);
      onDelete();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete study session');
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{session.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full bg-${session.course.color}`}></div>
              <span className="font-medium">{session.course.code} - {session.course.name}</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {format(new Date(session.start_time), "MMMM d, yyyy")} | {format(new Date(session.start_time), "h:mm a")} - {format(new Date(session.end_time), "h:mm a")}
              </span>
            </div>
            
            {session.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{session.location}</span>
              </div>
            )}
            
            {session.description && (
              <div>
                <div className="flex items-center mb-1 text-sm font-medium">
                  <Info className="h-4 w-4 mr-2" />
                  <span>Description</span>
                </div>
                <p className="text-sm pl-6">{session.description}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this study session?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the study session.
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

export default StudySessionDetails;
