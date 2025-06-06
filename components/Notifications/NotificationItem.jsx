import React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle, // For general alerts/errors
  CheckCircle2, // For successful verifications, completed goals
  MessageSquare, // For new messages
  UserPlus, // For new partner requests
  Users, // For partner activity
  TrendingUp, // For goal progress/milestones
  Bell, // Default
  ThumbsUp, // Partner check-in
} from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';

const notificationIcons = {
  default: Bell,
  partner_activity: Users,
  verification_request: CheckCircle2,
  system_alert: AlertCircle,
  new_message: MessageSquare,
  partner_request: UserPlus,
  goal_progress: TrendingUp,
  partner_check_in: ThumbsUp,
};

// Example notification types: 
// 'partner_activity', 'verification_request', 'system_alert', 'new_message', 'partner_request', 'goal_progress', 'partner_check_in'

export const NotificationItem = React.memo(({
  notification,
  onClick, // Handles click on the entire item, e.g., to mark as read or navigate
  onActionClick, // Optional: Handles click on a specific action button within the notification
}) => {
  const { id, type = 'default', message, timestamp, read, actor, actionText, actionLink } = notification;

  const IconComponent = notificationIcons[type] || notificationIcons.default;
  const timeAgo = timestamp ? formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true }) : '';

  // console.log(`Rendering NotificationItem: ${id}, Read: ${read}`); // For debugging re-renders

  return (
    <div
      className={cn(
        'flex items-start p-3 sm:p-4 gap-3 sm:gap-4 border-b border-border-subtle last:border-b-0 cursor-pointer hover:bg-primary-beige-light transition-colors duration-150',
        read ? 'bg-background-main' : 'bg-primary-beige-extralight',
      )}
      onClick={() => onClick && onClick(notification)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick && onClick(notification)}
      aria-label={`Notification: ${message}`}
    >
      {/* Icon or Avatar */} 
      <div className="flex-shrink-0 mt-1">
        {actor && actor.avatarUrl ? (
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={actor.avatarUrl} alt={actor.name || 'User avatar'} />
            <AvatarFallback>{actor.name ? actor.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
        ) : (
          <IconComponent 
            className={cn(
              'h-5 w-5 sm:h-6 sm:w-6',
              read ? 'text-secondary-text-light' : 'text-primary-accent'
            )}
          />
        )}
      </div>

      {/* Content */} 
      <div className="flex-grow">
        <p className={cn(
          'text-sm sm:text-base text-primary-text-dark',
          !read && 'font-semibold'
        )}>
          {/* Optional: Actor name could be part of the message or displayed separately */} 
          {/* {actor && actor.name && <span className="font-semibold">{actor.name}</span>} {message} */}
          {message}
        </p>
        {timestamp && (
          <p className="text-xs text-secondary-text-medium mt-0.5 sm:mt-1">{timeAgo}</p>
        )}
        {actionText && onActionClick && (
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevent parent onClick from firing
              onActionClick(notification);
            }}
            className="mt-2 text-sm text-primary-accent font-semibold hover:underline"
          >
            {actionText}
          </button>
        )}
      </div>

      {/* Unread Dot - only if there is no background color difference based on read state */} 
      {/* {!read && (
        <div className="flex-shrink-0 ml-auto self-center">
          <div className="h-2.5 w-2.5 bg-primary-accent rounded-full"></div>
        </div>
      )} */}
    </div>
  );
});

// Add display name for better debugging
NotificationItem.displayName = 'NotificationItem'; 