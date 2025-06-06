import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SmilePlus, ThumbsUp, Heart, Laugh, Wow, Annoyed, CornerDownRight, Check, CheckCheck, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const PREDEFINED_REACTIONS = [
  { id: 'thumbsup', emoji: '👍', name: 'Thumbs Up' },
  { id: 'heart', emoji: '❤️', name: 'Heart' },
  { id: 'laugh', emoji: '😂', name: 'Laughing' },
  { id: 'wow', emoji: '😮', name: 'Wow' },
  { id: 'sad', emoji: '😢', name: 'Sad' },
];

export function MessageBubble({ message, isCurrentUser, onReaction, currentUserId }) {
  if (!message) return null;

  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const reactionPickerRef = useRef(null);

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleReactionSelection = (reactionEmoji) => {
    if (onReaction) {
      onReaction(message.id, reactionEmoji);
    }
    setShowReactionPicker(false); // Close picker after selection
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target)) {
        const reactButton = document.getElementById(`react-button-${message.id}`);
        if (reactButton && reactButton.contains(event.target)) {
          return;
        }
        setShowReactionPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reactionPickerRef, message.id]);

  const validReactions = message.reactions?.filter(r => r.count > 0) || [];
  const replyingToSummary = message.replyingTo?.summary;
  // Attempt to get partner name from original activity if available, fallback needed
  const replyingToPartnerName = message.replyingTo?.originalActivity?.partnerName || "Partner"; 

  const handleReactionClick = (reaction) => {
    // ... (handleReactionClick logic remains the same)
  };

  const getReactionSummary = () => {
    // ... (getReactionSummary logic remains the same)
  };

  return (
    <div className={cn("flex flex-col group", isCurrentUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "relative max-w-[70%] md:max-w-[60%] rounded-xl px-3 py-2",
          isCurrentUser 
            ? "bg-secondary-beige-light text-primary-text-dark rounded-br-none shadow-lg"
            : "bg-card text-primary-text-dark rounded-bl-none shadow-sm",
          message.status === 'failed' && "bg-red-200 border border-destructive",
          message.status === 'sending' && "opacity-70"
        )}
      >
        {/* Quoted Reply Section */}
        {message.replyingTo && message.replyingTo.summary && (
          <div className={cn(
            "mb-1.5 pt-1 pb-1.5 px-2 text-xs rounded-md",
            isCurrentUser ? "bg-white/20" : "bg-secondary-beige-light/70 text-secondary-text-medium"
          )}>
            <div className="flex items-center gap-1 font-medium">
                <CornerDownRight size={12} className={isCurrentUser ? "text-white/80" : "text-primary-accent/80"} />
                <span>Replying to {message.replyingTo.partnerName || (isCurrentUser ? 'Partner' : 'You')}</span> 
            </div>
            <p className="mt-0.5 italic truncate">
              {message.replyingTo.summary}
            </p>
          </div>
        )}

        {/* Image Display */}
        {message.imageUrl && (
          <div className={`mb-1.5 ${!message.text ? 'mt-0' : ''}`}> {/* Add margin only if text follows */}
            <img 
              src={message.imageUrl} 
              alt={message.text ? `Image for message: ${message.text.substring(0,30)}` : "Chat image"} 
              className="rounded-md max-w-full h-auto max-h-64 object-contain cursor-pointer" // Basic styling for inline image
              onClick={() => console.log("Image clicked:", message.imageUrl)} // Placeholder for future lightbox
            />
          </div>
        )}

        {/* Message Text (if exists) */}
        {message.text && (
          <p className="whitespace-pre-wrap break-words text-sm">
            {message.text}
          </p>
        )}

        {/* Timestamp and Status */}
        <div className={cn("text-xs mt-1", isCurrentUser ? "text-black/80" : "text-secondary-text-medium/80", "flex items-center justify-end space-x-1")}>
          <span>{formatTimestamp(message.timestamp)}</span>
          {isCurrentUser && (
            <>
              {message.status === 'sending' && <Check size={12} className="text-black opacity-50" />}
              {message.status === 'sent' && <Check size={12} className="text-black" />}
              {message.status === 'delivered' && <CheckCheck size={12} className="text-black" />}
              {message.status === 'read' && <CheckCheck size={12} className="text-black" />}
              {message.status === 'failed' && <AlertCircle size={12} className="text-destructive" />}
            </>
          )}
        </div>

        {/* Reactions Display - existing logic */}
        {validReactions.length > 0 && (
          <div className={cn("mt-0.5 flex flex-wrap gap-1", isCurrentUser ? "justify-end" : "justify-start")}>
            {validReactions.map(reaction => {
              const reactionEmojiObj = PREDEFINED_REACTIONS.find(pr => pr.emoji === reaction.emoji);
              const userHasReacted = currentUserId && reaction.users.includes(currentUserId);
              return (
                <button 
                  key={reaction.emoji}
                  onClick={() => reactionEmojiObj && onReaction && onReaction(message.id, reactionEmojiObj)}
                  className={cn(
                    "px-1.5 py-0.5 text-xs rounded-full border flex items-center transition-colors",
                    userHasReacted 
                      ? "bg-primary-accent/20 border-primary-accent text-primary-accent"
                      : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700"
                  )}
                  title={reaction.name}
                >
                  <span className="mr-1">{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Reaction Picker Trigger - existing logic (conditionally rendered for non-failed messages) */}
        {!isCurrentUser && (
          <button 
            id={`react-button-${message.id}`}
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-1 p-1 rounded-full bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 z-10 md:flex items-center justify-center hidden"
            aria-label="Add reaction"
          >
            <SmilePlus className="h-4 w-4 text-gray-500" />
          </button>
        )}
        {isCurrentUser && (
          <button 
            id={`react-button-${message.id}`}
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="absolute right-full top-1/2 -translate-y-1/2 mr-1 p-1 rounded-full bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 z-10 md:flex items-center justify-center hidden"
            aria-label="Add reaction"
          >
            <SmilePlus className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
      {/* ... (Reaction picker UI - existing logic) ... */}
    </div>
  );
} 