import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, X, ExternalLink, AlertTriangle, Info, Award, MessageSquare, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { notificationService } from '@/services/notificationService'; // Import notificationService
import { toast } from 'sonner';

const getIconForNotification = (type) => {
  switch (type) {
    case 'verification_request': return <HelpCircle className="w-5 h-5 text-blue-500" />;
    case 'goal_progress': return <Award className="w-5 h-5 text-green-500" />;
    case 'new_message': return <MessageSquare className="w-5 h-5 text-purple-500" />;
    case 'general': return <Info className="w-5 h-5 text-gray-500" />;
    default: return <Bell className="w-5 h-5 text-gray-400" />;
  }
};

const NotificationItem = ({ notification, onClosePanel }) => {
  const handleNotificationClick = async () => {
    if (!notification.read) {
      await notificationService.markAsRead(notification.id);
    }
    // If there's a link, router.push or window.location might be used here.
    // For now, just close panel if it's a link click.
    if (notification.link) {
      onClosePanel(); // Close panel before navigating
    }
  };

  const timeAgo = formatDistanceToNow(parseISO(notification.timestamp), { addSuffix: true });

  const content = (
    <div 
      className={cn(
        "flex items-start space-x-3 p-3 hover:bg-secondary-beige-extralight transition-colors duration-150",
        !notification.read && "bg-primary-beige-light/50",
        notification.link && "cursor-pointer"
      )}
      onClick={notification.link ? handleNotificationClick : undefined}
    >
      <div className="flex-shrink-0 mt-1">
        {getIconForNotification(notification.type)}
      </div>
      <div className="flex-grow">
        <p className={cn("text-sm text-primary-text-dark font-medium leading-snug", !notification.read && "font-semibold")}>
          {notification.message}
        </p>
        <p className={cn("text-xs text-secondary-text-medium", !notification.read ? "text-primary-accent" : "text-gray-500")}>
          {timeAgo}
        </p>
      </div>
      {!notification.read && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-primary-accent rounded-full" title="Unread"></div>
      )}
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} passHref legacyBehavior>
        <a className="block relative">
          {content}
        </a>
      </Link>
    );
  }
  return <div className="relative">{content}</div>;
};

export default function NotificationsPanel({ onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscription = notificationService.notifications$.subscribe(updatedNotifications => {
      setNotifications(updatedNotifications);
      setIsLoading(false);
    });
    notificationService.getNotificationsForCurrentUser(); // Initial fetch

    return () => subscription.unsubscribe();
  }, []);

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    try {
      await notificationService.markAllAsRead();
      // The BehaviorSubject will update the state automatically
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error("Failed to mark all as read.");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-full max-h-[70vh] bg-card-modal-background shadow-xl">
      <header className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card-modal-background z-10">
        <h2 className="text-lg font-semibold text-primary-text-dark">Notifications</h2>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button variant="link" size="sm" onClick={handleMarkAllAsRead} className="text-xs text-primary-accent p-0 h-auto">
              <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark all as read
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose} className="text-secondary-text-medium hover:bg-secondary-beige-light/50">
            <X className="h-5 w-5" />
            <span className="sr-only">Close notifications</span>
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex-grow flex items-center justify-center p-4">
          <Bell className="w-8 h-8 text-gray-300 animate-pulse mb-2" /> 
          <p className="text-sm text-secondary-text-medium">Loading notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <Bell className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-md font-semibold text-primary-text-dark mb-1">No Notifications Yet</h3>
          <p className="text-xs text-secondary-text-medium">Important updates and alerts will appear here.</p>
        </div>
      ) : (
        <ScrollArea className="flex-grow overflow-y-auto">
          <div className="divide-y divide-border">
            {notifications.map(notif => (
              <NotificationItem key={notif.id} notification={notif} onClosePanel={onClose} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
} 