import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/button';
import { Loader2, Inbox, AlertTriangle, ListFilter } from 'lucide-react'; // Added ListFilter for future use
import { MyTaskItemCard } from '@/components/tasks/MyTaskItemCard'; // Uncommented
import { myTasksService } from '@/services/myTasksService';
import { toast } from 'sonner';

export default function MyTasksPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filters, setFilters] = useState({}); // For future filter implementation

  const MOCK_USER_ID = user?.id || 'user123';

  const fetchTasks = useCallback(async (pageToFetch, shouldAppend = false) => {
    if (pageToFetch === 1 && !shouldAppend) setIsLoading(true); else setIsFetchingMore(true);
    setError(null);

    try {
      const response = await myTasksService.getAllMyTasks(MOCK_USER_ID, {
        page: pageToFetch,
        limit: 10, // Number of tasks per page
        filters: filters,
      });

      if (response.success && response.tasks) {
        setTasks(prev => 
          shouldAppend ? [...prev, ...response.tasks] : response.tasks
        );
        setHasNextPage(response.pagination.hasNextPage);
        setCurrentPage(response.pagination.currentPage);
      } else {
        throw new Error(response.message || 'Failed to fetch your tasks.');
      }
    } catch (err) {
      setError(err.message || 'Could not load your tasks.');
      toast.error(err.message || 'Could not load your tasks.');
    }
    if (pageToFetch === 1 && !shouldAppend) setIsLoading(false); else setIsFetchingMore(false);
  }, [MOCK_USER_ID, filters]);

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/my-tasks');
    }
  }, [isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks(1, false); // Initial fetch
    }
  }, [isAuthenticated, fetchTasks]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingMore) {
      fetchTasks(currentPage + 1, true);
    }
  };

  // Placeholder for filter change handler
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    // fetchTasks(1, false) will be triggered by useEffect on filters change if filters is in dependency array
  };

  if (authIsLoading || (!isAuthenticated && !error)) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-var(--global-nav-height,80px))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary-accent mb-4" />
        <p className="text-secondary-text-medium">Loading your tasks...</p>
      </div>
    );
  }
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary-accent mx-auto mb-3" />
          <p className="text-secondary-text-medium">Fetching your tasks...</p>
        </div>
      );
    }

    if (error && tasks.length === 0) {
      return (
        <div className="text-center py-10 px-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-primary-text-dark mb-1">Oops! Something went wrong.</h3>
          <p className="text-secondary-text-medium mb-4">{error}</p>
          <Button onClick={() => fetchTasks(1, false)} variant="outline">Try Again</Button>
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="text-center py-10 px-4">
          <Inbox className="h-16 w-16 text-secondary-text-medium mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-text-dark mb-1">No Tasks Found</h3>
          <p className="text-secondary-text-medium">You don\'t have any tasks here yet. New tasks assigned to you will appear here.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {tasks.map(task => (
          <MyTaskItemCard key={task.id} task={task} />
        ))}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Tasks - DuoTrak</title>
        <meta name="description" content="View and manage all your assigned tasks and their progress." />
      </Head>
      <div className="container mx-auto py-4 md:py-6 lg:py-8 px-2 sm:px-4">
        <ScreenHeader 
          title="My Tasks"
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "My Tasks", isCurrent: true }]}
        />
        
        {/* Placeholder for Filters - Future Phase */}
        {/* <div className="mb-4 md:mb-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <h2 className="text-lg font-semibold text-primary-text-dark">Task History</h2>
          <Button variant="outline" size="sm">
            <ListFilter size={16} className="mr-2" />
            Filters
          </Button>
        </div> */}

        <div className="mt-4 md:mt-6">
          {renderContent()}
        </div>

        {hasNextPage && (
          <div className="mt-6 text-center">
            <Button onClick={handleLoadMore} variant="outline" disabled={isFetchingMore}>
              {isFetchingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isFetchingMore ? 'Loading...' : 'Load More Tasks'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
} 