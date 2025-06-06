import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/button';
import { Loader2, Inbox, AlertTriangle } from 'lucide-react';
import { NotificationItemCard } from '@/components/notifications/NotificationItemCard';
import { notificationService } from '@/services/notificationService';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' or 'unread' - for future use

  const MOCK_USER_ID = user?.id || 'user123'; // Use authenticated user ID or fallback

  const fetchNotifications = useCallback(async (pageToFetch, shouldAppend = false) => {
    if (pageToFetch === 1 && !shouldAppend) setIsLoading(true); else setIsFetchingMore(true);
    setError(null);

    try {
      const response = await notificationService.getNotificationsForCurrentUser({
        page: pageToFetch,
        limit: 15,
        filter: filter,
      });

      if (response.success && response.notifications) {
        setNotifications(prev => 
          shouldAppend ? [...prev, ...response.notifications] : response.notifications
        );
        setHasNextPage(response.pagination.hasNextPage);
        setCurrentPage(response.pagination.currentPage);
      } else {
        throw new Error(response.message || 'Failed to fetch notifications.');
      }
    } catch (err) {
      setError(err.message || 'Could not load notifications.');
      toast.error(err.message || 'Could not load notifications.');
    }
    if (pageToFetch === 1 && !shouldAppend) setIsLoading(false); else setIsFetchingMore(false);
  }, [MOCK_USER_ID, filter]);

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/notifications');
    }
  }, [isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications(1, false); // Initial fetch
    }
  }, [isAuthenticated, fetchNotifications]);

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingMore) {
      fetchNotifications(currentPage + 1, true);
    }
  };
  
  const handleNotificationItemClick = useCallback((notification) => {
    // For now, just log. Later, mark as read and navigate if link exists.
    console.log("Notification clicked:", notification);
    // Example: Mark as read optimistically and then call service
    if (!notification.isRead) {
        setNotifications(prev => prev.map(n => n.id === notification.id ? {...n, isRead: true} : n));
        notificationService.markAsRead(notification.id)
            .then(res => {
                if(!res.success) console.error("Failed to mark notification as read on server");
            })
            .catch(err => console.error("Error marking notification as read:", err));
    }
    // Navigation is handled by Link component in NotificationItemCard if link exists
  }, []);

  if (authIsLoading || (!isAuthenticated && !error)) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-var(--global-nav-height,80px))]">
        <Loader2 className="h-12 w-12 animate-spin text-primary-accent mb-4" />
        <p className="text-secondary-text-medium">Loading notifications...</p>
      </div>
    );
  }
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary-accent mx-auto mb-3" />
          <p className="text-secondary-text-medium">Fetching your notifications...</p>
        </div>
      );
    }

    if (error && notifications.length === 0) {
      return (
        <div className="text-center py-10 px-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-primary-text-dark mb-1">Oops! Something went wrong.</h3>
          <p className="text-secondary-text-medium mb-4">{error}</p>
          <Button onClick={() => fetchNotifications(1, false)} variant="outline">Try Again</Button>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="text-center py-10 px-4">
          <Inbox className="h-16 w-16 text-secondary-text-medium mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary-text-dark mb-1">No Notifications Yet</h3>
          <p className="text-secondary-text-medium">When there's new activity, you'll see it here.</p>
        </div>
      );
    }

    return (
      <div className="border border-border rounded-lg shadow-sm bg-card overflow-hidden">
        {notifications.map(notification => (
          <NotificationItemCard 
            key={notification.id} 
            notification={notification} 
            onNotificationClick={handleNotificationItemClick} 
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Your Notifications - DuoTrak</title>
        <meta name="description" content="View all your notifications and updates from DuoTrak." />
      </Head>
      <div className="container mx-auto py-4 md:py-6 lg:py-8 px-2 sm:px-4">
        <ScreenHeader 
          title="Notifications"
          // breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Notifications", isCurrent: true }]}
        />
        
        {/* Placeholder for Filters and Mark All Read Button - to be added in Phase 2 */}
        {/* <div className="mb-4 flex justify-between items-center">
          <SegmentedControl for filter />
          <Button variant="outline" size="sm" onClick={() => console.log('Mark all as read clicked')}>Mark all as read</Button>
        </div> */}

        <div className="mt-4 md:mt-6">
          {renderContent()}
        </div>

        {hasNextPage && !isFetchingMore && (
          <div className="mt-6 text-center">
            <Button onClick={handleLoadMore} variant="outline" disabled={isFetchingMore}>
              Load More Notifications
            </Button>
          </div>
        )}
        {isFetchingMore && (
          <div className="text-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary-accent" />
          </div>
        )}
      </div>
    </>
  );
} 