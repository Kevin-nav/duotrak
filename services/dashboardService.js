// Simulate API calls for dashboard data

export const dashboardService = {
  getDashboardData: async (userId) => {
    console.log("dashboardService.getDashboardData called for userId:", userId);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a successful data fetch
    // In a real app, this data would come from a backend, filtered for the user/partnership
    if (userId) { // Assuming userId is passed, though not strictly used in this stub yet
      return {
        success: true,
        data: {
          systemsForToday: [
            { id: "sys_1", name: "Morning Meditation", status: "Completed", details: "10 minutes of guided meditation." },
            { id: "sys_2", name: "Gym Session - Legs", status: "Pending Partner Verification", details: "Focus on squats and deadlifts." },
            { id: "sys_3", name: "Client Follow-ups", status: "In Progress", details: "Email 3 clients, call 2 leads." },
            { id: "sys_4", name: "Read industry news", status: "Pending", details: "Catch up on latest trends for 30 mins." },
          ],
          verificationAlerts: [
            { id: "alert_1", systemId: "sys_2", systemName: "Gym Session - Legs", message: "Your partner has marked this as complete. Please verify." },
            // Add more alerts if needed
          ],
          dailyReflectionPrompts: [
            { id: "prompt_1", text: "What are you most grateful for today?" },
            { id: "prompt_2", text: "What challenge did you overcome?" },
            { id: "prompt_3", text: "How did you support your partner today?" },
          ],
          // You could also include things like streaks, progress overviews, etc.
        },
      };
    } else {
      // Simulate an error if no userId or some other issue
      return {
        success: false,
        message: "Failed to fetch dashboard data. User not identified.",
        data: null,
      };
    }
  },
}; 