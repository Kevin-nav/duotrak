import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { NotificationItem } from '@/components/Notifications/NotificationItem';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { ScreenHeader } from '@/components/layout/ScreenHeader'; // Assuming a reusable header
import { EmptyState } from '@/components/Feedback/EmptyState';
import { ErrorDisplay } from '@/components/Feedback/ErrorDisplay';
// import { useAuth } from '@/context/AuthContext'; // Placeholder for auth

export default function ActivityPage() {
  const router = useRouter();
  // const { user } = useAuth(); // Example: Get user from AuthContext
  const userId = 'user123'; // Mock user ID for now

  const {
    notifications,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    unreadCount, // Though not directly displayed here, could be useful
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotifications(userId, 15); // Fetch more items for a full page view

  const handleNotificationClick = useCallback((notification) => {
    markAsRead(notification.id);
    if (notification.actionLink) {
      router.push(notification.actionLink);
    }
  }, [markAsRead, router]);

  return (
    <div className="min-h-screen bg-background-main">
      <ScreenHeader 
        title="Activity Feed" 
        // subtitle={`${unreadCount > 0 ? unreadCount + ' unread' : 'All caught up'}`}
      >
        {notifications.length > 0 && (
           <div className="flex items-center gap-2">
            {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                </Button>
            )}
            <Button variant="ghost" size="icon" onClick={refreshNotifications} aria-label="Refresh notifications">
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
           </div>
        )}
      </ScreenHeader>

      <div className="container mx-auto p-0 sm:p-4 md:p-6 lg:p-8">
        {isLoading && notifications.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary-accent" />
          </div>
        )}

        {!isLoading && error && (
          <div className="p-4">
            <ErrorDisplay 
              title="Could Not Load Activity"
              message={error}
              retryFunction={refreshNotifications}
            />
          </div>
        )}

        {!isLoading && !error && notifications.length === 0 && (
          <div className="py-20">
            <EmptyState 
              title="No Activity Yet"
              message="Notifications about your systems and partner activity will appear here."
              iconType="bell-off"
            />
          </div>
        )}

        {notifications.length > 0 && (
          <div className="bg-card-modal-background sm:rounded-lg sm:shadow-duotrak-card overflow-hidden">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="py-6 text-center">
            <Button 
              onClick={loadMoreNotifications} 
              disabled={isLoadingMore}
              variant="outline"
              size="lg"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load more activity'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 