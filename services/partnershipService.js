import { apiClient } from '../lib/apiClient';

// Simulate API calls for partnership management

const mockMessages = {
  mockPartner123: [
    { id: "msg_1", senderId: "mockPartner123", receiverId: "user123", text: "Hey! How are you finding the new system tracking feature?", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), status: "read" },
    { id: "msg_2", senderId: "user123", receiverId: "mockPartner123", text: "It's pretty good! Still getting the hang of it. Liked your check-in this morning.", timestamp: new Date(Date.now() - 1000 * 60 * 50 * 2).toISOString(), status: "read" },
    { id: "msg_3", senderId: "mockPartner123", receiverId: "user123", text: "Thanks! Trying to be consistent. Did you see the alert about the upcoming maintenance?", timestamp: new Date(Date.now() - 1000 * 60 * 40 * 2).toISOString(), status: "read" },
    { 
      id: "msg_image_1", 
      senderId: "mockPartner123", 
      receiverId: "user123", 
      text: "Check out this cool dashboard view I found!", 
      imageUrl: "https://picsum.photos/seed/dashboard1/400/300", 
      timestamp: new Date(Date.now() - 1000 * 60 * 35 * 2).toISOString(), 
      status: "read" 
    },
    { id: "msg_4", senderId: "user123", receiverId: "mockPartner123", text: "No, I must have missed that. I'll check now. That dashboard looks neat!", timestamp: new Date(Date.now() - 1000 * 60 * 30 * 2).toISOString(), status: "read" },
    { 
      id: "msg_image_2", 
      senderId: "user123", 
      receiverId: "mockPartner123", 
      text: "", // Image-only message
      imageUrl: "https://picsum.photos/seed/cats/300/400", 
      timestamp: new Date(Date.now() - 1000 * 60 * 25 * 2).toISOString(), 
      status: "read" 
    },
    { id: "msg_5", senderId: "mockPartner123", receiverId: "user123", text: "Haha, nice cat! Anyway, let me know if you have questions about the new goal projection tool.", timestamp: new Date(Date.now() - 1000 * 60 * 20 * 2).toISOString(), status: "read" },
  ],
  // Add more mock conversations for other partnerIds if needed
};

// Simulate network latency
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock database of invites
const mockInvites = {
  'VALID_TOKEN_123': { 
    inviter: { 
      username: 'PartnerAlice', 
      profileImageUrl: 'https://i.pravatar.cc/150?u=alice' 
    },
    status: 'pending'
  },
  'USED_TOKEN_456': {
    inviter: {
      username: 'PartnerBob',
      profileImageUrl: 'https://i.pravatar.cc/150?u=bob'
    },
    status: 'accepted'
  }
};

export const partnershipService = {
  /**
   * Sends a partnership invitation email to a potential partner.
   * Implements POST /partnerships/invite.
   * @param {string} email - The email address of the person to invite.
   * @returns {Promise<object>}
   */
  sendPartnershipInviteEmail: async (email) => {
    return apiClient('/partnerships/invite', {
      method: 'POST',
      body: { email },
    });
  },

  /**
   * Fetches details about a specific partnership invitation using a token.
   * Implements GET /partnerships/invite/{inviteToken}.
   * @param {string} inviteToken - The invitation token from the email link.
   * @returns {Promise<object>}
   */
  getInviteDetails: async (inviteToken) => {
    return apiClient(`/partnerships/invite/${inviteToken}`);
  },

  /**
   * Accepts a partnership invitation.
   * Implements POST /partnerships/invite/accept.
   * @param {string} inviteToken - The invitation token.
   * @returns {Promise<object>}
   */
  acceptPartnershipInvite: async (inviteToken) => {
    return apiClient('/partnerships/invite/accept', {
      method: 'POST',
      body: { token: inviteToken },
    });
  },

  /**
   * Declines a partnership invitation.
   * Implements POST /partnerships/invite/decline.
   * @param {string} inviteToken - The invitation token.
   * @returns {Promise<object>}
   */
  declinePartnershipInvite: async (inviteToken) => {
    return apiClient('/partnerships/invite/decline', {
      method: 'POST',
      body: { token: inviteToken },
    });
  },

  /**
   * Fetches the current active partnership details for the user.
   * Implements GET /partnerships/current.
   * @returns {Promise<object>}
   */
  getCurrentPartnership: async () => {
    return apiClient('/partnerships/current');
  },

  /**
   * Dissolves the current active partnership.
   * Implements POST /partnerships/dissolve.
   * @returns {Promise<object>}
   */
  dissolvePartnership: async () => {
    return apiClient('/partnerships/dissolve', {
      method: 'POST',
    });
  },

  getPartnerTodaysSystems: async (partnerId) => {
    console.log("partnershipService.getPartnerTodaysSystems called for partnerId:", partnerId);
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulate fetching partner's systems for today
    if (partnerId) {
        return {
            success: true,
            systems: [
                { id: "psys_1", name: "Partner's Morning Workout", status: "Completed", details: "30 min cardio, 15 min strength" },
                { id: "psys_2", name: "Partner's Project Presentation Prep", status: "In Progress", details: "Review slides, practice speech" },
                { id: "psys_3", name: "Partner's Client Call", status: "Pending", details: "Discuss Q4 results" },
                { id: "psys_4", name: "Partner's Language Learning", status: "Completed", details: "Duolingo - 2 lessons" },
            ]
        };
    } else {
        return {
            success: false,
            message: "Failed to fetch partner systems. Partner ID missing.",
            systems: [],
        };
    }
  },

  getPartnerActivityFeed: async (partnerId, page = 1, limit = 10) => {
    console.log(`partnershipService.getPartnerActivityFeed called for partnerId: ${partnerId}, page: ${page}, limit: ${limit}`);
    await new Promise(resolve => setTimeout(resolve, 750));

    // Simulate a larger set of activities and pagination
    // Partner's name - in a real scenario, this might be fetched or passed in
    const partnerName = "Partner Pat";

    const allActivities = [
      { 
        id: "act_1", 
        partnerName: partnerName,
        type: "partner_system_checkin", 
        timestamp: "2023-10-28T10:05:00Z", 
        content: {
          systemName: "Morning Run",
          statusLogged: "completed",
          metricValueLogged: { value: "Done", unit: "" }, // Binary example
          notesLogged: "Felt invigorating! Ready for the day.",
          photoUrlLogged: null
        }
      },
      // This item below is about "Your check-in", so it will be EXCLUDED from partner-specific feed
      // { id: "act_2", type: "user_checkin_verified", timestamp: "2023-10-28T09:30:00Z", text: "Your check-in for 'Project X Sprint 1' was verified by Partner Pat.", systemName: "Project X Sprint 1" },
      { 
        id: "act_3", 
        partnerName: partnerName,
        type: "partner_goal_achieved", 
        timestamp: "2023-10-27T17:00:00Z", 
        content: {
          goalName: "Read 5 Books This Month",
          achievementText: "Woohoo! Finished my 5th book this month!"
        }
      },
      { 
        id: "act_4", 
        partnerName: partnerName,
        type: "partner_system_checkin", 
        timestamp: "2023-10-27T15:10:00Z", 
        content: {
          systemName: "Client Follow-ups",
          statusLogged: "completed",
          metricValueLogged: { value: "5", unit: "clients" },
          notesLogged: "All clients responded positively. Good progress made.",
          photoUrlLogged: null
        } 
      },
      // act_5: "message_sent" - if this means partner sent a message TO THE USER, it's relevant.
      // Let's assume for now direct messages appear in the Chat tab and not clutter this feed unless it's a "Partner Pat sent you a new message" summary.
      // For simplicity in Phase 1A, we'll omit direct message summaries from this feed, focusing on system/goal activities. This can be added later.
      // { id: "act_5", partnerName: partnerName, type: "partner_message_sent_to_user", timestamp: "2023-10-27T14:00:00Z", content: { summaryText: "Sent you a message." } },
      { 
        id: "act_6", 
        partnerName: partnerName,
        type: "partner_system_config_updated", // More specific than just "system_updated"
        timestamp: "2023-10-26T11:00:00Z", 
        content: {
          systemName: "Weekly Review",
          updateText: "Updated the details and checklist for the 'Weekly Review' system."
        } 
      },
      { 
        id: "act_7", 
        partnerName: partnerName, // Though partnership is mutual
        type: "partnership_milestone", 
        timestamp: "2023-10-25T00:00:00Z", 
        content: {
          milestoneText: "Happy 1 year DuoTrak anniversary!"
        } 
      },
      { 
        id: "act_8", 
        partnerName: partnerName,
        type: "partner_system_checkin", 
        timestamp: "2023-10-24T18:00:00Z", 
        content: {
          systemName: "Evening Walk",
          statusLogged: "skipped",
          metricValueLogged: { value: "Skipped", unit: ""},
          notesLogged: "Too tired today, will catch up tomorrow.",
          photoUrlLogged: null
        }
      },
      { 
        id: "act_9", 
        partnerName: partnerName,
        type: "partner_reflection_added", 
        timestamp: "2023-10-24T21:00:00Z", 
        content: {
          reflectionTitle: "Thoughts on Productivity", // Optional title
          reflectionText: "Felt productive today. Managed to clear out a lot of pending tasks and also made some headway on the new project proposal. Need to maintain this momentum."
        }
      }, 
      { 
        id: "act_10", 
        partnerName: partnerName,
        type: "partner_system_checkin", 
        timestamp: "2023-10-23T08:15:00Z", 
        content: {
          systemName: "Meditate for 10 mins",
          statusLogged: "completed",
          metricValueLogged: { value: "10", unit: "minutes" },
          notesLogged: "Peaceful session.",
          photoUrlLogged: null
        }
      },
      // act_11: "checkin_queried" - This is about "Your check-in", so EXCLUDE.
      // { id: "act_11", type: "user_checkin_queried", timestamp: "2023-10-22T16:00:00Z", text: "Your check-in for 'Gym Session - Upper Body' was queried by Partner Pat. Details: Could you add reps?", systemName: "Gym Session - Upper Body" },
      { 
        id: "act_12", 
        partnerName: partnerName,
        type: "partner_new_goal_set", 
        timestamp: "2023-10-22T10:30:00Z", 
        content: {
          goalName: "Run a 5K by December",
          goalDescription: "Training plan started, aiming for the local charity run."
        } 
      },
      // Adding a few more to test pagination
      {
        id: "act_13",
        partnerName: partnerName,
        type: "partner_system_checkin",
        timestamp: "2023-10-21T09:00:00Z",
        content: {
          systemName: "Hydration Reminder",
          statusLogged: "completed",
          metricValueLogged: { value: "8", unit: "glasses" },
          notesLogged: "Met my water goal today.",
          photoUrlLogged: null
        }
      },
      {
        id: "act_14",
        partnerName: partnerName,
        type: "partner_reflection_added",
        timestamp: "2023-10-20T22:00:00Z",
        content: {
          reflectionTitle: "Weekend Plans",
          reflectionText: "Looking forward to a relaxing weekend. Need to recharge after a busy week."
        }
      },
       {
        id: "act_15",
        partnerName: partnerName,
        type: "partner_system_checkin",
        timestamp: "2023-10-19T12:30:00Z",
        content: {
          systemName: "Lunchtime Learning",
          statusLogged: "completed",
          metricValueLogged: { value: "30", unit: "minutes" },
          notesLogged: "Watched a tutorial on new CSS features.",
          photoUrlLogged: null
        }
      }
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Ensure descending order

    if (partnerId) {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedActivities = allActivities.slice(startIndex, endIndex);
        const hasMore = endIndex < allActivities.length;

        return {
            success: true,
            activities: paginatedActivities,
            pagination: {
                currentPage: page,
                limit: limit,
                totalItems: allActivities.length,
                totalPages: Math.ceil(allActivities.length / limit),
                hasNextPage: hasMore,
            }
        };
    } else {
        return {
            success: false,
            message: "Failed to fetch activity feed. Partner ID missing.",
            activities: [],
        };
    }
  },

  getChatMessages: async (partnerId, { page = 1, limit = 20 } = {}) => {
    console.log(`partnershipService.getChatMessages called for partnerId: ${partnerId}, page: ${page}, limit: ${limit}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    const partnerMessages = mockMessages[partnerId] || [];
    const totalMessages = partnerMessages.length;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
    const paginatedMessages = partnerMessages.slice(Math.max(0, totalMessages - endIndex), Math.max(0, totalMessages - startIndex));
     // For pagination, we usually fetch latest first, so slicing from the end of a chronological array
    // Or, if array is already newest-first, then startIndex and endIndex logic is simpler.
    // Assuming `mockMessages` are chronological (oldest to newest)
    // The slice logic needs to be: `partnerMessages.slice(Math.max(0, totalMessages - (page * limit)), totalMessages - ((page - 1) * limit))`
    // Corrected slicing for newest first (assuming original mockMessages is oldest first):
    const chronologicalMessages = mockMessages[partnerId] || [];
    const reversedMessages = [...chronologicalMessages].reverse(); // Newest first
    const messagesForPage = reversedMessages.slice(startIndex, endIndex);

      return {
        success: true,
      messages: messagesForPage.map(msg => ({...msg, reactions: msg.reactions || []})), // Ensure reactions array exists
        pagination: {
          currentPage: page,
          limit: limit,
        totalMessages: totalMessages,
        totalPages: Math.ceil(totalMessages / limit),
        hasNextPage: endIndex < totalMessages,
        hasPreviousPage: page > 1
      }
    };
  },

  sendChatMessage: async (partnerId, senderId, messageText, replyingToActivityId = null, imageFile = null) => {
    console.log(`partnershipService.sendChatMessage called for partnerId: ${partnerId}, senderId: ${senderId}, text: ${messageText}, replyingTo: ${replyingToActivityId}, image: ${imageFile ? imageFile.name : 'none'}`);
    await new Promise(resolve => setTimeout(resolve, 300));

    // Allow sending if there is text OR an image
    if (partnerId && senderId && (messageText || imageFile)) {
      let imageUrl = null;
      if (imageFile) {
        // Simulate creating a URL for the image. In a real app, this would be an upload process.
        // For mock, we can try to use FileReader if it's a File object, or assume it's a data URL if passed directly.
        // However, service running in Node-like env for MCP might not have FileReader.
        // For simplicity in mock, if imageFile is truthy, we'll just create a placeholder or use a passed data URL.
        // Assuming imageFile might be a data URL passed from optimistic update, or we fake one.
        // Let's assume for this mock, the frontend already prepared a dataURL and that's what imageFile contains IF it's not the raw File.
        // Given ChatView sends the File object, we should handle it or ChatView should send dataURL.
        // For this iteration, let's assume ChatView will pass the dataURL (imagePreviewUrl) if an image exists.
        // For the service, if imageFile is passed, we'll assume it's the URL/data for mock.
        // This part needs to align with what ChatView actually sends as 'imageToSend'.
        // Let's refine: if imageFile is a File object, create a mock URL. For now, a placeholder.
        imageUrl = imageFile ? `mock-image-url/${Date.now()}-${imageFile.name}` : null;
        console.log(`Simulating image send, mock URL: ${imageUrl}`);
      }

      const newMessage = {
        id: "msg_" + Date.now(),
        senderId: senderId, 
        receiverId: partnerId, 
        text: messageText,
        timestamp: new Date().toISOString(),
        status: "sent",
        replyingToActivityId: replyingToActivityId,
        imageUrl: imageUrl // Add imageUrl to the message object
      };
      return {
        success: true,
        message: "Message sent successfully!",
        sentMessage: newMessage
      };
    } else {
      return {
        success: false,
        message: "Failed to send message. Missing details or no content."
      };
    }
  },

  notifyPartnerOfReaction: async (partnershipId, reactorId, originalMessageSenderId, messageId, emoji, contentType) => {
    console.log("partnershipService.notifyPartnerOfReaction called:");
    console.log(`  Partnership ID: ${partnershipId}`);
    console.log(`  User ID of Reactor: ${reactorId}`);
    console.log(`  User ID to Notify (Original Sender): ${originalMessageSenderId}`);
    console.log(`  Message ID Reacted To: ${messageId}`);
    console.log(`  Emoji: ${emoji}`);
    console.log(`  Content Type: ${contentType}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // In a real backend:
    // 1. Validate inputs.
    // 2. Check if users are part of the partnership.
    // 3. Construct a notification object/event.
    // 4. Store this notification (e.g., in a notifications table or activity feed for originalMessageSenderId).
    // 5. Potentially send a real-time push notification.

    // For mock purposes, we just log and return success.
    // We could also simulate adding an item to the other user's activity feed here if we enhance the feed service.
    return {
      success: true,
      message: `Notification for reaction on ${contentType} (messageId: ${messageId}) by ${reactorId} with ${emoji} has been notionally sent to ${originalMessageSenderId}.`
    };
  },
}; 