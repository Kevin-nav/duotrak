import { apiClient } from '../lib/apiClient';

export const aiPlannerService = {
  /**
   * Gets an AI-assisted plan for a new goal.
   * Implements POST /ai-planner/plan-goal.
   * @param {object} promptData - The user's input for the goal.
   * @param {string} promptData.userInput - The high-level goal description from the user.
   * @returns {Promise<object>} - The AI-generated plan.
   */
  getGoalPlan: async (promptData) => {
    return apiClient('/ai-planner/plan-goal', {
      method: 'POST',
      body: promptData,
    });
  },

  /**
   * Gets AI-assisted system suggestions for a given goal.
   * Implements POST /ai-planner/suggest-systems.
   * @param {object} promptData - The context for suggesting systems.
   * @param {string} promptData.goalTitle - The title of the goal.
   * @param {string} promptData.goalDescription - The description of the goal.
   * @returns {Promise<object>} - A list of AI-generated system suggestions.
   */
  getSystemSuggestions: async (promptData) => {
    return apiClient('/ai-planner/suggest-systems', {
      method: 'POST',
      body: promptData,
    });
  },
}; 