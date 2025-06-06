import { BehaviorSubject } from 'rxjs';
import { apiClient } from '../lib/apiClient';

// Simulate user IDs (in a real app, this would come from auth context)
const MOCK_PRIMARY_USER_ID = 'user123';
const MOCK_PARTNER_USER_ID = 'partner456'; 

const initialNotifications = [
  {
    id: 'notif_1',
    type: 'general',
    title: 'Welcome to DuoTrak!',
    description: 'Check out the tutorial to get started.',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    read: true,
    userId: MOCK_PRIMARY_USER_ID, 
    iconName: 'Bell',
  },
  {
    id: 'notif_2',
    type: 'goal_progress',
    actor: { name: 'Your Partner' }, // Generic partner name
    title: 'Completed a step in \'Improve Cardiovascular Health\' goal!',
    link: '/goals/goal_1', 
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    read: false,
    userId: MOCK_PRIMARY_USER_ID, // Notification FOR the primary user ABOUT the partner
    iconName: 'Award',
  },
  {
    id: 'notif_partner_action',
    type: 'partner_activity',
    actor: { name: 'Your Partner' }, // Generic partner name
    title: 'Verified your task \'Submit Project Proposal\'.',
    description: 'Great job on the proposal!',
    link: '/systems/sys_2', 
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    read: false,
    userId: MOCK_PRIMARY_USER_ID, // Notification FOR the primary user ABOUT the partner
    iconName: 'ThumbsUp',
  },
  // Example of a notification for the PARTNER (which the primary user wouldn't see unless they were partner456)
  {
    id: 'notif_for_partner_1',
    type: 'verification_request',
    actor: { name: 'Primary User'}, // Or the actual name of primary user
    title: 'Task \'Grocery Shopping for Meal Prep\' needs your verification.',
    link: '/partnership?tab=verifications&taskId=sys_5',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
    read: false,
    userId: MOCK_PARTNER_USER_ID, // This notification is FOR the partner
    iconName: 'HelpCircle',
  }
];

let mockNotifications = [...initialNotifications];

// BehaviorSubject to allow components to subscribe to notification changes
// Now filters for the MOCK_PRIMARY_USER_ID by default for this stream
const notificationsSubject = new BehaviorSubject(
  mockNotifications
    .filter(n => n.userId === MOCK_PRIMARY_USER_ID)
    .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
);


export const notificationService = {
  /**
   * Fetches notifications for the current user.
   * Implements GET /notifications.
   * @param {object} [filters] - Optional filtering and pagination.
   * @param {boolean} [filters.unreadOnly=false] - Whether to fetch only unread notifications.
   * @param {number} [filters.page=1] - Page number for pagination.
   * @param {number} [filters.limit=20] - Items per page.
   * @returns {Promise<object>}
   */
  getNotifications: async ({ unreadOnly = false, page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (unreadOnly) {
      params.append('is_read', 'false');
    }
    return apiClient(`/notifications?${params.toString()}`);
  },

  /**
   * Marks a single notification as read.
   * Implements POST /notifications/{notificationId}/read.
   * @param {string} notificationId - The ID of the notification to mark as read.
   * @returns {Promise<object>}
   */
  markAsRead: async (notificationId) => {
    return apiClient(`/notifications/${notificationId}/read`, {
      method: 'POST',
    });
  },

  /**
   * Marks all unread notifications for the user as read.
   * Implements POST /notifications/mark-all-read.
   * @returns {Promise<object>}
   */
  markAllAsRead: async () => {
    return apiClient('/notifications/mark-all-read', {
      method: 'POST',
    });
  },

  // options now includes userId to fetch for, defaulting to primary user
  getNotificationsForCurrentUser: async (options = {}) => {
    const { page = 1, limit = 10, filter = 'all', userId = MOCK_PRIMARY_USER_ID } = options; 
    await new Promise(resolve => setTimeout(resolve, 300));

    let userNotifications = mockNotifications
      .filter(n => n.userId === userId) // Filter by the provided userId
      .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));

    const totalItems = userNotifications.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = userNotifications.slice(startIndex, endIndex);
    const hasNextPage = endIndex < totalItems;

    return {
      success: true,
      notifications: paginatedItems,
      pagination: {
        currentPage: page,
        limit: limit,
        totalItems: totalItems,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
      }
    };
  },

  addVerificationRequestNotification: (task, requestingUserId) => {
    // Notification is FOR the partner, so userId should be MOCK_PARTNER_USER_ID
    // The actor is the user who made the request (requestingUserId)
    const partnerId = MOCK_PARTNER_USER_ID; 
    const actorName = requestingUserId === MOCK_PRIMARY_USER_ID ? 'You' : (task.requestingUserName || 'Your Partner');

    const newNotification = {
      id: `notif_${Date.now()}`,
      type: 'verification_request',
      actor: { name: actorName },
      taskId: task.id,
      title: `Task \'${task.name}\' from ${actorName} is awaiting your verification.`,
      message: `Task \'${task.name}\' is awaiting your verification.`,
      link: `/partnership?tab=verifications&taskId=${task.id}`,
      timestamp: new Date().toISOString(),
      read: false,
      userId: partnerId, // FOR the partner
      iconName: 'HelpCircle',
    };
    mockNotifications.unshift(newNotification);
    
    // Update the stream FOR THE PARTNER if they are the one viewing notifications
    // This logic might need to be more sophisticated if both users share one client instance
    // For now, assume the notificationsSubject is for the MOCK_PRIMARY_USER_ID
    const primaryUserNotifications = mockNotifications
      .filter(n => n.userId === MOCK_PRIMARY_USER_ID)
      .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    notificationsSubject.next([...primaryUserNotifications]);
    
    console.log('NotificationService: Added verification request notification for partner:', newNotification);
  },
  
  notifications$: notificationsSubject.asObservable(),
};

// Example of how a component might subscribe (not part of the service itself):
// useEffect(() => {
//   const subscription = notificationService.notifications$.subscribe(setNotifications);
//   notificationService.getNotificationsForCurrentUser(); // Initial fetch
//   return () => subscription.unsubscribe();
// }, []); 