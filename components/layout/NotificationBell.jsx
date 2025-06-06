import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import NotificationsPanel from '@/components/Notifications/NotificationsPanel';
import { notificationService } from '@/services/notificationService'; // Import notificationService

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Subscribe to notification updates
    const subscription = notificationService.notifications$.subscribe(notifications => {
      const count = notifications.filter(n => !n.read).length;
      setUnreadCount(count);
    });
    // Initial fetch
    notificationService.getNotificationsForCurrentUser();

    return () => subscription.unsubscribe();
  }, []);

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      // Optionally mark notifications as read when panel is opened, or have explicit button
      // For now, let's assume explicit "Mark all as read" in panel
      notificationService.getNotificationsForCurrentUser(); // Refresh notifications when opened
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-primary-text-dark" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-error-red border border-error-red transform translate-x-1/3 -translate-y-1/3">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <NotificationsPanel onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
} 