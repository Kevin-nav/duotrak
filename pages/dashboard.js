import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner'; // For error notifications
import Link from 'next/link';
import { motion } from 'framer-motion'; // Added for animations
import { Loader2, MessageSquare, Edit3, CalendarDays, Clock, AlertTriangle, CheckCircle2, ListChecks, ExternalLink } from 'lucide-react'; // Added icons

import { useAuth } from '@/context/AuthContext';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { dashboardService } from '@/services/dashboardService';
import { Button } from '@/components/ui/button'; // For potential retry button
import { ErrorDisplay } from '@/components/Feedback/ErrorDisplay'; // Added
import { EmptyState } from '@/components/Feedback/EmptyState';   // Added
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Added Tabs
import StreakDisplay from '@/components/Progress/StreakDisplay'; // Import StreakDisplay

// Placeholder components - these would be developed in other tasks
const SystemCard = ({ system }) => {
  // Define status colors and icons (will be used in Phase 3)
  const statusStyles = {
    Completed: { color: 'text-green-600', bgColor: 'bg-green-100', icon: <CheckCircle2 className="w-4 h-4 mr-1.5" /> },
    'Pending Partner Verification': { color: 'text-amber-600', bgColor: 'bg-amber-100', icon: <AlertTriangle className="w-4 h-4 mr-1.5" /> },
    'In Progress': { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> },
    Pending: { color: 'text-gray-600', bgColor: 'bg-gray-100', icon: <ListChecks className="w-4 h-4 mr-1.5" /> },
  };
  const currentStatusStyle = statusStyles[system.status] || statusStyles.Pending;

  return (
    <Link href={`/systems/${system.id}`} passHref legacyBehavior>
      <motion.a
        className={`p-4 rounded-lg shadow-lg bg-card mb-4 hover:shadow-xl transition-all duration-300 ease-in-out flex flex-col justify-between min-h-[140px] cursor-pointer block`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      layout
    >
      <div>
        <h3 className="font-semibold text-lg text-primary-text-dark mb-1">{system.name}</h3>
          {system.scheduleTime && (
            <div className="flex items-center text-xs text-secondary-text-medium mb-1.5">
              <Clock className="w-3 h-3 mr-1.5 flex-shrink-0" />
              <span>{system.scheduleTime}</span>
            </div>
          )}
          {system.details && <p className="text-xs text-secondary-text-dark leading-relaxed line-clamp-2">{system.details}</p>}
      </div>
      <div className={`mt-auto text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-full ${currentStatusStyle.bgColor} ${currentStatusStyle.color}`}>
        {currentStatusStyle.icon}
        {system.status || 'Pending'}
      </div>
      </motion.a>
    </Link>
  );
};

const DailyReflectionCard = ({ prompt, onLogReflection }) => {
  const [reflectionText, setReflectionText] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  const handleTextChange = (event) => {
    setReflectionText(event.target.value);
    if (isLogged) setIsLogged(false);
  };

  const handleReflect = () => {
    if (!reflectionText.trim()) return;
    onLogReflection(prompt.id, prompt.text, reflectionText);
    toast.success(`Reflection for "${prompt.text.substring(0,30)}..." logged!`);
    setIsLogged(true);
    setReflectionText('');
    setTimeout(() => setIsLogged(false), 2500);
  };

  return (
    <motion.div 
        className="p-4 border rounded-lg shadow bg-card-bg overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <p className="text-primary-text-dark mb-2 font-medium">{prompt.text}</p>
      <motion.textarea
        value={reflectionText}
        onChange={handleTextChange}
        placeholder="Share your thoughts..."
        className="w-full p-2 border border-input rounded-md focus:ring-primary-accent focus:border-primary-accent min-h-[80px] text-sm text-primary-text-dark bg-background"
        whileFocus={{ 
            borderColor: '#4A90E2',
            boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)',
            scale: 1.005
        }}
        transition={{ duration: 0.2 }}
      />
      <Button 
        size="sm" 
        className="mt-3 text-xs transition-all duration-200 ease-in-out w-full sm:w-auto"
        onClick={handleReflect}
        disabled={isLogged || !reflectionText.trim()}
      >
        {isLogged ? (
            <motion.span key="logged" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center">
                <Edit3 className="w-3 h-3 mr-1.5" /> Logged! ✅
            </motion.span>
        ) : (
            <motion.span key="reflect" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center">
                <Edit3 className="w-3 h-3 mr-1.5" /> Reflect
            </motion.span>
        )}
      </Button>
    </motion.div>
  );
};

// Define a simple animation variant for content sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const overviewItemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authIsLoading } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [dataIsLoading, setDataIsLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [loggedReflections, setLoggedReflections] = useState([]);
  const MOCK_STREAK = 7; // Mock streak data
  const MOCK_PENDING_VERIFICATIONS_COUNT = 1; // Mock data
  const MOCK_PENDING_SYSTEMS_COUNT = 2; // Mock data

  // Helper function to convert time string (e.g., "07:00 AM") to minutes from midnight
  const timeStringToMinutes = (timeStr) => {
    if (!timeStr) return 24 * 60; // Default to end of day if no time
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (hours === 12) {
      hours = modifier.toUpperCase() === 'AM' ? 0 : 12;
    }
    if (modifier.toUpperCase() === 'PM' && hours < 12) {
      hours += 12;
    }
    return hours * 60 + minutes;
  };

  const handleLogNewReflection = (promptId, promptText, reflectionContent) => {
    const newReflection = {
      id: `${promptId}-${new Date().getTime()}`,
      promptId,
      promptText,
      reflection: reflectionContent,
      timestamp: new Date(),
    };
    setLoggedReflections(prevReflections => [newReflection, ...prevReflections]);
  };
  
  const fetchDashboardDetails = async () => {
    if (!user?.id) return;
    setDataIsLoading(true);
    setDataError(null);
    try {
      // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 1000)); 
      const response = await dashboardService.getDashboardData(user.id);
      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        // Use mock data as a fallback if API fails or returns no data for demonstration
        // In a real app, you might handle this error more specifically.
        console.warn("API failed or returned no data, using mock dashboard data for demonstration.");
        setDashboardData({
            systemsForToday: [
                { id: 'sys_001', name: 'Morning Jog (30 mins)', status: 'Completed', details: 'Completed a 30-minute jog around the park.', scheduleTime: '07:00 AM' },
                { id: 'sys_005', name: 'Grocery Shopping for Meal Prep', status: 'Awaiting Verification', details: 'Purchased all items from the healthy meal prep list.', scheduleTime: '10:30 AM' },
                { id: 'sys_003', name: 'Daily Language Practice (Spanish)', status: 'In Progress', details: 'Using Duolingo for 15 minutes.', scheduleTime: '06:00 PM' },
                { id: 'sys_002', name: 'Weekly Meal Prep', status: 'Pending', details: 'Prepare healthy meals for the upcoming week.', scheduleTime: '09:00 AM'},
                { id: 'sys_004', name: 'Submit Weekly Report', status: 'Awaiting Verification', details: 'Compile and submit the weekly progress report.', scheduleTime: '04:00 PM' },
                { id: 'sys_015', name: 'Organize Digital Files', status: 'Skipped', details: 'Declutter and organize cloud storage files.', scheduleTime: '01:00 PM' }
            ],
            dailyReflectionPrompts: [
                { id: 'refprompt1', text: 'What are you most grateful for today?' },
                { id: 'refprompt2', text: 'What challenge did you overcome today?' },
                { id: 'refprompt3', text: 'How did you support your partner today?' },
            ],
            verificationAlerts: [
                {id: 'alert1', systemName: 'Gym Session - Legs', message: 'Awaiting partner verification.'}
            ]
        });
        // throw new Error(response.message || "Failed to fetch dashboard data.");
      }
    } catch (error) {
      console.error("Dashboard data fetching error:", error);
      setDataError(error.message || "Could not load dashboard information.");
      toast.error(error.message || "Could not load dashboard information.");
    }
    setDataIsLoading(false);
  };

  useEffect(() => {
    if (!authIsLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard');
    } else if (isAuthenticated && user?.id) {
      fetchDashboardDetails();
    }
  }, [isAuthenticated, authIsLoading, user, router]);

  if (authIsLoading || (!isAuthenticated && !dataIsLoading)) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-primary-beige p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary-accent mb-4" />
            <p className="text-lg text-primary-text-dark">Loading your session...</p>
        </div>
    );
  }

  const systems = dashboardData?.systemsForToday
    ?.map(system => ({ ...system, sortableTime: timeStringToMinutes(system.scheduleTime) }))
    .sort((a, b) => a.sortableTime - b.sortableTime) || [];
  const reflectionPrompts = dashboardData?.dailyReflectionPrompts || [];
  const verificationAlerts = dashboardData?.verificationAlerts || []; // Using this for pending actions count

  const pendingSystemsCount = systems.filter(s => s.status === 'Pending' || s.status === 'In Progress').length;

  if (dataIsLoading && !dataError) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-128px)]">
            <Loader2 className="h-12 w-12 animate-spin text-primary-accent mb-4" />
            <p className="text-lg text-primary-text-dark">Loading your dashboard...</p>
        </div>
    );
  }

  if (dataError && !dataIsLoading) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-128px)]">
            <ErrorDisplay 
                title="Dashboard Unavailable"
                message={dataError}
                retryFunction={fetchDashboardDetails}
                iconType="server"
            />
        </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <ScreenHeader 
        title={`Welcome back, ${user?.name || 'User'}!`} 
        // Subtitle or other elements can be added here if needed
      />

      {/* New Overview Section */}
      <motion.section 
        aria-labelledby="dashboard-overview-title" 
        className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="md:col-span-1" variants={overviewItemVariants}>
            <StreakDisplay currentStreak={MOCK_STREAK} />
        </motion.div>
        <motion.div className="md:col-span-2 bg-card p-6 rounded-xl shadow-lg" variants={overviewItemVariants}>
            <h2 id="dashboard-overview-title" className="text-xl font-semibold text-primary-text-dark mb-4">Quick Look</h2>
            <div className="space-y-3">
                {verificationAlerts.length > 0 && (
                    <motion.div initial={{ opacity:0, x: -10 }} animate={{ opacity:1, x: 0}} transition={{delay: 0.1}} className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-amber-700">Partner Verifications Pending: {verificationAlerts.length}</p>
                            <Link href="/partnership?tab=verifications" passHref legacyBehavior>
                                <Button variant="link" size="sm" className="p-0 h-auto text-amber-600 hover:text-amber-700 text-xs">
                                    View Verifications
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
                {pendingSystemsCount > 0 && (
                     <Link href="/my-tasks" passHref legacyBehavior>
                       <motion.a // Changed from div to a for Link legacyBehavior
                         initial={{ opacity:0, x: -10 }}
                         animate={{ opacity:1, x: 0}}
                         transition={{delay: 0.2}}
                         className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100/70 transition-colors duration-200"
                         // onClick, role, tabIndex, onKeyDown are removed as Link handles navigation
                       >
                        <ListChecks className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-blue-700">Systems to Complete: {pendingSystemsCount}</p>
                        </div>
                       </motion.a>
                     </Link>
                )}
                 {verificationAlerts.length === 0 && pendingSystemsCount === 0 && (
                    <motion.div initial={{ opacity:0, x: -10 }} animate={{ opacity:1, x: 0}} transition={{delay: 0.1}} className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                        <p className="text-sm font-medium text-green-700">All clear! No immediate actions pending.</p>
                    </motion.div>
                )}
            </div>
        </motion.div>
      </motion.section>

      {/* Main Content Tabs */}
      <Tabs defaultValue="systems" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:w-[400px] mb-6">
          <TabsTrigger value="systems" id="tab-trigger-systems">Today's Systems</TabsTrigger>
          <TabsTrigger value="reflections" id="tab-trigger-reflections">Daily Reflections</TabsTrigger>
        </TabsList>

        <TabsContent value="systems">
          <motion.section 
            aria-labelledby="systems-today-title"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            key="systems-content" // Added key for re-animation on tab change
          >
            {systems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {systems.map((system, index) => (
                  <motion.div 
                    key={system.id} 
                    custom={index} 
                    initial={{opacity: 0, y: 20}}
                    animate={(i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3, ease: "easeOut" }})}
                   >
                     <SystemCard system={system} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState 
                title="No Systems Scheduled"
                message="All clear for today! Want to plan ahead or review your goals?"
                iconType="goal" 
                ctaButton={ 
                    <Link href="/goals" passHref>
                        <Button variant="default" size="sm">Manage Goals & Systems</Button>
                    </Link>
                }
              />
            )}
          </motion.section>
        </TabsContent>

        <TabsContent value="reflections">
          <motion.div 
            key="reflections-content" // Added key for re-animation on tab change
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, ease: "easeOut"}}
          >
            <Tabs defaultValue="prompts" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:w-[400px] mb-4">
                  <TabsTrigger value="prompts">Today's Prompts</TabsTrigger>
                  <TabsTrigger value="history">Reflection History ({loggedReflections.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="prompts">
                  {reflectionPrompts.length > 0 ? (
                    <div className="space-y-4">
                      {reflectionPrompts.map(prompt => (
                        <DailyReflectionCard 
                          key={prompt.id} 
                          prompt={prompt} 
                          onLogReflection={handleLogNewReflection}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      title="No Reflection Prompts Today"
                      message="Take a moment for yourself and reflect on your progress and well-being, or add a general reflection."
                      iconType="message-square"
                    />
                  )}
                </TabsContent>

                <TabsContent value="history">
                  {loggedReflections.length > 0 ? (
                    <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2">
                      {loggedReflections.map((entry, index) => (
                        <motion.div 
                          key={entry.id} 
                          className="p-4 rounded-lg shadow-lg bg-card hover:shadow-xl transition-all duration-300 ease-in-out"
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.05 }}
                        >
                          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
                              <p className="text-sm font-semibold text-primary-text-dark">{entry.promptText}</p>
                              <div className="text-xs text-secondary-text-light flex items-center space-x-2">
                                  <div className="flex items-center">
                                      <CalendarDays className="w-3.5 h-3.5 mr-1" />
                                      <span>{new Date(entry.timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                  </div>
                                  <div className="flex items-center">
                                      <Clock className="w-3.5 h-3.5 mr-1" />
                                      <span>{new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                  </div>
                              </div>
                          </div>
                          <p className="text-sm text-primary-text-dark whitespace-pre-wrap leading-relaxed">{entry.reflection}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      title="No Past Reflections Yet"
                      message="Your logged reflections will appear here once you respond to the daily prompts."
                      iconType="edit-3"
                    />
                  )}
                </TabsContent>
              </Tabs>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 