import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/services/notificationService';

export const useNotifications = (userId, initialLimit = 10) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchInitialNotifications = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await notificationService.fetchNotifications(userId, 1, initialLimit);
      if (response.success) {
        setNotifications(response.data.notifications);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
        setHasNextPage(response.data.hasNextPage);
      } else {
        setError(response.message || 'Failed to fetch notifications.');
        setNotifications([]);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setNotifications([]);
    }
    setIsLoading(false);
  }, [userId, initialLimit]);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await notificationService.getUnreadCount(userId);
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  }, [userId]);

  useEffect(() => {
    fetchInitialNotifications();
    fetchUnreadCount();
  }, [fetchInitialNotifications, fetchUnreadCount]);

  const loadMoreNotifications = async () => {
    if (!hasNextPage || isLoadingMore || !userId) return;
    setIsLoadingMore(true);
    setError(null);
    try {
      const nextPage = currentPage + 1;
      const response = await notificationService.fetchNotifications(userId, nextPage, initialLimit);
      if (response.success) {
        setNotifications(prev => [...prev, ...response.data.notifications]);
        setCurrentPage(response.data.currentPage);
        setHasNextPage(response.data.hasNextPage);
      } else {
        setError(response.message || 'Failed to load more notifications.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during load more.');
    }
    setIsLoadingMore(false);
  };

  const markAsRead = async (notificationId) => {
    if (!userId) return;
    
    const originalNotifications = [...notifications];
    const originalUnreadCount = unreadCount;

    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    // Update unread count only if the notification was actually unread
    const notificationToUpdate = originalNotifications.find(n => n.id === notificationId);
    if (notificationToUpdate && !notificationToUpdate.read) {
        setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    }

    try {
      const response = await notificationService.markNotificationAsRead(userId, notificationId);
      if (!response.success) {
        console.error("Failed to mark notification as read on server:", response.message);
        // Rollback
        setNotifications(originalNotifications);
        setUnreadCount(originalUnreadCount);
        // Optionally show a toast error to the user
      }
      // If successful, UI is already updated optimistically
    } catch (err) {
      console.error("Error marking notification as read:", err);
      // Rollback
      setNotifications(originalNotifications);
      setUnreadCount(originalUnreadCount);
      // Optionally show a toast error to the user
    }
  };

  const markAllAsRead = async () => {
    if (!userId || unreadCount === 0) return; // Don't do anything if no unread notifications

    const originalNotifications = [...notifications];
    const originalUnreadCount = unreadCount;

    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      const response = await notificationService.markAllNotificationsAsRead(userId);
      if (!response.success) {
        console.error("Failed to mark all notifications as read on server:", response.message);
        // Rollback
        setNotifications(originalNotifications);
        setUnreadCount(originalUnreadCount);
        // Optionally show a toast error to the user
      }
      // If successful, UI is already updated optimistically
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      // Rollback
      setNotifications(originalNotifications);
      setUnreadCount(originalUnreadCount);
      // Optionally show a toast error to the user
    }
  };
  
  const refreshNotifications = () => {
    fetchInitialNotifications();
    fetchUnreadCount();
  };

  return {
    notifications,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    unreadCount,
    totalItems,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };
}; 