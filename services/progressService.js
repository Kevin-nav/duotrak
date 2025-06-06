// services/progressService.js

// Mock data - this would typically come from a backend API
const mockServerData = {
  user123: {
    personalStats: {
      overallConsistency: 78,
      currentStreak: 12,
      longestStreak: 25,
      mostConsistentDay: 'Wednesdays',
    },
    partnerStats: {
      overallConsistency: 72,
      currentStreak: 10,
      longestStreak: 20,
      mostConsistentDay: 'Mondays',
    },
    userSystemsList: [
      { id: 'sys1', name: 'Morning Run' },
      { id: 'sys2', name: 'Daily Reading' },
      { id: 'sys3', name: 'Meditation' }
    ],
    partnerProfile: { username: 'PartnerPat', id: 'partner456' },
    consistencyOverTime: {
      // Data points: { date: string, userValue: number, partnerValue?: number }
      last7d: [
        { date: 'Day 1', userValue: 60, partnerValue: 55 },
        { date: 'Day 2', userValue: 70, partnerValue: 65 },
        { date: 'Day 3', userValue: 85, partnerValue: 70 },
        { date: 'Day 4', userValue: 75, partnerValue: 80 },
        { date: 'Day 5', userValue: 90, partnerValue: 75 },
        { date: 'Day 6', userValue: 80, partnerValue: 85 },
        { date: 'Day 7', userValue: 70, partnerValue: 60 },
      ],
      last30d: Array.from({ length: 30 }, (_, i) => ({
        date: `Day ${i + 1}`,
        userValue: Math.floor(Math.random() * 50) + 50, // 50-99
        partnerValue: Math.floor(Math.random() * 50) + 40, // 40-89
      })),
      // Add more presets as needed
    },
    metricsLogged: {
      // Data points: { systemName: string, userValue: number, partnerValue?: number }
      last7d: [
        { systemName: 'Morning Run', userValue: 5, partnerValue: 4 },
        { systemName: 'Daily Reading', userValue: 7, partnerValue: 6 },
        { systemName: 'Meditation', userValue: 6, partnerValue: 7 },
      ],
      last30d: [
        { systemName: 'Morning Run', userValue: 22, partnerValue: 18 },
        { systemName: 'Daily Reading', userValue: 28, partnerValue: 25 },
        { systemName: 'Meditation', userValue: 25, partnerValue: 29 },
      ],
    },
  }
};

export const progressService = {
  fetchProgressData: async (userId = 'user123', dateRangePreset = 'last7d', comparePartner = false, systemId = 'all') => {
    console.log('Fetching progress data with params:', { userId, dateRangePreset, comparePartner, systemId });
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const userData = mockServerData[userId];

    if (!userData) {
      return { success: false, message: "User data not found." };
    }

    // Filter/transform data based on params (simplified for mock)
    let consistencyData = userData.consistencyOverTime[dateRangePreset] || userData.consistencyOverTime.last7d;
    let metricsData = userData.metricsLogged[dateRangePreset] || userData.metricsLogged.last7d;

    if (systemId !== 'all') {
      metricsData = metricsData.filter(m => m.systemName === userData.userSystemsList.find(s => s.id === systemId)?.name);
    }

    // Construct the response
    const responseData = {
      personalStats: userData.personalStats,
      partnerProfile: userData.partnerProfile,
      userSystemsList: userData.userSystemsList,
      consistencyOverTime: consistencyData.map(d => ({
        date: d.date,
        consistency: d.userValue,
        ...(comparePartner && { partnerConsistency: d.partnerValue })
      })),
      metricsLogged: metricsData.map(m => ({
        systemName: m.systemName,
        logged: m.userValue,
        ...(comparePartner && { partnerLogged: m.partnerValue })
      })),
    };
    
    if (comparePartner) {
      responseData.partnerStats = userData.partnerStats;
    }

    // Simulate random error for testing
    // if (Math.random() < 0.1) {
    //   return { success: false, message: "A simulated random API error occurred." };
    // }

    return { success: true, data: responseData };
  },
}; 