import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useNotifications } from '@/lib/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem, // Can be used for actions like "View All"
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area'; // For scrollable list
import { Bell, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/Feedback/EmptyState';

export const NotificationDropdownPanel = ({ userId }) => {
  const router = useRouter();
  const {
    notifications,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    unreadCount,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications, // Added for potential refresh action
  } = useNotifications(userId, 5); // Fetch 5 items initially for dropdown

  // Memoize handleNotificationClick with useCallback
  const handleNotificationClick = useCallback((notification) => {
    markAsRead(notification.id);
    if (notification.actionLink) {
      router.push(notification.actionLink);
    }
    // Potentially close dropdown here if needed, depends on DropdownMenu behavior
  }, [markAsRead, router]);

  const handleViewAllClick = useCallback(() => {
    router.push('/activity'); 
  }, [router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-accent"></span>
            </span>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 sm:w-96 p-0" align="end">
        <div className="p-3 sm:p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-primary-text-dark">Notifications</h3>
            {notifications.length > 0 && unreadCount > 0 && (
              <Button variant="link" size="sm" onClick={markAllAsRead} className="p-0 h-auto text-xs">
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        <DropdownMenuSeparator className="my-0" />

        {isLoading && notifications.length === 0 && (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-primary-accent" />
          </div>
        )}

        {!isLoading && error && (
          <div className="p-4 text-center">
            <p className="text-sm text-destructive">Error loading notifications.</p>
            <Button variant="link" size="sm" onClick={refreshNotifications} className="mt-1">
              Try again
            </Button>
          </div>
        )}
        
        {!isLoading && !error && notifications.length === 0 && (
          <div className="h-32 flex flex-col justify-center items-center">
            <EmptyState 
              title="No New Notifications" 
              message="You're all caught up!" 
              iconType="bell-off" // Assuming EmptyState can take an icon string
              small
            />
          </div>
        )}

        {notifications.length > 0 && (
          <ScrollArea className="max-h-80">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
          </ScrollArea>
        )}

        {(hasNextPage || notifications.length > 0) && <DropdownMenuSeparator className="my-0" />}
        
        <div className="p-2 flex justify-center">
          {hasNextPage && !isLoadingMore && (
            <Button variant="ghost" size="sm" onClick={loadMoreNotifications} className="w-full">
              Load more
            </Button>
          )}
          {isLoadingMore && (
             <Button variant="ghost" size="sm" disabled className="w-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
          )}
          {!hasNextPage && notifications.length > 0 && (
             <Button variant="ghost" size="sm" onClick={handleViewAllClick} className="w-full">
                View all notifications
             </Button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 