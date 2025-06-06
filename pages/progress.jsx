import React, { useState, useEffect } from 'react';
import Head from 'next/head'; // Added Head import
import { useRouter } from 'next/router'; // Added useRouter
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/Feedback/EmptyState';
import { ErrorDisplay } from '@/components/Feedback/ErrorDisplay';
import { progressService } from '@/services/progressService';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import { ProgressFilterControls } from '@/components/Progress/ProgressFilterControls';
import { StatCard } from '@/components/Progress/StatCard';
import { TrendingUp, Zap, CalendarDays, Users } from 'lucide-react';

// Dynamically import chart components
const DynamicLineChartWrapper = dynamic(() =>
  import('@/components/Progress/Charts/LineChartWrapper').then(mod => mod.LineChartWrapper),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full rounded bg-secondary-beige-light" />
  }
);

const DynamicBarChartWrapper = dynamic(() =>
  import('@/components/Progress/Charts/BarChartWrapper').then(mod => mod.BarChartWrapper),
  {
    ssr: false,
    loading: () => <Skeleton className="h-64 w-full rounded bg-secondary-beige-light" />
  }
);

// Mock data for initial layout (assuming progressService will eventually fetch goal-specific data)
const mockInitialProgressData = {
  goalTitle: "Sample Goal Title from Mock", // Added for context
  personalStats: {
    overallConsistency: 78,
    currentStreak: 12,
    longestStreak: 25,
    mostConsistentDay: 'Wednesdays',
  },
  userSystemsList: [
    { id: '1', name: 'Morning Run' }, 
    { id: '2', name: 'Daily Reading' }, 
    { id: '3', name: 'Meditation' }
  ],
  partnerProfile: { username: 'PartnerPat' },
  consistencyOverTime: [ // Data for Line Chart
    { date: 'Mon', consistency: 60, partnerConsistency: 55 },
    { date: 'Tue', consistency: 70, partnerConsistency: 65 },
    { date: 'Wed', consistency: 85, partnerConsistency: 70 },
    { date: 'Thu', consistency: 75, partnerConsistency: 80 },
    { date: 'Fri', consistency: 90, partnerConsistency: 75 },
    { date: 'Sat', consistency: 80, partnerConsistency: 85 },
    { date: 'Sun', consistency: 70, partnerConsistency: 60 },
  ],
  metricsLogged: [ // Data for Bar Chart
    { systemName: 'Morning Run', logged: 5, partnerLogged: 4 },
    { systemName: 'Daily Reading', logged: 7, partnerLogged: 6 },
    { systemName: 'Meditation', logged: 6, partnerLogged: 7 },
  ],
};

export default function ProgressStatsPage() {
  const router = useRouter(); // Initialize router
  const { goalId } = router.query; // Get goalId from query

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState({ preset: 'last7d', label: 'Last 7 Days' });
  const [compareWithPartner, setCompareWithPartner] = useState(false);
  const userId = 'user123'; // Mock user ID

  useEffect(() => {
    if (!router.isReady) return; // Don't fetch until router has query params

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const response = await progressService.fetchProgressData(
        userId,
        goalId, // Pass goalId
        selectedDateRange.preset,
        compareWithPartner
      );

      if (response.success) {
        const fetchedData = response.data || {}; // Ensure response.data is at least an empty object
        // Prioritize title from fetched data, then construct from goalId, then use mock, then a generic default.
        const finalGoalTitle = fetchedData.goalTitle || 
                               (goalId ? `Details for ${goalId}` : mockInitialProgressData.goalTitle) || 
                               "Overall Progress";
        setProgressData({
          ...mockInitialProgressData, // Start with mock structure to ensure all fields exist
          ...fetchedData,             // Overlay with actual data from the service
          goalTitle: finalGoalTitle   // Explicitly set/override goalTitle
        });
      } else {
        setError(response.message || "Failed to load progress data.");
        // Fallback to mock data on error for UI structure, but show error message
        setProgressData({ 
          ...mockInitialProgressData, 
          goalTitle: goalId ? `Error loading ${goalId}` : "Error Loading Progress" 
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [router.isReady, goalId, selectedDateRange, compareWithPartner, userId]); // Added goalId and router.isReady

  const lineChartLines = [
    { dataKey: 'consistency', name: 'Your Consistency', color: '#14B8A6' }, // New Teal color
  ];
  if (compareWithPartner && progressData?.partnerProfile) {
    lineChartLines.push({ 
      dataKey: 'partnerConsistency', 
      name: `${progressData.partnerProfile.username}'s Consistency`, 
      color: '#F97316' // New Orange color
    });
  }

  const barChartBars = [
    { dataKey: 'logged', name: 'You Logged', color: '#14B8A6' }, // New Teal color
  ];
  if (compareWithPartner && progressData?.partnerProfile) {
    barChartBars.push({ 
      dataKey: 'partnerLogged', 
      name: `${progressData.partnerProfile.username} Logged`, 
      color: '#F97316' // New Orange color
    });
  }

  const handleRetry = () => {
    if (!router.isReady) return;
     const fetchDataRetry = async () => { // Renamed to avoid conflict
      setIsLoading(true);
      setError(null);
      const response = await progressService.fetchProgressData(
        userId,
        goalId, 
        selectedDateRange.preset,
        compareWithPartner
      );
      if (response.success) {
        setProgressData(response.data || { ...mockInitialProgressData, goalTitle: goalId ? `Details for ${goalId}` : "Overall Progress" });
      } else {
        setError(response.message || "Failed to load progress data.");
        setProgressData({ ...mockInitialProgressData, goalTitle: goalId ? `Error loading ${goalId}` : "Error Loading Progress" });
      }
      setIsLoading(false);
    };
    fetchDataRetry();
  };

  if (!router.isReady || isLoading) { // Show skeleton if router not ready or loading
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-lg">
          <Skeleton className="h-9 w-1/3 mb-md" /> {/* Adjusted margin */}
          <Skeleton className="h-16 w-full p-md rounded-lg" /> 
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {[...Array(6)].map((_, i) => ( // Show more skeletons for a fuller loading state
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <ErrorDisplay 
          title={progressData?.goalTitle || "Could Not Load Progress"}
          message={error}
          retryFunction={handleRetry} 
        />
      </div>
    );
  }
  
  if (!progressData && !isLoading) {
    return (
         <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <ScreenHeader title="Progress Insights" breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Progress", isCurrent: true }]} />
            <EmptyState 
                title="No Progress Data Available"
                message="We couldn't find any progress data for this goal or period. Keep tracking to see your insights!"
                iconType="TrendingUp"
            />
        </div>
    );
  }
  
  const pageTitle = progressData?.goalTitle || (goalId ? `Progress for ${goalId}` : "Your Progress Insights");
  const pageDescription = `View progress and statistics for ${goalId || 'your goals'}. Track consistency, streaks, and compare with your partner.`;

  return (
    <>
      <Head>
        <title>{pageTitle} - DuoTrak</title>
        <meta name="description" content={pageDescription} />
      </Head>
      <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-lg"> {/* Added space-y-lg for consistent vertical spacing */}
        <ScreenHeader 
          title={pageTitle}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Goals", href: "/goals" }, // Assuming a /goals listing page
            { label: progressData?.goalTitle ? `Goal: ${progressData.goalTitle}` : (goalId ? `Goal: ${goalId}` : 'Progress'), isCurrent: true }
          ]}
        />
        
        <ProgressFilterControls 
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
          compareWithPartner={compareWithPartner}
          onCompareChange={setCompareWithPartner}
          partnerUsername={progressData?.partnerProfile?.username}
          className="px-md pt-md pb-xl bg-card-modal-background rounded-lg shadow-duotrak-card"
        />

        {/* Main Content Area - Grid of Stat/Chart Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2.5rem] mt-[2rem]"> {/* Hardcoded 2rem margin-top */}
          <StatCard 
            title="Overall Consistency"
            value={progressData?.personalStats?.overallConsistency}
            unit="%"
            description={selectedDateRange.label}
            icon={TrendingUp}
            className="lg:col-span-1"
            cardClassName="bg-white border-0 shadow-lg hover:shadow-xl"
          />

          {compareWithPartner && progressData?.partnerStats && (
            <StatCard
              title={`${progressData.partnerProfile.username}'s Consistency`}
              value={progressData.partnerStats.overallConsistency}
              unit="%"
              description={selectedDateRange.label}
              icon={Users}
              className="lg:col-span-1"
              cardClassName="bg-white border-0 shadow-lg hover:shadow-xl"
            />
          )}
          
          <StatCard 
            title="Current Streak"
            value={progressData?.personalStats?.currentStreak}
            unit="days"
            description={`Longest: ${progressData?.personalStats?.longestStreak || 'N/A'} days`}
            icon={Zap}
            className="lg:col-span-1"
            cardClassName="bg-white border-0 shadow-lg hover:shadow-xl"
          />
          
          <StatCard
            title="Most Consistent Day"
            value={progressData?.personalStats?.mostConsistentDay || 'N/A'}
            description="Based on selected range"
            icon={CalendarDays}
            className="lg:col-span-1"
            cardClassName="bg-white border-0 shadow-lg hover:shadow-xl"
          />

          <Card className="md:col-span-2 lg:col-span-3 bg-white border-0 shadow-lg hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Consistency Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <DynamicLineChartWrapper 
                data={progressData?.consistencyOverTime || []}
                xAxisKey="date"
                lines={lineChartLines}
                aspect={typeof window !== 'undefined' && window.innerWidth < 768 ? 1.5 : 3}
              />
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 lg:col-span-3 bg-white border-0 shadow-lg hover:shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">System Engagement Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <DynamicBarChartWrapper 
                data={progressData?.metricsLogged || []}
                xAxisKey="systemName"
                bars={barChartBars}
                layout={typeof window !== 'undefined' && window.innerWidth < 768 ? "vertical" : "horizontal"}
                aspect={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2.5}
              />
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  );
} 