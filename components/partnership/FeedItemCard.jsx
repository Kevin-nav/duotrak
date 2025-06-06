import React from 'react';
import {
  CheckCircle2,
  MessageSquare, // Will be used if we re-introduce message summaries
  Star,
  Edit3,
  Zap, // For partnership milestones
  SkipForward,
  // AlertCircle, // Not directly used for partner feed items, more for user's items
  PlusCircle, // For new goal set
  Activity as DefaultActivityIcon, // Default
  BookOpen, // For reflections
  TrendingUp, // For goal achieved
  Settings2, // For system config updated
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper function to format relative time
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const then = new Date(timestamp);
  const diffInSeconds = Math.round((now - then) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  const diffInMinutes = Math.round(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.round(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return then.toLocaleDateString();
};

// Helper function to get icon based on new partner-centric types
const getActivityIcon = (type) => {
  switch (type) {
    case 'partner_system_checkin':
      return <CheckCircle2 className="h-5 w-5 text-success-green" />;
    case 'partner_reflection_added':
      return <BookOpen className="h-5 w-5 text-purple-500" />;
    case 'partner_goal_achieved':
      return <Star className="h-5 w-5 text-yellow-500" />;
    case 'partner_system_config_updated':
      return <Settings2 className="h-5 w-5 text-blue-500" />;
    case 'partnership_milestone':
      return <Zap className="h-5 w-5 text-pink-500" />;
    case 'partner_new_goal_set':
      return <PlusCircle className="h-5 w-5 text-primary-accent" />;
    default:
      return <DefaultActivityIcon className="h-5 w-5 text-secondary-text-dark" />;
  }
};

const renderCheckinBody = (content) => (
  <>
    {content.metricValueLogged && (content.metricValueLogged.value || content.metricValueLogged.unit) && (
      <p className="text-xs">
        <span className="font-medium">Logged:</span> {content.metricValueLogged.value} {content.metricValueLogged.unit}
      </p>
    )}
    {content.notesLogged && (
      <p className="text-xs mt-0.5 truncate-2-lines"> {/* Requires CSS for multi-line truncate */}
        <span className="font-medium">Notes:</span> {content.notesLogged}
      </p>
    )}
  </>
);

// Helper function to determine if an activity type is replyable
const isReplyableActivity = (type) => {
  // Make all partner-originated activities replyable by default
  return typeof type === 'string' && type.startsWith('partner_');
};

export const FeedItemCard = ({ activity, onReply }) => {
  if (!activity || !activity.content) {
    // This case should ideally be handled by the parent component (e.g., filter out invalid items)
    // or display a more user-friendly placeholder/error specific to this item.
    // For now, returning null or a minimal error message is fine.
    return null; 
  }

  const { partnerName, type, timestamp, content } = activity;
  const icon = getActivityIcon(type);
  const timeAgo = formatRelativeTime(timestamp);
  const replyable = isReplyableActivity(type);

  let actionText = "";
  let subjectText = "";
  let bodyDetails = null;

  switch (type) {
    case 'partner_system_checkin':
      actionText = content.statusLogged === 'completed' ? "completed" : "skipped";
      subjectText = content.systemName ? `'${content.systemName}'` : "a system";
      bodyDetails = renderCheckinBody(content);
      break;
    case 'partner_reflection_added':
      actionText = "added a reflection";
      subjectText = content.reflectionTitle ? `on '${content.reflectionTitle}'` : "";
      bodyDetails = content.reflectionText ? (
        <p className="text-xs mt-0.5 truncate-3-lines">{content.reflectionText}</p>
      ) : null;
      break;
    case 'partner_goal_achieved':
      actionText = "achieved goal";
      subjectText = content.goalName ? `'${content.goalName}'` : "";
      bodyDetails = content.achievementText ? <p className="text-xs mt-0.5">{content.achievementText}</p> : null;
      break;
    case 'partner_system_config_updated':
      actionText = "updated configuration for";
      subjectText = content.systemName ? `'${content.systemName}'` : "";
      bodyDetails = content.updateText ? <p className="text-xs mt-0.5">{content.updateText}</p> : null;
      break;
    case 'partnership_milestone':
      actionText = content.milestoneText || "reached a milestone";
      // subjectText can remain empty or be a secondary detail if needed
      // bodyDetails can be empty if actionText covers it, or show additional info
      bodyDetails = null; // Or <p className="text-xs mt-0.5">{content.milestoneDetails}</p> if available
      break;
    case 'partner_new_goal_set':
      actionText = "set a new goal";
      subjectText = content.goalName ? `'${content.goalName}'` : "";
      bodyDetails = content.goalDescription ? <p className="text-xs mt-0.5">{content.goalDescription}</p> : null;
      break;
    default:
      actionText = "had an update";
      // Generic fallback for subject if content has a simple 'text' field from an older/unstructured type
      subjectText = typeof content.text === 'string' ? content.text : ""; 
  }

  return (
    <div className="p-3 border-b border-border last:border-b-0 hover:bg-secondary-beige-light/5 transition-colors duration-150 ease-in-out">
      <div className="flex items-start space-x-2.5">
        <div className="flex-shrink-0 mt-0.5">
          {icon}
        </div>
        <div className="flex-grow">
          <p className="text-sm text-primary-text-dark leading-snug">
            <span className="font-semibold">{partnerName || 'Your Partner'}</span>
            {actionText && <span className="ml-1">{actionText}</span>}
            {subjectText && <span className="ml-1 font-medium text-primary-accent">{subjectText}</span>}
          </p>
          
          {bodyDetails && <div className="mt-1 text-secondary-text-medium">{bodyDetails}</div>}

          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500">{timeAgo}</p>
            {replyable && onReply && (
              <button 
                onClick={() => onReply(activity)} 
                className="p-1 text-secondary-text-medium hover:text-primary-accent hover:bg-primary-beige/50 rounded-md transition-colors"
                aria-label="Reply to this activity"
              >
                <MessageSquare size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// For multi-line truncation (e.g., .truncate-2-lines), you would add this to your global CSS:
// .truncate-2-lines {
//   overflow: hidden;
//   text-overflow: ellipsis;
//   display: -webkit-box;
//   -webkit-line-clamp: 2;
//   /* autoprefixer: off */
//   -webkit-box-orient: vertical;
//   /* autoprefixer: on */
// }
// Similarly for .truncate-3-lines with -webkit-line-clamp: 3;

FeedItemCard.displayName = 'FeedItemCard'; 