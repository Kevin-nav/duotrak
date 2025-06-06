import { apiClient } from '../lib/apiClient';

export const reflectionService = {
  /**
   * Creates a new daily reflection.
   * Implements POST /reflections.
   * @param {object} reflectionData - The data for the reflection.
   * @param {string} reflectionData.reflectionContent - The main text of the reflection.
   * @param {string} reflectionData.reflectionDateLocal - The local date string 'YYYY-MM-DD'.
   * @returns {Promise<object>}
   */
  createReflection: async (reflectionData) => {
    return apiClient('/reflections', {
      method: 'POST',
      body: reflectionData,
    });
  },

  /**
   * Fetches reflections, with potential filtering.
   * Implements GET /reflections.
   * @param {object} [filters] - Optional query parameters for filtering.
   * @param {string} [filters.startDate] - 'YYYY-MM-DD'.
   * @param {string} [filters.endDate] - 'YYYY-MM-DD'.
   * @param {string} [filters.userId] - The user ID to fetch for (if admin/partner view).
   * @returns {Promise<object>}
   */
  getReflections: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiClient(`/reflections?${query}`);
  },
}; 