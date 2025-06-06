import { apiClient } from '../lib/apiClient';

export const messageService = {
  /**
   * Fetches messages for the current user's partnership.
   * Implements GET /messages.
   * @param {object} [pagination] - Pagination options.
   * @param {number} [pagination.page=1] - Page number.
   * @param {number} [pagination.limit=50] - Items per page.
   * @returns {Promise<object>}
   */
  getMessages: async ({ page = 1, limit = 50 } = {}) => {
    return apiClient(`/messages?page=${page}&limit=${limit}`);
  },

  /**
   * Sends a new direct message.
   * Implements POST /messages.
   * @param {object} messageData - The message data.
   * @param {string} [messageData.textContent] - The text of the message.
   * @param {string} [messageData.emojiContent] - Emoji content if it's an emoji-only message.
   * @param {string} [messageData.imageUrl] - URL of an image being sent.
   * @returns {Promise<object>}
   */
  sendMessage: async (messageData) => {
    return apiClient('/messages', {
      method: 'POST',
      body: messageData,
    });
  },

  /**
   * Adds or updates a reaction to a message.
   * Implements POST /messages/{messageId}/react (Post-MVP).
   * @param {string} messageId - The ID of the message to react to.
   * @param {object} reactionData - The reaction data.
   * @param {string} reactionData.emoji - The emoji to react with.
   * @returns {Promise<object>}
   */
  reactToMessage: async (messageId, reactionData) => {
    return apiClient(`/messages/${messageId}/react`, {
      method: 'POST',
      body: reactionData,
    });
  },
}; 