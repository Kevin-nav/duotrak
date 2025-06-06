// Simulate API calls for system check-ins

import { apiClient } from '../lib/apiClient';

export const checkinService = {
  /**
   * Logs a new check-in for a system.
   * Implements POST /checkins.
   * @param {object} checkinData - The data for the new check-in.
   * @param {string} checkinData.systemId - The ID of the system being checked into.
   * @param {number} [checkinData.metricValueLogged] - The value for the metric.
   * @param {string} [checkinData.notes] - User notes for the check-in.
   * @param {string} [checkinData.photoUrl] - URL of an uploaded photo for verification.
   * @returns {Promise<object>}
   */
  createCheckin: async (checkinData) => {
    return apiClient('/checkins', {
      method: 'POST',
      body: checkinData,
    });
  },

  /**
   * Fetches all check-ins, with potential filtering.
   * Implements GET /checkins.
   * @param {object} [filters] - Optional query parameters for filtering.
   * @param {string} [filters.systemId] - Filter by system ID.
   * @param {string} [filters.status] - Filter by status (e.g., 'pending_verification').
   * @returns {Promise<object>}
   */
  getCheckins: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return apiClient(`/checkins?${query}`);
  },
  
  /**
   * Fetches check-ins awaiting verification by the current user.
   * Implements GET /verifications/queue.
   * @returns {Promise<object>}
   */
  getVerificationQueue: async () => {
    return apiClient('/verifications/queue');
  },

  /**
   * Submits a verification decision for a check-in.
   * Implements POST /verifications/{checkinId}/verify.
   * @param {string} checkinId - The ID of the check-in to verify.
   * @param {object} verificationData - The verification decision.
   * @param {string} verificationData.decision - 'verified_completed' or 'queried_by_partner'.
   * @param {string} [verificationData.query] - The query text if the decision is 'queried'.
   * @returns {Promise<object>}
   */
  submitVerification: async (checkinId, verificationData) => {
    return apiClient(`/verifications/${checkinId}/verify`, {
      method: 'POST',
      body: verificationData,
    });
  },

  submitCheckIn: async (systemId, checkInData) => {
    console.log("checkinService.submitCheckIn called with systemId:", systemId, "and data:", checkInData);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate a successful check-in submission
    if (systemId && checkInData) {
      // In a real app, you would save this to a backend and associate with the user and system
      return {
        success: true,
        message: "Check-in submitted successfully!",
        checkIn: { id: "chk_" + Date.now(), systemId, ...checkInData, timestamp: new Date().toISOString() }, // Mock check-in object
      };
    } else {
      // Simulate an error
      return {
        success: false,
        message: "Check-in submission failed. Please provide all required details.",
      };
    }
  },

  getCheckInsForSystem: async (systemId) => {
    console.log("checkinService.getCheckInsForSystem called for systemId:", systemId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate fetching past check-ins
    // In a real app, this would query a database
    return {
      success: true,
      checkIns: [
        { id: "chk_1", systemId, notes: "Completed the morning run, felt great!", timestamp: "2023-10-26T08:00:00Z", submittedBy: "user_123" },
        { id: "chk_2", systemId, notes: "Meditation session done.", mood: "Calm", timestamp: "2023-10-25T09:15:00Z", submittedBy: "user_123" },
      ],
    };
  },

  getPartnerCheckInForVerification: async (systemId, checkInId) => {
    console.log("checkinService.getPartnerCheckInForVerification called for systemId:", systemId, "checkInId:", checkInId);
    await new Promise(resolve => setTimeout(resolve, 700));
    // Simulate fetching a specific partner check-in that needs verification
    return {
        success: true,
        checkIn: {
            id: checkInId || "chk_partner_1",
            systemId,
            partnerId: "partner_456",
            partnerName: "Partner Jane",
            notes: "Finished the project report ahead of schedule!",
            submittedAt: "2023-10-27T14:30:00Z",
            attachments: [{ name: "report_final.pdf", url: "#" }],
            status: "Pending Verification"
        }
    };
  },

  verifyPartnerCheckIn: async (checkInId, verificationStatus, comments) => {
    console.log("checkinService.verifyPartnerCheckIn called for checkInId:", checkInId, "status:", verificationStatus, "comments:", comments);
    await new Promise(resolve => setTimeout(resolve, 900));
    // Simulate verification action
    return {
        success: true,
        message: `Check-in ${verificationStatus} successfully.`,
        updatedCheckIn: {
            id: checkInId,
            status: verificationStatus === "approved" ? "Verified" : "Queried"
        }
    };
  }
}; 