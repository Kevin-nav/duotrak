import { subDays, addDays } from 'date-fns';
import { notificationService } from './notificationService';

const MOCK_USER_ID = 'user123'; // Assume this is the current logged-in user

const allUserTasks = [
  {
    id: 'sys_1',
    name: 'Morning Jog (30 mins)',
    goalName: 'Improve Cardiovascular Health',
    status: 'Completed', // Completed, Pending, In Progress, Skipped, Awaiting Verification, Verified, Queried
    assignedDate: subDays(new Date(), 5).toISOString(),
    completionDate: subDays(new Date(), 5).toISOString(),
    details: 'Completed a 30-minute jog around the park.',
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
  },
  {
    id: 'sys_2',
    name: 'Submit Project Proposal',
    goalName: 'Q3 Project Alpha',
    status: 'Verified',
    assignedDate: subDays(new Date(), 3).toISOString(),
    completionDate: subDays(new Date(), 3).toISOString(),
    details: 'Drafted and submitted the full project proposal document including market analysis.',
    requiresImageVerification: true,
    verificationImageUrl: 'https://picsum.photos/seed/proposal/300/200', // Placeholder image
    partnerComments: null,
  },
  {
    id: 'sys_3',
    name: 'Daily Language Practice (Spanish)',
    goalName: 'Learn Spanish Fluency',
    status: 'In Progress',
    assignedDate: subDays(new Date(), 1).toISOString(),
    completionDate: null,
    details: 'Using Duolingo for 15 minutes and practicing conversation.',
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
  },
  {
    id: 'sys_4',
    name: 'Weekly Fitness Class - HIIT',
    goalName: 'Improve Cardiovascular Health',
    status: 'Pending',
    assignedDate: new Date().toISOString(), // Today
    completionDate: null,
    details: 'Attend the scheduled HIIT class at the gym.',
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
  },
  {
    id: 'sys_5',
    name: 'Grocery Shopping for Meal Prep',
    goalName: 'Healthy Eating Habits',
    status: 'Awaiting Verification',
    assignedDate: subDays(new Date(), 1).toISOString(),
    completionDate: subDays(new Date(), 1).toISOString(),
    details: 'Purchased all items from the healthy meal prep list. Photo of receipt attached.',
    requiresImageVerification: true,
    verificationImageUrl: 'https://picsum.photos/seed/receipt/300/200', // Placeholder image
    partnerComments: null,
  },
  {
    id: 'sys_6',
    name: 'Read Chapter 5 of "Atomic Habits"',
    goalName: 'Personal Development Reading',
    status: 'Skipped',
    assignedDate: subDays(new Date(), 2).toISOString(),
    completionDate: null,
    details: 'Was unable to complete reading due to other urgent tasks.',
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
  },
  {
    id: 'sys_7',
    name: 'Meditation Session (15 mins)',
    goalName: 'Mindfulness Practice',
    status: 'Queried',
    assignedDate: subDays(new Date(), 4).toISOString(),
    completionDate: subDays(new Date(), 4).toISOString(),
    details: 'Logged 15 minutes of meditation using Headspace.',
    requiresImageVerification: true,
    verificationImageUrl: 'https://picsum.photos/seed/meditation_proof/300/200',
    partnerComments: "Could you clarify if this was a guided or unguided session? The screenshot isn't clear.",
  },
  // Add more tasks to ensure pagination works (around 15-20 total)
  {
    id: 'sys_8',
    name: 'Client Meeting Prep',
    goalName: 'Work Project X',
    status: 'Completed',
    assignedDate: subDays(new Date(), 7).toISOString(),
    completionDate: subDays(new Date(), 7).toISOString(),
    details: 'Prepared slides and talking points for the client presentation.',
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
  },
  {
    id: 'sys_9',
    name: 'Water Plants',
    goalName: 'Home Care',
    status: 'Pending',
    assignedDate: addDays(new Date(), 1).toISOString(), // Tomorrow
    completionDate: null,
    details: 'Ensure all indoor plants are watered.',
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
  },
  {
    id: 'sys_10',
    name: 'Plan Weekend Trip',
    goalName: 'Personal Relaxation',
    status: 'In Progress',
    assignedDate: subDays(new Date(), 0).toISOString(), // Today
    completionDate: null,
    details: 'Researching destinations and accommodation options.',
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
  },
   {
    id: 'sys_11',
    name: 'Write Blog Post Draft',
    goalName: 'Content Creation Q1',
    status: 'Awaiting Verification',
    assignedDate: subDays(new Date(), 2).toISOString(),
    completionDate: subDays(new Date(), 2).toISOString(),
    details: 'Completed the first draft of the blog post on Tailwind CSS best practices. Screenshot of word count attached.',
    requiresImageVerification: true,
    verificationImageUrl: 'https://picsum.photos/seed/blogdraft/300/200',
    partnerComments: null,
  },
  {
    id: 'sys_12',
    name: 'Yoga Session (Home)',
    goalName: 'Flexibility & Wellness',
    status: 'Completed',
    assignedDate: subDays(new Date(), 6).toISOString(),
    completionDate: subDays(new Date(), 6).toISOString(),
    details: 'Followed a 45-minute online yoga class.',
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
  },
  {
    id: 'sys_13',
    name: 'Code Refactoring - Auth Module',
    goalName: 'App Performance Improvement',
    status: 'Verified',
    assignedDate: subDays(new Date(), 10).toISOString(),
    completionDate: subDays(new Date(), 10).toISOString(),
    details: 'Refactored the authentication module, reducing redundant code. PR link submitted.',
    requiresImageVerification: true, // Assuming PR link is a form of 'image' or proof.
    verificationImageUrl: 'https://picsum.photos/seed/codeproof/300/200', // Placeholder, could be screenshot of PR
    partnerComments: "Looks good, approved!",
  },
  {
    id: 'sys_14',
    name: 'Evening Walk (20 mins)',
    goalName: 'Daily Activity Goal',
    status: 'Pending',
    assignedDate: new Date().toISOString(), // Today
    completionDate: null,
    details: 'Take a brisk 20-minute walk in the evening.',
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
  },
  {
    id: 'sys_15',
    name: 'Organize Digital Files',
    goalName: 'Productivity Boost',
    status: 'Skipped',
    assignedDate: subDays(new Date(), 3).toISOString(),
    completionDate: null,
    details: 'Did not have time to organize files as planned.',
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
  }
].sort((a, b) => new Date(b.assignedDate) - new Date(a.assignedDate)); // Sort by newest assigned first

// MOCK DATA (to be replaced with actual API calls)
const mockSystemTasks = {
  'sys_1': { // New entry for the ID the user is clicking
    id: 'sys_1',
    name: 'Morning Meditation (10 mins)', // Matching user's observation from previous turn
    goalId: 'goal_007',
    goalName: 'Mindfulness Practice',
    description: 'A 10-minute guided meditation session to start the day with focus and calm.',
    status: 'Pending',
    scheduleDescription: 'Daily at 6:50 AM',
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
    currentStreakForSystem: 1,
    longestStreakForSystem: 3,
    totalCompletions: 7,
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), status: 'Pending' },
    ],
    details: 'Use a guided meditation app or a quiet space. Focus on breath and clearing the mind.',
  },
  'sys_2': {
    id: 'sys_2',
    name: 'Morning Jog (30 mins)',
    goalId: 'goal_001',
    goalName: 'Improve Cardiovascular Health',
    description: 'Complete a 30-minute jog around the park. Maintain a steady pace and focus on breathing techniques. Remember to stretch before and after.',
    status: 'Completed', // Possible: Pending, In Progress, Completed, Awaiting Verification, Verified, Queried, Skipped
    scheduleDescription: 'Daily at 7:00 AM',
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
    currentStreakForSystem: 5,
    longestStreakForSystem: 12,
    totalCompletions: 25,
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), status: 'Completed' },
      { date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), status: 'Completed' },
      { date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), status: 'Completed' },
    ],
    details: 'Detailed instructions for morning jog: Start with a 5-min warm-up walk. Jog for 20 mins. Cool down with a 5-min walk. Track distance and pace if possible.',
  },
  'sys_3': {
    id: 'sys_3',
    name: 'Weekly Meal Prep',
    goalId: 'goal_002',
    goalName: 'Eat Healthier Meals',
    description: 'Prepare healthy meals for the upcoming week. Focus on balanced portions of protein, carbs, and vegetables.',
    status: 'Pending',
    scheduleDescription: 'Sundays at 3:00 PM',
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    requiresImageVerification: true,
    verificationImageUrl: null, // 'https://picsum.photos/seed/mealprep/400/300', // Example if submitted
    partnerComments: null,
    currentStreakForSystem: 0,
    longestStreakForSystem: 4,
    totalCompletions: 10,
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), status: 'Completed' },
      { date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString(), status: 'Skipped' },
    ],
    details: 'Meal prep includes: Chicken breast, quinoa, broccoli, sweet potatoes. Prepare 5 lunches and 5 dinners. Store in airtight containers.',
  },
  'sys_4': {
    id: 'sys_4',
    name: 'Daily Language Practice (Spanish)',
    goalId: 'goal_003',
    goalName: 'Learn a New Language',
    description: 'Dedicate 15 minutes to Spanish language learning using an app like Duolingo or Babbel.',
    status: 'In Progress',
    scheduleDescription: 'Daily at 6:00 PM',
    assignedDate: new Date().toISOString(),
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
    currentStreakForSystem: 2,
    longestStreakForSystem: 2,
    totalCompletions: 2,
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), status: 'In Progress' },
    ],
    details: 'Focus on vocabulary and basic sentence structure. Complete at least one lesson.',
  },
  'sys_5': {
    id: 'sys_5',
    name: 'Submit Weekly Report',
    goalId: 'goal_001', // Belongs to another goal for variety
    goalName: 'Improve Cardiovascular Health', // This is a bit off, but for example
    description: 'Compile and submit the weekly progress report to the manager.',
    status: 'Awaiting Verification',
    scheduleDescription: 'Fridays by 5:00 PM',
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    requiresImageVerification: true,
    verificationImageUrl: 'https://picsum.photos/seed/report/400/300', // Already submitted
    partnerComments: null,
    currentStreakForSystem: 1,
    longestStreakForSystem: 5,
    totalCompletions: 5,
    recentActivity: [
       { date: new Date(new Date().setDate(new Date().getDate() - 0)).toISOString(), status: 'Awaiting Verification' },
       { date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), status: 'Verified' },
    ],
    details: 'Report should include key metrics, achievements, and challenges from the week.',
  },
   'sys_005': {
    id: 'sys_005',
    name: 'Grocery Shopping for Meal Prep',
    goalId: 'goal_002',
    goalName: 'Eat Healthier Meals',
    description: 'Purchased all items from the healthy meal prep list. And this is a very long description to test how it wraps or truncates in the UI, spanning multiple lines hopefully, to see if the line-clamp is working as expected or if we need to adjust styling for longer text content in cards or detail views. It keeps going and going.',
    status: 'Queried',
    scheduleDescription: 'Saturdays, Bi-Weekly',
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    requiresImageVerification: true,
    verificationImageUrl: 'https://picsum.photos/seed/groceryfail/400/300',
    partnerComments: "Hey, I noticed you bought regular soda instead of diet. Was that intentional? Let's stick to the plan! :)",
    currentStreakForSystem: 0,
    longestStreakForSystem: 3,
    totalCompletions: 6,
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), status: 'Queried' },
      { date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(), status: 'Verified' },
    ],
    details: 'Shopping list includes: avocados, spinach, eggs, almond milk, whole grain bread. Check for discounts.',
  },
  // Add more mock systems as needed, for example one that is 'Verified'
   'sys_006': {
    id: 'sys_6',
    name: 'Book Club Reading',
    goalId: 'goal_004',
    goalName: 'Read More Books',
    description: 'Read 2 chapters of the current book club selection.',
    status: 'Verified',
    scheduleDescription: 'Mon, Wed, Fri evenings',
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: "Great job on keeping up with the reading!",
    currentStreakForSystem: 8,
    longestStreakForSystem: 8,
    totalCompletions: 12,
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), status: 'Verified' },
      { date: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(), status: 'Verified' },
    ],
    details: 'Current book: "The Midnight Library". Reflect on themes and prepare discussion points.',
  },
  'sys_07': { // Added new system details
    id: 'sys_7',
    name: 'Evening Walk (20 mins)',
    goalId: 'goal_001', // Example goal
    goalName: 'Daily Activity Goal',
    description: 'A brisk 20-minute walk after dinner to aid digestion and unwind.',
    status: 'Pending',
    scheduleDescription: 'Daily at 8:00 PM',
    assignedDate: new Date().toISOString(),
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
    currentStreakForSystem: 0,
    longestStreakForSystem: 0,
    totalCompletions: 0,
    recentActivity: [],
    details: 'Walk in the neighborhood or a nearby park. Maintain a comfortable pace.',
  },
  'sys_14': { // Added new system details for Evening Walk
    id: 'sys_14',
    name: 'Evening Walk (20 mins)',
    goalId: 'goal_008', // Example goal ID
    goalName: 'Daily Activity Goal',
    description: 'Take a brisk 20-minute walk in the evening to unwind and hit your daily step target.',
    status: 'Pending',
    scheduleDescription: 'Daily at 8:00 PM', // Matching dashboard card
    assignedDate: new Date().toISOString(),
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
    currentStreakForSystem: 0,
    longestStreakForSystem: 0,
    totalCompletions: 0,
    recentActivity: [],
    details: 'Take a brisk 20-minute walk in the evening. Choose a safe and well-lit route.',
  },
  'sys_8': { // Added new system details for Client Meeting Prep
    id: 'sys_8',
    name: 'Client Meeting Prep',
    goalId: 'goal_work_001', // Example goal ID
    goalName: 'Work Project X',
    description: 'Prepare all necessary materials for the upcoming client meeting, including presentation slides, talking points, and any required data analysis.',
    status: 'Completed', // As per dashboard card
    scheduleDescription: 'As needed before client meetings', // General description
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), // From allUserTasks
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
    currentStreakForSystem: 3, // Example value
    longestStreakForSystem: 5, // Example value
    totalCompletions: 10, // Example value
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(), status: 'Completed' }
    ],
    details: 'Prepared slides and talking points for the client presentation. Ensured all data is up-to-date and visuals are clear.',
  },
  'sys_009': { // Added new system details for Water Plants
    id: 'sys_9',
    name: 'Water Plants',
    goalId: 'goal_home_001', // Example goal ID
    goalName: 'Home Care',
    description: 'Water all indoor plants according to their needs. Check soil moisture before watering.',
    status: 'Pending', // As per dashboard card
    scheduleDescription: 'Typically Mon & Fri, or as needed', // General description
    assignedDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow, from allUserTasks
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
    currentStreakForSystem: 0, // Example value
    longestStreakForSystem: 2, // Example value
    totalCompletions: 5, // Example value
    recentActivity: [], // No recent activity as it's for tomorrow
    details: 'Ensure all indoor plants are watered. Check for pests and remove any dead leaves.',
  },
  'sys_010': { // Added new system details for Plan Weekend Trip
    id: 'sys_10',
    name: 'Plan Weekend Trip',
    goalId: 'goal_relax_001', // Example goal ID
    goalName: 'Personal Relaxation',
    description: 'Plan and book a relaxing weekend trip. Consider destinations, accommodation, and activities.',
    status: 'In Progress', // As per dashboard card
    scheduleDescription: 'Flexible, typically evenings', // General description
    assignedDate: new Date().toISOString(), // Today, from allUserTasks
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
    currentStreakForSystem: 0, // Example value
    longestStreakForSystem: 0, // Example value
    totalCompletions: 0, // Example value
    recentActivity: [
      { date: new Date().toISOString(), status: 'In Progress' } // Activity for today
    ],
    details: 'Researching destinations and accommodation options. Check budget and availability. Aim to book by end of week.',
  },
  'sys_011': { // Added new system details for Write Blog Post Draft
    id: 'sys_11',
    name: 'Write Blog Post Draft',
    goalId: 'goal_content_001', // Example goal ID
    goalName: 'Content Creation Q1',
    description: 'Complete the first draft of the blog post on Tailwind CSS best practices. Include code examples and practical tips.',
    status: 'Awaiting Verification', // As per dashboard card
    scheduleDescription: 'Tue & Thu afternoons', // General description
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // From allUserTasks
    requiresImageVerification: true, // From allUserTasks
    verificationImageUrl: 'https://picsum.photos/seed/blogdraft/400/300', // From allUserTasks, updated seed slightly
    partnerComments: null,
    currentStreakForSystem: 1, // Example value
    longestStreakForSystem: 1, // Example value
    totalCompletions: 3, // Example value
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), status: 'Awaiting Verification' } // Activity for assign date
    ],
    details: 'Completed the first draft of the blog post on Tailwind CSS best practices. Screenshot of word count and outline attached for verification. Ensure all key points from the brief are covered.',
  },
  'sys_012': { // Added new system details for Yoga Session (Home)
    id: 'sys_12',
    name: 'Yoga Session (Home)',
    goalId: 'goal_wellness_001', // Example goal ID
    goalName: 'Flexibility & Wellness',
    description: 'Complete a 45-minute online yoga session focusing on Vinyasa flow.',
    status: 'Completed', // As per dashboard card
    scheduleDescription: 'Mon, Wed, Fri mornings', // General description
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(), // From allUserTasks
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
    currentStreakForSystem: 4, // Example value
    longestStreakForSystem: 10, // Example value
    totalCompletions: 20, // Example value
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString(), status: 'Completed' },
      { date: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(), status: 'Completed' }
    ],
    details: 'Followed a 45-minute online yoga class. Focused on improving flexibility and strength. Used Yoga With Adriene YouTube channel.',
  },
  'sys_013': { // Added new system details for Code Refactoring
    id: 'sys_13',
    name: 'Code Refactoring - Auth Module',
    goalId: 'goal_dev_001', // Example goal ID
    goalName: 'App Performance Improvement',
    description: 'Refactor the authentication module to improve performance, reduce redundant code, and enhance security.',
    status: 'Verified', // As per dashboard card
    scheduleDescription: 'Ongoing task, part of Sprint 3', // General description
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), // From allUserTasks
    requiresImageVerification: true, // From allUserTasks
    verificationImageUrl: 'https://picsum.photos/seed/codeproof_auth/400/300', // From allUserTasks, updated seed
    partnerComments: "Looks good, approved!", // From allUserTasks
    currentStreakForSystem: 5, // Example value
    longestStreakForSystem: 5, // Example value
    totalCompletions: 1, // Assuming this is the first major refactor completion
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(), status: 'Verified' }
    ],
    details: 'Refactored the authentication module, reducing redundant code and improving query efficiency. PR link submitted. All unit tests passing.',
  },
  'sys_015': { // Added new system details for Organize Digital Files
    id: 'sys_15',
    name: 'Organize Digital Files',
    goalId: 'goal_prod_001', // Example goal ID
    goalName: 'Productivity Boost',
    description: 'Organize digital files on cloud storage and local drives. Create a consistent folder structure and delete unnecessary files.',
    status: 'Skipped', // As per dashboard card
    scheduleDescription: 'Flexible, once a month', // General description
    assignedDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), // From allUserTasks
    requiresImageVerification: false,
    verificationImageUrl: null,
    partnerComments: null,
    currentStreakForSystem: 0, // Example value, reset due to skip
    longestStreakForSystem: 3, // Example value
    totalCompletions: 2, // Example value
    recentActivity: [
      { date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), status: 'Skipped' } // Activity for assign date
    ],
    details: 'Did not have time to organize files as planned. Reschedule for next week. Focus on project archives and photo backups first.',
  }
};

// Helper function to normalize IDs for mockSystemTasks keys
const normalizeIdForKey = (id) => {
  if (typeof id !== 'string') return id;
  return id.replace(/^sys_0*/, 'sys_');
}

// Corrected mockSystemTasks object with normalized keys and internal IDs
const correctedMockSystemTasks = Object.entries(mockSystemTasks).reduce((acc, [key, value]) => {
  const normalizedKey = normalizeIdForKey(key);
  const normalizedInternalId = normalizeIdForKey(value.id);
  
  // Prioritize value.id if it's already more "normalized" (e.g. sys_1 vs sys_001 from old key)
  // and ensure the object's id field is also normalized
  const finalKey = normalizeIdForKey(value.id) || normalizedKey; // Use the id from the value if it's good
  
  acc[finalKey] = {
    ...value,
    id: finalKey // Ensure internal ID is also correctly normalized and matches the key
  };
  return acc;
}, {});

export const myTasksService = {
  getAllMyTasks: async (userId, { page = 1, limit = 10, filters = {} } = {}) => {
    console.log(`myTasksService.getAllMyTasks called for userId: ${userId}, page: ${page}, limit: ${limit}, filters:`, filters);
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay

    // In a real app, 'userId' would be used to fetch data from a backend.
    // Here, we assume all mock tasks belong to the MOCK_USER_ID if userId matches, or just return all for demo.
    // Filtering logic would also be more complex (e.g., by status, date range from 'filters' object).

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = allUserTasks.slice(startIndex, endIndex);
    const hasNextPage = endIndex < allUserTasks.length;

    return {
      success: true,
      tasks: paginatedItems,
      pagination: {
        currentPage: page,
        limit: limit,
        totalItems: allUserTasks.length,
        totalPages: Math.ceil(allUserTasks.length / limit),
        hasNextPage: hasNextPage,
      }
    };
  },

  getSystemTaskDetails: async (systemId) => {
    console.log(`myTasksService: Fetching details for system ID: ${systemId}`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const normalizedQueryId = normalizeIdForKey(systemId); // Normalize the lookup key
    const task = correctedMockSystemTasks[normalizedQueryId]; // Use corrected and normalized map

    if (task) {
      console.log(`myTasksService: Found task for ${normalizedQueryId}:`, task.name);
      return { success: true, task: { ...task } }; // Return a copy
    } else {
      console.warn(`myTasksService: No task found for system ID: ${normalizedQueryId} (original query: ${systemId})`);
      // Log available keys for debugging if not found
      console.log('Available keys in correctedMockSystemTasks:', Object.keys(correctedMockSystemTasks).join(', '));
      return { success: false, message: `System with ID ${normalizedQueryId} not found.`, task: null };
    }
  },

  updateSystemTaskStatus: async (taskId, newStatus, completionDetailsObj = {}) => {
    console.log(`myTasksService.updateSystemTaskStatus called for taskId: ${taskId}, newStatus: ${newStatus}`, completionDetailsObj);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const normalizedTaskId = normalizeIdForKey(taskId);

    const taskIndex = allUserTasks.findIndex(t => normalizeIdForKey(t.id) === normalizedTaskId);
    if (taskIndex === -1) {
       // Also check in correctedMockSystemTasks as a fallback if not in allUserTasks (should not happen if consistent)
      if (correctedMockSystemTasks[normalizedTaskId]) {
        correctedMockSystemTasks[normalizedTaskId].status = newStatus;
         if (newStatus === 'Completed' || newStatus === 'Verified' || newStatus === 'Awaiting Verification') {
            correctedMockSystemTasks[normalizedTaskId].completionDate = new Date().toISOString();
        }
        // Apply completionDetailsObj if needed
        return { success: true, task: correctedMockSystemTasks[normalizedTaskId], message: `Task status updated to ${newStatus}.` };
      }
      return { success: false, message: "Task not found." };
    }

    const updatedTask = { ...allUserTasks[taskIndex], status: newStatus };

    if (newStatus === 'Completed' || newStatus === 'Verified' || newStatus === 'Awaiting Verification') {
      updatedTask.completionDate = new Date().toISOString();
    }
    if (completionDetailsObj.details) {
      updatedTask.details = `${updatedTask.details}\n--- Updated Completion ---\n${completionDetailsObj.details}`;
    }
    if (completionDetailsObj.verificationImageUrl) {
        updatedTask.verificationImageUrl = completionDetailsObj.verificationImageUrl;
    }

    allUserTasks[taskIndex] = updatedTask;
    return { success: true, task: updatedTask, message: `Task status updated to ${newStatus}.` };
  },

  submitVerificationImage: async (taskId, imageUrl) => {
    console.log(`myTasksService.submitVerificationImage called for taskId: ${taskId}, imageUrl: ${imageUrl}`);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
    
    const normalizedTaskId = normalizeIdForKey(taskId);
    let taskToNotify = null;

    const taskIndex = allUserTasks.findIndex(t => normalizeIdForKey(t.id) === normalizedTaskId);
    if (taskIndex === -1) {
      // Fallback check in correctedMockSystemTasks
      if (correctedMockSystemTasks[normalizedTaskId]) {
        if (!correctedMockSystemTasks[normalizedTaskId].requiresImageVerification) {
            return { success: false, message: "This task does not require image verification." };
        }
        correctedMockSystemTasks[normalizedTaskId].verificationImageUrl = imageUrl;
        if (correctedMockSystemTasks[normalizedTaskId].status !== 'Awaiting Verification' && correctedMockSystemTasks[normalizedTaskId].status !== 'Queried') {
            correctedMockSystemTasks[normalizedTaskId].status = 'Awaiting Verification';
            // Task status changed to Awaiting Verification, prepare for notification
            taskToNotify = correctedMockSystemTasks[normalizedTaskId];
        }
        correctedMockSystemTasks[normalizedTaskId].completionDate = new Date().toISOString();
        
        if (taskToNotify) {
          notificationService.addVerificationRequestNotification(taskToNotify, MOCK_USER_ID);
        }
        return { success: true, task: correctedMockSystemTasks[normalizedTaskId], message: "Verification image submitted." };
      }
      return { success: false, message: "Task not found for image submission." };
    }

    allUserTasks[taskIndex].verificationImageUrl = imageUrl;
    // Potentially change status to 'Awaiting Verification' if it wasn't already
    if (allUserTasks[taskIndex].status !== 'Awaiting Verification' && allUserTasks[taskIndex].status !== 'Queried') {
        allUserTasks[taskIndex].status = 'Awaiting Verification';
        // Task status changed to Awaiting Verification, prepare for notification
        taskToNotify = allUserTasks[taskIndex];
    }
    allUserTasks[taskIndex].completionDate = new Date().toISOString(); // Mark as completed when image submitted

    if (taskToNotify) {
      notificationService.addVerificationRequestNotification(taskToNotify, MOCK_USER_ID);
    }

    return { success: true, task: allUserTasks[taskIndex], message: "Verification image submitted." };
  },

  respondToQuery: async (taskId, responseText) => {
    console.log(`myTasksService.respondToQuery called for taskId: ${taskId}, response: ${responseText}`);
    await new Promise(resolve => setTimeout(resolve, 500));

    const normalizedTaskId = normalizeIdForKey(taskId);

    const taskIndex = allUserTasks.findIndex(t => normalizeIdForKey(t.id) === normalizedTaskId);
    if (taskIndex === -1) {
      // Fallback check in correctedMockSystemTasks
       if (correctedMockSystemTasks[normalizedTaskId]) {
         if (correctedMockSystemTasks[normalizedTaskId].status !== 'Queried') {
            return { success: false, message: "This task is not currently queried." };
        }
        correctedMockSystemTasks[normalizedTaskId].userResponseToQuery = responseText;
        correctedMockSystemTasks[normalizedTaskId].status = 'Awaiting Verification';
        return { success: true, task: correctedMockSystemTasks[normalizedTaskId], message: "Response to query submitted." };
      }
      return { success: false, message: "Task not found to respond to query." };
    }

    // Append user's response, or store in a new field
    allUserTasks[taskIndex].userResponseToQuery = responseText;
    allUserTasks[taskIndex].status = 'Awaiting Verification'; // Or 'Responded', then partner changes to 'Awaiting Verification'
    // Clear previous partner comments if you want to, or keep history
    // allUserTasks[taskIndex].partnerComments = null; 

    return { success: true, task: allUserTasks[taskIndex], message: "Response to query submitted." };
  }

  // Future methods:
  // submitTaskForVerification: async (taskId, imageUrl, notes) => { ... }, // More comprehensive than submitVerificationImage
}; 