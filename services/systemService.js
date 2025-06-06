// Simulate API calls for system management

import { apiClient } from '../lib/apiClient';

let mockSystems = [
  {
    id: "sys_101",
    goalId: "goal_1",
    title: "Daily Run",
    description: "Run for at least 1 kilometer each day.",
    frequency: "Daily", // e.g., Daily, Weekly, Specific days
    status: "Active", // Active, Paused, Completed
    checkInType: "Simple Confirmation", // Simple Confirmation, Notes, Rating, Photo
  },
  {
    id: "sys_102",
    goalId: "goal_1",
    title: "Strength Training",
    description: "20 minutes of strength exercises 3 times a week.",
    frequency: "Mon, Wed, Fri",
    status: "Active",
    checkInType: "Notes",
  },
  {
    id: "sys_201",
    goalId: "goal_2",
    title: "Duolingo Session",
    description: "Complete 2 Spanish lessons on Duolingo.",
    frequency: "Daily",
    status: "Active",
    checkInType: "Simple Confirmation",
  }
];

export const systemService = {
  /**
   * Fetches all systems for a specific goal.
   * Implements GET /goals/{goalId}/systems.
   * @param {string} goalId - The ID of the goal.
   * @returns {Promise<object>}
   */
  getSystemsForGoal: async (goalId) => {
    return apiClient(`/goals/${goalId}/systems`);
  },

  /**
   * Fetches a single system by its ID.
   * Implements GET /systems/{systemId}.
   * @param {string} systemId - The ID of the system.
   * @returns {Promise<object>}
   */
  getSystemById: async (systemId) => {
    return apiClient(`/systems/${systemId}`);
  },

  /**
   * Creates a new system for a goal.
   * Implements POST /goals/{goalId}/systems.
   * @param {string} goalId - The ID of the goal.
   * @param {object} systemData - The data for the new system.
   * @returns {Promise<object>}
   */
  createSystem: async (goalId, systemData) => {
    return apiClient(`/goals/${goalId}/systems`, {
      method: 'POST',
      body: systemData,
    });
  },

  /**
   * Updates an existing system.
   * Implements PUT /systems/{systemId}.
   * @param {string} systemId - The ID of the system to update.
   * @param {object} systemData - The updated data for the system.
   * @returns {Promise<object>}
   */
  updateSystem: async (systemId, systemData) => {
    return apiClient(`/systems/${systemId}`, {
      method: 'PUT',
      body: systemData,
    });
  },

  /**
   * Deletes a system.
   * Implements DELETE /systems/{systemId}.
   * @param {string} systemId - The ID of the system to delete.
   * @returns {Promise<object>}
   */
  deleteSystem: async (systemId) => {
    return apiClient(`/systems/${systemId}`, {
      method: 'DELETE',
    });
  },
}; 