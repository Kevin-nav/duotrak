// Simulate API calls for goal management

import { apiClient } from '../lib/apiClient';

let mockGoals = [
  {
    id: "goal_1",
    title: "Run a 5K Race",
    description: "Train and participate in a local 5K race by the end of the quarter.",
    category: "Fitness", // e.g., Fitness, Career, Personal Development, Finance
    startDate: "2023-11-01",
    targetDate: "2024-01-31",
    status: "In Progress", // e.g., Not Started, In Progress, Achieved, On Hold, Abandoned
    priority: "High", // High, Medium, Low
    aiAssistedPlan: "Generated plan: 1. Start with 1K runs 3x/week. 2. Increase distance by 0.5K each week. 3. Incorporate interval training. 4. Rest day between runs.",
    systems: ["sys_101", "sys_102"] // IDs of associated systems
  },
  {
    id: "goal_2",
    title: "Learn Basic Spanish",
    description: "Complete a beginner Spanish course and be able to hold simple conversations.",
    category: "Personal Development",
    startDate: "2023-10-15",
    targetDate: "2024-03-15",
    status: "In Progress",
    priority: "Medium",
    aiAssistedPlan: null,
    systems: ["sys_201"]
  },
  {
    id: "goal_3",
    title: "Save $1000 for Emergency Fund",
    description: "Set aside $1000 in a high-yield savings account.",
    category: "Finance",
    startDate: "2023-09-01",
    targetDate: "2023-12-31",
    status: "Achieved",
    priority: "High",
    aiAssistedPlan: "Plan: Save $250 per month.",
    systems: []
  }
];

// Helper function to normalize Goal IDs (e.g., "goal_001" to "goal_1")
const normalizeGoalId = (id) => {
  if (typeof id !== 'string') return id;
  return id.replace(/^goal_0*/, 'goal_');
};

export const goalService = {
  /**
   * Fetches all goals for the current user.
   * Implements GET /goals with pagination.
   * @param {number} page - The page number for pagination.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<object>}
   */
  getGoals: async ({ page = 1, limit = 20 } = {}) => {
    return apiClient(`/goals?page=${page}&limit=${limit}`);
  },

  /**
   * Fetches a single goal by its ID.
   * Implements GET /goals/{goalId}.
   * @param {string} goalId - The ID of the goal.
   * @returns {Promise<object>}
   */
  getGoalById: async (goalId) => {
    return apiClient(`/goals/${goalId}`);
  },

  /**
   * Creates a new goal.
   * Implements POST /goals.
   * @param {object} goalData - The data for the new goal.
   * @param {string} goalData.title - The title of the goal.
   * @param {string} [goalData.description] - The description of the goal.
   * // ... other properties as defined in goal_schemas.py
   * @returns {Promise<object>}
   */
  createGoal: async (goalData) => {
    return apiClient('/goals', {
      method: 'POST',
      body: goalData,
    });
  },

  /**
   * Updates an existing goal.
   * Implements PUT /goals/{goalId}.
   * @param {string} goalId - The ID of the goal to update.
   * @param {object} goalData - The updated data for the goal.
   * @returns {Promise<object>}
   */
  updateGoal: async (goalId, goalData) => {
    return apiClient(`/goals/${goalId}`, {
      method: 'PUT',
      body: goalData,
    });
  },

  /**
   * Deletes a goal.
   * Implements DELETE /goals/{goalId}.
   * @param {string} goalId - The ID of the goal to delete.
   * @returns {Promise<object>}
   */
  deleteGoal: async (goalId) => {
    return apiClient(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  },
}; 