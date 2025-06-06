import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { partnershipService } from '@/services/partnershipService'; // Import the service
import { toast } from 'sonner'; // For notifications
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area"; // For messages container
import { Send, Loader2, Smile, Check, X, HelpCircle, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CheckCircle2, // system_completed, checkin_verified
  MessageSquare, // message_sent
  Star, // goal_achieved
  Edit3, // system_updated, reflection_added
  Zap, // partnership_anniversary (or a gift icon)
  SkipForward, // system_skipped
  AlertCircle, // checkin_queried
  PlusCircle, // new_goal_set
  Activity, // default, system_checkin
} from 'lucide-react';
import { MessageBubble, PREDEFINED_REACTIONS as messageBubblePredefinedReactions } from '@/components/partnership/MessageBubble'; // Import MessageBubble and PREDEFINED_REACTIONS
import Picker from 'emoji-picker-react'; // Import Picker
import { FeedItemCard } from '@/components/partnership/FeedItemCard'; // Import the new FeedItemCard

// Placeholder components, will be developed in later subtasks
const PartnerDayView = () => {
  const [systems, setSystems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Assuming partnerId might come from user context or a specific partnership object

  useEffect(() => {
    const fetchPartnerSystems = async () => {
      // In a real app, you'd get the actual partnerId associated with the current user.
      // For this stub, we'll use a mock or assume it's part of the user object if available.
      const mockPartnerId = user?.partnerDetails?.id || "mockPartner123"; 
      if (!mockPartnerId) {
          setError("Partner ID not available to fetch systems.");
          setIsLoading(false);
          return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await partnershipService.getPartnerTodaysSystems(mockPartnerId);
        if (response.success && response.systems) {
          setSystems(response.systems);
        } else {
          throw new Error(response.message || "Failed to fetch partner's systems.");
        }
      } catch (err) {
        console.error("Fetch partner systems error:", err);
        setError(err.message || "Could not load partner's systems for today.");
        toast.error(err.message || "Could not load partner's systems.");
      }
      setIsLoading(false);
    };

    fetchPartnerSystems();
  }, [user]); // Re-fetch if user context changes (e.g. partner details load)

  if (isLoading) {
    return <div className="p-4 text-center text-primary-text-dark">Loading partner's day...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-error-red">Error: {error}</div>;
  }

  return (
    <Card className="shadow-duotrak-card">
      <CardHeader>
        <CardTitle className="text-xl text-primary-text-dark">Partner's Focus for Today</CardTitle>
        <CardDescription>Here's what your partner is working on.</CardDescription>
      </CardHeader>
      <CardContent>
        {systems.length === 0 ? (
          <p className="text-secondary-text-medium">No systems scheduled for your partner today, or data is unavailable.</p>
        ) : (
          <ul className="space-y-3">
            {systems.map(system => (
              <li key={system.id} className="p-3 border rounded-md bg-white hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-md text-primary-text-dark">{system.name}</h3>
                    <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium text-white whitespace-nowrap",
                        system.status === "Completed" ? "bg-success-green" :
                        system.status === "In Progress" ? "bg-info-blue" :
                        system.status === "Pending" ? "bg-warning-orange" :
                        "bg-gray-400"
                    )}>
                        {system.status}
                    </span>
                </div>
                {system.details && <p className="text-sm text-secondary-text-medium mt-1">{system.details}</p>}
                {/* Potentially add interaction buttons here, e.g., 'Send Encouragement' */}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

const ActivityFeedView = ({ onReplyToActivity }) => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const { user } = useAuth();

  const fetchActivities = useCallback(async (pageToFetch) => {
    if (pageToFetch === 1) setIsLoading(true); else setIsFetchingMore(true);
    setError(null);
    try {
      const mockPartnerId = user?.partnerDetails?.id || "mockPartner123";
      const response = await partnershipService.getPartnerActivityFeed(mockPartnerId, pageToFetch);
      if (response.success && response.activities) {
        setActivities(prev => pageToFetch === 1 ? response.activities : [...prev, ...response.activities]);
        setHasNextPage(response.pagination.hasNextPage);
        setCurrentPage(response.pagination.currentPage);
      } else {
        throw new Error(response.message || "Failed to fetch activity feed.");
      }
    } catch (err) {
      setError(err.message || "Could not load activity feed.");
      if(pageToFetch === 1) toast.error(err.message || "Could not load activity feed.");
    }
    if (pageToFetch === 1) setIsLoading(false); else setIsFetchingMore(false);
  }, [user]);

  useEffect(() => {
    fetchActivities(1); // Initial fetch
  }, [fetchActivities]);

  if (isLoading) return <div className="p-4 text-center text-primary-text-dark">Loading activity feed...</div>;
  if (error && activities.length === 0) return <div className="p-4 text-center text-error-red">Error: {error}</div>;

  return (
    <Card className="shadow-duotrak-card">
      <CardHeader>
        <CardTitle className="text-xl text-primary-text-dark">Partner Activity</CardTitle>
        <CardDescription>Stay updated with your partner's recent actions and milestones.</CardDescription>
      </CardHeader>
      <CardContent>
        {activities.length === 0 && !isLoading && !error && (
          <p className="text-secondary-text-medium">No activities to display yet.</p>
        )}
        {activities.length > 0 && (
          <div className="space-y-0">
            {activities.map(activity => (
              <FeedItemCard 
                key={activity.id} 
                activity={activity} 
                onReply={onReplyToActivity}
              />
            ))}
          </div>
        )}
        {error && activities.length > 0 && <p className="text-error-red mt-2 text-sm">Error loading more: {error}</p>}
        {hasNextPage && !isFetchingMore && (
          <div className="mt-6 text-center">
            <Button onClick={() => fetchActivities(currentPage + 1)} variant="outline">
              Load More Activities
            </Button>
          </div>
        )}
        {isFetchingMore && <p className="text-center mt-4 text-primary-text-dark">Loading more...</p>}
      </CardContent>
    </Card>
  );
};

const ChatView = ({ replyContext, setReplyContext }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageFileToSend, setImageFileToSend] = useState(null);

  const { user } = useAuth();
  const partnerId = user?.partnerDetails?.id || "mockPartner123";
  const currentUserId = user?.id;

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const initialScrollDone = useRef(false);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = useCallback((behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, []);

  const fetchMessages = useCallback(async (pageToFetch, isInitialLoad = false) => {
    if (isInitialLoad) setIsLoadingMessages(true); else setIsFetchingMore(true);
    setError(null);
    
    let scrollPositionToRestore = null;
    if (chatContainerRef.current && !isInitialLoad) {
      const { scrollTop, scrollHeight } = chatContainerRef.current.getViewport();
      scrollPositionToRestore = scrollHeight - scrollTop;
    }

    try {
      const response = await partnershipService.getChatMessages(partnerId, { page: pageToFetch, limit: 20 });
      if (response.success && response.messages) {
        const messagesWithReactions = response.messages.map(msg => ({
          ...msg,
          reactions: msg.reactions || [], // Ensure reactions array exists
        })).reverse();

        setMessages(prev => isInitialLoad ? messagesWithReactions : [...messagesWithReactions, ...prev]);
        setHasNextPage(response.pagination.hasNextPage);
        setCurrentPage(response.pagination.currentPage);
        
        if (isInitialLoad && response.messages.length > 0) {
            initialScrollDone.current = false;
        } else if (chatContainerRef.current && scrollPositionToRestore && !isInitialLoad) {
          requestAnimationFrame(() => {
            const newScrollHeight = chatContainerRef.current.getViewport().scrollHeight;
            chatContainerRef.current.getViewport().scrollTop = newScrollHeight - scrollPositionToRestore;
          });
        }
      } else {
        throw new Error(response.message || "Failed to fetch messages.");
      }
    } catch (err) {
      console.error("Fetch messages error:", err);
      setError(err.message || "Could not load messages.");
    }
    if (isInitialLoad) setIsLoadingMessages(false); else setIsFetchingMore(false);
  }, [partnerId, currentUserId]);

  useEffect(() => {
    if (partnerId && currentUserId) {
      fetchMessages(1, true);
    }
  }, [fetchMessages, partnerId, currentUserId]);

  useEffect(() => {
    if (!isLoadingMessages && messages.length > 0 && !isFetchingMore && !initialScrollDone.current) {
      scrollToBottom("auto");
      initialScrollDone.current = true;
    }
  }, [messages, isLoadingMessages, isFetchingMore, scrollToBottom]);

  const handleImageSelect = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setImageFileToSend(file);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = null;
  };

  const cancelImagePreview = () => {
    setImagePreviewUrl(null);
    setImageFileToSend(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFileToSend) return;
    if (!currentUserId) return;

    setIsSendingMessage(true);
    setError(null);
    const tempId = `temp-${Date.now()}`;
    
    const optimisticMessage = {
      id: tempId,
      text: newMessage,
        senderId: currentUserId,
        timestamp: new Date().toISOString(),
      status: 'sending',
      reactions: [],
      replyingTo: replyContext ? { activityId: replyContext.id, summary: replyContext.text } : null,
      imageUrl: imagePreviewUrl,
    };

    setMessages(prev => [...prev, optimisticMessage]);
    const messageTextToSend = newMessage;
    const imageToSend = imageFileToSend;

    setNewMessage('');
    cancelImagePreview();
    if (replyContext) {
      setReplyContext(null);
    }
    setTimeout(() => scrollToBottom("smooth"), 0);

    try {
      const response = await partnershipService.sendChatMessage(partnerId, currentUserId, messageTextToSend, replyContext?.originalActivity?.id, imageToSend);
      
      if (response.success && response.sentMessage) {
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? { ...response.sentMessage, status: 'sent', reactions: response.sentMessage.reactions || [], replyingTo: msg.replyingTo, imageUrl: response.sentMessage.imageUrl || msg.imageUrl } 
            : msg
        ));
      } else {
        throw new Error(response.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Send message error:", err);
      setError(err.message || "Could not send message.");
      setMessages(prev => prev.map(msg => msg.id === tempId ? { ...optimisticMessage, status: 'failed' } : msg));
    }
    setIsSendingMessage(false);
  };
  
  const handleScroll = (event) => {
    const target = event.target;
    if (target.scrollTop === 0 && hasNextPage && !isFetchingMore && !isLoadingMessages) {
      fetchMessages(currentPage + 1);
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(prevInput => prevInput + emojiObject.emoji);
  };

  const handleMessageReaction = useCallback(async (messageId, reactionEmoji) => {
    if (!currentUserId) return;

    let reactedMessage = null;

    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          reactedMessage = { ...msg };
          const existingReactions = msg.reactions || [];
          let newReactions = [...existingReactions];
          const reactionTypeIndex = newReactions.findIndex(r => r.emoji === reactionEmoji.emoji);

          if (reactionTypeIndex > -1) {
            const reaction = newReactions[reactionTypeIndex];
            const userIndex = reaction.users.indexOf(currentUserId);
            if (userIndex > -1) {
              const updatedUsers = reaction.users.filter(uid => uid !== currentUserId);
              if (updatedUsers.length === 0) {
                newReactions.splice(reactionTypeIndex, 1);
              } else {
                newReactions[reactionTypeIndex] = { ...reaction, users: updatedUsers, count: updatedUsers.length };
              }
            } else {
              newReactions[reactionTypeIndex] = { ...reaction, users: [...reaction.users, currentUserId], count: reaction.users.length + 1 };
            }
          } else {
            newReactions.push({
              id: reactionEmoji.id,
              emoji: reactionEmoji.emoji,
              name: reactionEmoji.name,
              users: [currentUserId],
              count: 1,
            });
          }
          return { ...msg, reactions: newReactions };
        }
        return msg;
      })
    );

    if (reactedMessage && reactedMessage.imageUrl && reactedMessage.senderId !== currentUserId) {
      try {
        await partnershipService.notifyPartnerOfReaction(
          partnerId,
          currentUserId,
          reactedMessage.senderId,
          reactedMessage.id,
          reactionEmoji.emoji,
          reactedMessage.text ? 'message_with_image' : 'image'
        );
        console.log("Reaction notification sent for image message:", reactedMessage.id);
      } catch (error) {
        console.error("Failed to send reaction notification:", error);
      }
    }
  }, [currentUserId, partnerId]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        // Check if the click was on the toggle button itself to prevent immediate closing
        const emojiButton = document.getElementById('emoji-picker-button');
        if (emojiButton && emojiButton.contains(event.target)) {
          return;
        }
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);

  // Conditional rendering for initial loading or missing partner/user details
  if (!partnerId || !currentUserId) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4 bg-card-modal-background text-secondary-text-medium">
        Partnership details not available or still loading.
      </div>
    );
  }

  if (isLoadingMessages && messages.length === 0 && !error) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4 bg-card-modal-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary-accent"/>
        <p className="mt-2 text-sm text-secondary-text-medium">Loading messages...</p>
      </div>
    );
  }
  
  // Error state when initial message load fails
  if (error && messages.length === 0 && !isLoadingMessages && !isFetchingMore) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4 bg-card-modal-background text-destructive">
        <AlertCircle className="h-8 w-8 mb-2" />
        <p className="text-sm font-medium">Failed to load messages</p>
        <p className="text-xs">{error}</p>
        <Button onClick={() => fetchMessages(1, true)} variant="outline" size="sm" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card-modal-background overflow-hidden"> 
      <ScrollArea 
        className="flex-grow"
        ref={chatContainerRef}
        onScroll={handleScroll}
      >
        <div className="p-4 space-y-3 min-h-[50px]"> {/* min-h to ensure scroll events fire if content is short initially */}
          {isFetchingMore && (
            <div className="text-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary-accent inline-block"/>
            </div>
          )}
          {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isCurrentUser={msg.senderId === currentUserId} 
              onReaction={handleMessageReaction}
              currentUserId={currentUserId}
              />
            ))}
          {messages.length === 0 && !isLoadingMessages && !isFetchingMore && !error && (
            <div className="text-center text-secondary-text-medium py-10">
              No messages yet. Start the conversation!
          </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        </ScrollArea>

      {/* Wrapper for all bottom non-scrolling elements */}
      <div className="flex-shrink-0">
        {/* Reply Context Display */}      
        {replyContext && (
          <div className="p-2 border-t border-b border-border bg-secondary-beige-light/30 text-xs text-primary-text-dark flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} className="text-primary-accent flex-shrink-0" />
              <span className="truncate">{replyContext.text}</span>
            </div>
            <button onClick={() => setReplyContext(null)} className="p-1 hover:bg-black/10 rounded-full" aria-label="Cancel reply">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Image Preview Area */} 
        {imagePreviewUrl && (
          <div className="p-2 border-t border-border bg-background relative">
            <img src={imagePreviewUrl} alt="Preview" className="max-h-24 h-auto rounded-md" />
            <button 
              onClick={cancelImagePreview} 
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Input form area with emoji picker */}
        <div className="relative"> {/* Relative container for emoji picker positioning */}
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-full right-0 mb-2 z-10"> {/* Position picker above and to the right */}
              <Picker 
                onEmojiClick={onEmojiClick}
                pickerStyle={{ width: '100%', maxWidth: '320px', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' }}
                groupVisibility={{
                  recently_used: false, // Example: hide recently used
                }}
                disableSearchBar
              />
            </div>
          )}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-background flex items-center gap-2">
            <input type="file" accept="image/*" onChange={handleImageSelect} ref={fileInputRef} style={{ display: 'none' }} id="image-upload-input" />
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              aria-label="Attach image"
              className="text-secondary-text-dark hover:text-primary-accent"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button 
              id="emoji-picker-button"
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              aria-label="Toggle emoji picker"
              className="text-secondary-text-dark hover:text-primary-accent"
            >
              <Smile className="h-5 w-5" />
            </Button>
          <Input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
              placeholder="Type a message..."
              className="flex-grow"
              disabled={isSendingMessage || !currentUserId}
              aria-label="Chat message input"
              onFocus={() => setShowEmojiPicker(false)}
          />
            <Button type="submit" size="icon" disabled={isSendingMessage || (!newMessage.trim() && !imageFileToSend) || !currentUserId} aria-label="Send message">
              {isSendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
        </div>
        
        {error && messages.length > 0 && !isFetchingMore && (
            <p className="p-1 text-xs text-destructive bg-background text-center">Error sending/loading: {error.length > 50 ? error.substring(0,50)+'...' : error}</p>
        )}
      </div>
    </div>
  );
};

const VerificationQueueView = () => {
  const [verificationItems, setVerificationItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // To get partner's name or details if needed

  useEffect(() => {
    const fetchVerificationItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real app, you would call: 
        // const response = await partnershipService.getPendingVerifications(user?.partnerDetails?.id);
        // For now, using mock data:
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        const mockData = [
          { id: 'ver1', type: 'system_checkin', title: 'Morning Meditation', details: 'Completed 15 minutes of guided meditation.', submittedBy: user?.partnerDetails?.name || 'Your Partner', submittedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() },
          { id: 'ver2', type: 'goal_milestone', title: 'Book Reading Goal', details: 'Finished Chapter 3 (25 pages).', submittedBy: user?.partnerDetails?.name || 'Your Partner', submittedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString() },
          { id: 'ver3', type: 'system_checkin', title: 'Evening Journaling', details: 'Wrote one page reflecting on the day.', submittedBy: user?.partnerDetails?.name || 'Your Partner', submittedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString() },
        ];
        setVerificationItems(mockData);
      } catch (err) {
        console.error("Failed to fetch verification items:", err);
        setError("Could not load items for verification.");
        toast.error("Could not load items for verification.");
      }
      setIsLoading(false);
    };
    if (user) fetchVerificationItems();
  }, [user]);

  const handleVerificationAction = (itemId, action) => {
    toast.info(`Action: ${action} for item ${itemId.slice(0,4)}... (Simulated)`);
    // Optimistically remove the item from the list
    setVerificationItems(prevItems => prevItems.filter(item => item.id !== itemId));
    // In a real app: await partnershipService.submitVerification(itemId, action, { comments: 'Optional comment' });
  };

  const formatRelativeTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInSeconds = Math.round((now - then) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.round(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.round(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return then.toLocaleDateString();
  };

  if (isLoading) return <div className="flex items-center justify-center p-10"><Loader2 className="h-8 w-8 animate-spin mr-2 text-primary-accent" /> Loading verifications...</div>;
  if (error) return <div className="p-6 text-center text-destructive_text">Error: {error}</div>;
  if (verificationItems.length === 0) return <div className="p-6 text-center text-muted-foreground">No items currently pending your verification.</div>;

  return (
    <div className="space-y-4 p-px"> {/* p-px to avoid cutting off box-shadows on cards */}
      {verificationItems.map(item => (
        <Card key={item.id} className="bg-card hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>Submitted by {item.submittedBy} &bull; {formatRelativeTime(item.submittedAt)}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4 whitespace-pre-wrap">{item.details}</p>
            
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <Button variant="outline" size="sm" onClick={() => handleVerificationAction(item.id, 'queried')} className="text-amber-600 border-amber-500 hover:bg-amber-50 hover:text-amber-700 focus-visible:ring-amber-500">
                <HelpCircle className="h-4 w-4 mr-1.5" /> Query
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleVerificationAction(item.id, 'rejected')} className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive">
                <X className="h-4 w-4 mr-1.5" /> Reject
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleVerificationAction(item.id, 'approved')} 
                className="text-[#38761D] border-[#38761D] hover:bg-[rgba(56,118,29,0.1)] hover:text-[#38761D] focus-visible:ring-[#38761D] focus-visible:border-transparent"
              >
                <Check className="h-4 w-4 mr-1.5" /> Approve
              </Button>
            </div>
      </CardContent>
    </Card>
      ))}
    </div>
  );
};

export default function PartnershipPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("partnersDay");
  const [replyContext, setReplyContext] = useState(null); // New state for reply context

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/partnership');
    }
  }, [isAuthenticated, authIsLoading, router]);

  useEffect(() => {
    if (router.isReady) {
      const tabFromQuery = router.query.tab;
      if (typeof tabFromQuery === 'string' && ["partnersDay", "activityFeed", "chat", "verifications"].includes(tabFromQuery)) {
        setActiveTab(tabFromQuery);
      } else if (tabFromQuery === undefined && !replyContext) { // Only sync if not in a reply flow
        // router.replace(`/partnership?tab=${activeTab}`, undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query.tab, activeTab, replyContext]); // Added replyContext dependency

  const handleTabChange = (value) => {
    setActiveTab(value);
    router.push(`/partnership?tab=${value}`, undefined, { shallow: true });
    if (value !== 'chat') {
      setReplyContext(null); // Clear reply context if navigating away from chat manually
    }
  };

  const handleReplyNavigation = (activity) => {
    let replySummary = "Replying to an activity";
    if (activity && activity.content) {
      if (activity.type === 'partner_system_checkin' && activity.content.systemName) {
        replySummary = `Replying to: ${activity.content.systemName}`;
      } else if (activity.type === 'partner_reflection_added' && activity.content.reflectionText) {
        replySummary = `Replying to: "${activity.content.reflectionText.substring(0, 50)}..."`;
      }
    }
    setReplyContext({ id: activity.id, text: replySummary, originalActivity: activity });
    setActiveTab("chat"); // Switch to chat tab
    router.push(`/partnership?tab=chat`, undefined, { shallow: true }); // Ensure URL updates
  };

  if (authIsLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading user session...</p></div>;
  }

  return (
    // Main Tabs component now wraps the entire page structure related to tabs
    <Tabs value={activeTab} onValueChange={handleTabChange} className="container mx-auto flex flex-col h-screen">
      {/* Sticky Header and Tabs List */}
      <div className="sticky top-0 z-20 bg-background pt-4 md:pt-6 lg:pt-8 border-b border-border">
        <div className="px-4 md:px-6 lg:px-8"> {/* Padding for content within sticky */}
      <ScreenHeader 
        title="Your Partnership Hub"
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Partnership", isCurrent: true }
        ]}
      />
          {/* TabsList is now a direct child of the main Tabs component */}
          <TabsList className="grid w-full grid-cols-2 items-stretch sm:grid-cols-4 md:max-w-2xl lg:max-w-3xl mx-auto mt-4 mb-4"> {/* Added items-stretch, adjusted max-width and mx-auto */}
          <TabsTrigger value="partnersDay">Partner's Day</TabsTrigger>
          <TabsTrigger value="activityFeed">Activity Feed</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
        </TabsList>
        </div>
      </div>

      {/* Scrollable Tabs Content Area */}
      <div className="flex-grow overflow-y-auto pb-4 md:pb-6 lg:pb-8">
        <div className="px-4 md:px-6 lg:px-8"> {/* Content padding */}
          {/* TabsContent components are now direct children of the main Tabs, rendered conditionally */}
          {/* Using forceMount on TabsContent can simplify conditional rendering issues with context if they arise, but may not be strictly needed if activeTab logic is robust */}
          <TabsContent forceMount={activeTab === "partnersDay"} value="partnersDay" className="mt-0">
            {activeTab === "partnersDay" && <PartnerDayView />}
          </TabsContent>
          <TabsContent forceMount={activeTab === "activityFeed"} value="activityFeed" className="mt-0">
            {activeTab === "activityFeed" && <ActivityFeedView onReplyToActivity={handleReplyNavigation} />}
        </TabsContent>
          <TabsContent forceMount={activeTab === "chat"} value="chat" className="mt-0 h-full">
            {activeTab === "chat" && <ChatView replyContext={replyContext} setReplyContext={setReplyContext} />}
        </TabsContent>
          <TabsContent forceMount={activeTab === "verifications"} value="verifications" className="mt-0">
            {activeTab === "verifications" && <VerificationQueueView />}
        </TabsContent>
        </div>
      </div>
      </Tabs>
  );
} 