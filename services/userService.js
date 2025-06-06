import { apiClient } from '../lib/apiClient';

export const userService = {
  /**
   * Fetches the profile of the currently authenticated user.
   * Implements GET /users/me.
   * @returns {Promise<object>}
   */
  getCurrentUser: async () => {
    return apiClient('/users/me');
  },

  /**
   * Updates the profile of the currently authenticated user.
   * Implements PUT /users/me.
   * @param {object} profileData - The updated profile data.
   * @param {string} [profileData.username]
   * @param {string} [profileData.name]
   * @param {string} [profileData.bio]
   * @param {string} [profileData.profile_image_url]
   * @param {string} [profileData.timezone]
   * @returns {Promise<object>}
   */
  updateCurrentUser: async (profileData) => {
    return apiClient('/users/me', {
      method: 'PUT',
      body: profileData,
    });
  },

  /**
   * Fetches the profile of the current user's partner.
   * Implements GET /users/partner.
   * @returns {Promise<object>}
   */
  getPartner: async () => {
    return apiClient('/users/partner');
  },

  /**
   * Updates the current user's notification preferences.
   * Implements PUT /users/me/notification-preferences.
   * @param {object} preferencesData - The notification preferences object.
   * @returns {Promise<object>}
   */
  updateNotificationPreferences: async (preferencesData) => {
    return apiClient('/users/me/notification-preferences', {
      method: 'PUT',
      body: preferencesData,
    });
  },
}; 