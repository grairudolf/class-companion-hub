
import React, { useState, useEffect } from 'react';
import { Bell, User, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SearchResult {
  type: 'course' | 'assignment' | 'study';
  id: string;
  title: string;
  subtitle: string;
  link: string;
}

const TopBar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (searchQuery.length >= 2) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);
  
  const performSearch = async () => {
    if (!user) return;
    
    setIsSearching(true);
    
    try {
      // Search courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, code, name')
        .eq('user_id', user.id)
        .or(`code.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%`)
        .limit(5);
      
      if (coursesError) throw coursesError;
      
      // Map courses to search results
      const courseResults: SearchResult[] = (coursesData || []).map(course => ({
        type: 'course',
        id: course.id,
        title: course.code,
        subtitle: course.name,
        link: `/courses`
      }));
      
      // Here you would add similar queries for assignments, study sessions, etc.
      // For demonstration, I'll just combine course results
      setSearchResults(courseResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length >= 2) {
      setShowSearchDialog(true);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      toast.info('Notification functionality coming soon!');
    }
  };
  
  const handleResultClick = (result: SearchResult) => {
    navigate(result.link);
    setShowSearchDialog(false);
    setSearchQuery('');
  };
  
  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <h2 className="text-lg font-semibold hidden md:block">Student Timetable Manager</h2>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search component */}
        <div className="relative">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex items-center relative">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary w-40 md:w-64"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={clearSearch} 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </form>
          
          {/* Quick results dropdown */}
          {searchQuery.length >= 2 && searchResults.length > 0 && !showSearchDialog && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-2">
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Results</h3>
                {searchResults.slice(0, 3).map((result) => (
                  <div 
                    key={`${result.type}-${result.id}`} 
                    className="py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="font-medium text-sm">{result.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{result.subtitle}</div>
                  </div>
                ))}
                {searchResults.length > 3 && (
                  <button 
                    className="w-full text-center text-xs text-primary mt-1 py-1"
                    onClick={() => setShowSearchDialog(true)}
                  >
                    View all {searchResults.length} results
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Theme toggle */}
        <ThemeToggle />
        
        {/* Notification button */}
        <Button variant="ghost" size="icon" className="relative" onClick={toggleNotifications}>
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user ? (
              <>
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/settings">Settings</a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem asChild>
                <a href="/auth">Sign In</a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Full search results dialog */}
      <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <div className="py-2">
            <h2 className="text-lg font-medium mb-4">Search Results</h2>
            
            {isSearching ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <div 
                    key={`dialog-${result.type}-${result.id}`} 
                    className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{result.subtitle}</div>
                    <div className="text-xs text-primary mt-1">{result.type === 'course' ? 'Course' : result.type === 'assignment' ? 'Assignment' : 'Study Session'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default TopBar;
