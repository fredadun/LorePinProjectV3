/**
 * Script to create GitHub milestones for LorePin sprints
 * 
 * This script creates six milestones representing the sprints for the LorePin project.
 * Each milestone includes a title, description, and due date.
 * 
 * Usage:
 * 1. Make sure you have a GITHUB_TOKEN environment variable set
 * 2. Run: node create-milestones.js
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  // Set the start date for Sprint 1 (adjust as needed)
  startDate: new Date('2025-04-01'), // Example start date
  sprintDuration: 14 // Sprint duration in days
};

// Initialize Octokit
const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('ERROR: GitHub token not found in environment variables!');
  process.exit(1);
}

const octokit = new Octokit({
  auth: token
});

// Sprint definitions
const sprints = [
  {
    title: 'Sprint 1: User Onboarding & Profiles',
    description: `Focus: Authentication, user profiles, and basic social connections

Goals:
- Implement social login (Google, Instagram)
- Create user profile functionality
- Implement follow/unfollow system
- Set up basic user discovery

Key Deliverables:
- Functional authentication system
- User profile creation and editing
- Follow/unfollow functionality
- User search and discovery`
  },
  {
    title: 'Sprint 2: Challenge System (Core)',
    description: `Focus: Challenge creation, submission, and leaderboards

Goals:
- Implement challenge creation for sponsors
- Create submission system for users
- Implement challenge leaderboards
- Set up location-based challenge discovery

Key Deliverables:
- Challenge creation interface for sponsors
- Media upload and submission system
- Challenge leaderboards
- Map-based challenge discovery`
  },
  {
    title: 'Sprint 3: LoreCoins Reward System',
    description: `Focus: Earning, tracking, and redeeming LoreCoins

Goals:
- Implement LoreCoin earning mechanisms
- Create transaction history and wallet
- Set up reward redemption system
- Implement daily streaks and engagement rewards

Key Deliverables:
- LoreCoin earning functionality
- Transaction history and balance display
- Reward marketplace
- Streak and engagement tracking`
  },
  {
    title: 'Sprint 4: Content Discovery & Feed',
    description: `Focus: Personalized feed, location-based discovery, and search

Goals:
- Implement personalized content feed
- Create location-based discovery
- Set up search functionality
- Implement trending and popular content

Key Deliverables:
- Personalized feed with real-time updates
- Map-based challenge discovery
- Search functionality for challenges, users, and content
- Trending challenges and popular submissions`
  },
  {
    title: 'Sprint 5: Social Features & Sponsor Tools',
    description: `Focus: Comments, sharing, notifications, and sponsor analytics

Goals:
- Implement commenting system
- Create content sharing functionality
- Set up notification system
- Implement sponsor analytics and campaign management

Key Deliverables:
- Comment functionality for submissions and challenges
- In-app and external sharing
- Notification system with preferences
- Sponsor analytics dashboard and campaign management`
  },
  {
    title: 'Sprint 6: Testing & Launch Prep',
    description: `Focus: Performance optimization, testing, and launch preparation

Goals:
- Optimize application performance
- Implement comprehensive testing
- Create help and support system
- Prepare for public launch

Key Deliverables:
- Performance optimizations for all platforms
- Help center and support system
- Monitoring and analytics dashboard
- Localization and cross-device experience`
  }
];

/**
 * Calculate the due date for a sprint
 * @param {Date} startDate - The start date of the first sprint
 * @param {number} sprintIndex - The index of the sprint (0-based)
 * @param {number} duration - The duration of each sprint in days
 * @returns {string} - ISO 8601 formatted date string
 */
function calculateDueDate(startDate, sprintIndex, duration) {
  const dueDate = new Date(startDate);
  dueDate.setDate(dueDate.getDate() + (duration * (sprintIndex + 1)));
  return dueDate.toISOString();
}

/**
 * Create a milestone in GitHub
 * @param {Object} milestone - The milestone data
 * @param {number} index - The index of the milestone (0-based)
 * @returns {Promise} - Promise resolving to the created milestone
 */
async function createMilestone(milestone, index) {
  try {
    const dueDate = calculateDueDate(config.startDate, index, config.sprintDuration);
    
    console.log(`Creating milestone: ${milestone.title}`);
    console.log(`Due date: ${dueDate}`);
    
    const response = await octokit.issues.createMilestone({
      owner: config.owner,
      repo: config.repo,
      title: milestone.title,
      state: 'open',
      description: milestone.description,
      due_on: dueDate
    });
    
    console.log(`✅ Created milestone: ${milestone.title} (ID: ${response.data.number})`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error creating milestone ${milestone.title}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Create all milestones
 */
async function createAllMilestones() {
  console.log('Starting milestone creation for LorePin project...');
  console.log(`Repository: ${config.owner}/${config.repo}`);
  console.log(`Sprint start date: ${config.startDate.toISOString().split('T')[0]}`);
  console.log(`Sprint duration: ${config.sprintDuration} days`);
  console.log('-------------------------------------------');
  
  try {
    for (let i = 0; i < sprints.length; i++) {
      await createMilestone(sprints[i], i);
    }
    
    console.log('-------------------------------------------');
    console.log('✅ All milestones created successfully!');
  } catch (error) {
    console.error('❌ Failed to create all milestones');
  }
}

// Execute the script
createAllMilestones();