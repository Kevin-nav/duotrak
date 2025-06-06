import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  ThumbsUp, MessageSquare, CheckCircle2, HelpCircle, Check, Edit3, Star, AlertTriangle, Bell // Import more icons
} from 'lucide-react';

// A simple mapping from iconName to Lucide components
const iconComponents = {
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  HelpCircle,
  Check,
  Edit3,
  Star,
  AlertTriangle,
  Bell // Default/fallback
};

export const NotificationItemCard = ({ notification, onNotificationClick }) => {
  if (!notification) return null;

  const { id, type, timestamp, isRead, actor, title, description, link, iconName } = notification;
  const IconComponent = iconComponents[iconName] || Bell; // Fallback to Bell icon

  const handleCardClick = () => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    // Navigation will be handled by the Link component if link exists
  };

  const formattedTimestamp = formatDistanceToNowStrict(new Date(timestamp), { addSuffix: true });

  const cardContent = (
    <div className={cn(
      "flex items-start p-3 sm:p-4 space-x-3 sm:space-x-4 border-b border-border last:border-b-0",
      !isRead ? 'bg-secondary-beige-light/50' : 'bg-card hover:bg-secondary-beige-light/30',
      "transition-colors duration-150 ease-in-out"
    )}>
      {!isRead && (
        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary-accent flex-shrink-0" aria-label="Unread notification"></div>
      )}
      <div className={cn("flex-shrink-0 text-primary-accent", isRead && "ml-[10px]")}> {/* Add left margin if read to align with unread dot */} 
        <IconComponent size={20} className="mt-0.5" />
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start">
          <p className={cn(
            "text-sm text-primary-text-dark",
            !isRead && "font-semibold"
          )} title={title || ''}>
            {actor?.name && (
              <span className="font-medium">{actor.name}</span>
            )}
            {actor?.name && title ? ': ' : ''}
            {title || 'Notification'}
          </p>
          <p className={cn(
            "text-xs text-secondary-text-medium whitespace-nowrap ml-2 flex-shrink-0",
             !isRead && "font-medium"
            )}>
            {formattedTimestamp}
          </p>
        </div>
        {description && (
          <p className="text-xs text-secondary-text-medium mt-0.5 truncate" title={description}>
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link} passHref legacyBehavior>
        <a onClick={handleCardClick} className="block cursor-pointer">
          {cardContent}
        </a>
      </Link>
    );
  }

  return (
    <div onClick={handleCardClick} className="cursor-pointer">
      {cardContent}
    </div>
  );
}; 