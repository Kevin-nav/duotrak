import { apiClient } from '../lib/apiClient';

// Simulate API calls for authentication

export const authService = {
  /**
   * Registers a new user.
   * Implements POST /auth/signup.
   * @param {object} signupData - { email, password }.
   * @returns {Promise<object>}
   */
  signup: async (signupData) => {
    return apiClient('/auth/signup', {
      method: 'POST',
      body: signupData,
    });
  },

  /**
   * Logs a user in.
   * Implements POST /auth/login.
   * @param {object} credentials - { email, password }.
   * @returns {Promise<object>} - The response should contain the user and token.
   */
  login: async (credentials) => {
    // The response from this call should include the JWT token.
    // The AuthContext will be responsible for storing it.
    return apiClient('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  /**
   * Initiates the password reset process.
   * Implements POST /auth/forgot-password.
   * @param {string} email - The user's email address.
   * @returns {Promise<object>}
   */
  forgotPassword: async (email) => {
    return apiClient('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  /**
   * Resets the user's password using a token.
   * Implements POST /auth/reset-password.
   * @param {string} token - The password reset token from the email link.
   * @param {string} newPassword - The new password.
   * @returns {Promise<object>}
   */
  resetPassword: async (token, newPassword) => {
    return apiClient('/auth/reset-password', {
      method: 'POST',
      body: { token, new_password: newPassword },
    });
  },

  /**
   * Verifies a user's email using a token.
   * Implements POST /auth/verify-email.
   * @param {string} token - The email verification token.
   * @returns {Promise<object>}
   */
  verifyEmail: async (token) => {
    return apiClient('/auth/verify-email', {
        method: 'POST',
        body: { token },
    });
  },

  // Add other auth-related stub functions here (logout)
}; 