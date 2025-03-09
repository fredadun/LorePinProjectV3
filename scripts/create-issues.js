/**
 * Script to create GitHub issues from user stories
 * 
 * This script creates GitHub issues for all user stories and checkpoints
 * defined in the Sprint1-UserStories.md through Sprint6-UserStories.md files.
 * 
 * Usage:
 * 1. Make sure you have a GITHUB_TOKEN environment variable set
 * 2. Run: node create-issues.js
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  userStoriesPath: '../docs/ProjectManagement/UserStories',
  milestonePrefix: 'Sprint ',
  labelPrefix: {
    sprint: 'sprint:',
    priority: 'priority:',
    type: 'type:feature',
    component: 'component:'
  }
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

/**
 * Get all milestones from the repository
 * @returns {Promise<Array>} - Promise resolving to an array of milestones
 */
async function getMilestones() {
  try {
    const response = await octokit.issues.listMilestones({
      owner: config.owner,
      repo: config.repo,
      state: 'open'
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting milestones:', error.message);
    throw error;
  }
}

/**
 * Parse user stories from markdown file
 * @param {string} filePath - Path to the markdown file
 * @returns {Promise<Array>} - Promise resolving to an array of user stories
 */
async function parseUserStories(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Extract sprint number from filename (e.g., Sprint1-UserStories.md -> 1)
    const sprintNumber = path.basename(filePath).match(/Sprint(\d+)/)[1];
    
    // Regular expressions to match user stories and checkpoints
    const userStoryRegex = /### \[(S\d+-US\d+)\] (.*?)\n\n\*\*Description:\*\*([\s\S]*?)(?=\*\*Acceptance Criteria:\*\*)\*\*Acceptance Criteria:\*\*([\s\S]*?)(?=\*\*Tasks:\*\*)\*\*Tasks:\*\*([\s\S]*?)(?=\*\*AI Tasks:\*\*)\*\*AI Tasks:\*\*([\s\S]*?)(?=\*\*Priority:\*\*)\*\*Priority:\*\* (.*?)\n\*\*Effort:\*\* (.*?)\n\*\*Related Documentation:\*\* (.*?)(?=\n\n---|$)/g;
    
    const checkpointRegex = /### \[(S\d+-CP\d+)\] (.*?)\n\n\*\*Description:\*\*([\s\S]*?)(?=\*\*Verification Criteria:\*\*)\*\*Verification Criteria:\*\*([\s\S]*?)(?=\*\*Testing Steps:\*\*)\*\*Testing Steps:\*\*([\s\S]*?)(?=\*\*AI Tasks:\*\*)\*\*AI Tasks:\*\*([\s\S]*?)(?=\*\*Due Date:\*\*)\*\*Due Date:\*\* (.*?)\n\*\*Dependencies:\*\* (.*?)(?=\n\n---|$)/g;
    
    const issues = [];
    
    // Extract user stories
    let match;
    while ((match = userStoryRegex.exec(content)) !== null) {
      const [, id, title, description, acceptanceCriteria, tasks, aiTasks, priority, effort, relatedDocs] = match;
      
      issues.push({
        type: 'user-story',
        id,
        title: `${id} ${title.trim()}`,
        body: formatUserStoryBody(
          description.trim(),
          acceptanceCriteria.trim(),
          tasks.trim(),
          aiTasks.trim(),
          priority.trim(),
          effort.trim(),
          relatedDocs.trim(),
          sprintNumber
        ),
        sprint: sprintNumber,
        priority: priority.toLowerCase()
      });
    }
    
    // Extract checkpoints
    while ((match = checkpointRegex.exec(content)) !== null) {
      const [, id, title, description, verificationCriteria, testingSteps, aiTasks, dueDate, dependencies] = match;
      
      issues.push({
        type: 'checkpoint',
        id,
        title: `${id} ${title.trim()}`,
        body: formatCheckpointBody(
          description.trim(),
          verificationCriteria.trim(),
          testingSteps.trim(),
          aiTasks.trim(),
          dueDate.trim(),
          dependencies.trim(),
          sprintNumber
        ),
        sprint: sprintNumber,
        priority: 'high' // Checkpoints are always high priority
      });
    }
    
    return issues;
  } catch (error) {
    console.error(`Error parsing user stories from ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Format the body of a user story issue
 * @param {string} description - Description of the user story
 * @param {string} acceptanceCriteria - Acceptance criteria
 * @param {string} tasks - Tasks
 * @param {string} aiTasks - AI tasks
 * @param {string} priority - Priority
 * @param {string} effort - Effort
 * @param {string} relatedDocs - Related documentation
 * @param {string} sprintNumber - Sprint number
 * @returns {string} - Formatted issue body
 */
function formatUserStoryBody(description, acceptanceCriteria, tasks, aiTasks, priority, effort, relatedDocs, sprintNumber) {
  return `## Description
${description}

## Acceptance Criteria
${acceptanceCriteria}

## Tasks
${tasks}

## AI Tasks
${aiTasks}

## Metadata
- **Priority:** ${priority}
- **Effort:** ${effort}
- **Sprint:** ${sprintNumber}
- **Related Documentation:** ${relatedDocs}

---
*This issue was automatically generated from the user stories documentation.*`;
}

/**
 * Format the body of a checkpoint issue
 * @param {string} description - Description of the checkpoint
 * @param {string} verificationCriteria - Verification criteria
 * @param {string} testingSteps - Testing steps
 * @param {string} aiTasks - AI tasks
 * @param {string} dueDate - Due date
 * @param {string} dependencies - Dependencies
 * @param {string} sprintNumber - Sprint number
 * @returns {string} - Formatted issue body
 */
function formatCheckpointBody(description, verificationCriteria, testingSteps, aiTasks, dueDate, dependencies, sprintNumber) {
  return `## Description
${description}

## Verification Criteria
${verificationCriteria}

## Testing Steps
${testingSteps}

## AI Tasks
${aiTasks}

## Metadata
- **Due Date:** ${dueDate}
- **Sprint:** ${sprintNumber}
- **Dependencies:** ${dependencies}

---
*This issue was automatically generated from the user stories documentation.*`;
}

/**
 * Create a GitHub issue
 * @param {Object} issue - The issue data
 * @param {Object} milestone - The milestone to associate with the issue
 * @returns {Promise} - Promise resolving to the created issue
 */
async function createIssue(issue, milestone) {
  try {
    console.log(`Creating issue: ${issue.title}`);
    
    // Prepare labels
    const labels = [
      `${config.labelPrefix.sprint}${issue.sprint}`,
      `${config.labelPrefix.priority}${issue.priority}`,
      config.labelPrefix.type
    ];
    
    // Add component label if it can be determined
    if (issue.title.toLowerCase().includes('auth')) {
      labels.push(`${config.labelPrefix.component}auth`);
    } else if (issue.title.toLowerCase().includes('profile')) {
      labels.push(`${config.labelPrefix.component}frontend`);
    } else if (issue.title.toLowerCase().includes('challenge')) {
      labels.push(`${config.labelPrefix.component}challenges`);
    } else if (issue.title.toLowerCase().includes('lorecoins')) {
      labels.push(`${config.labelPrefix.component}lorecoins`);
    } else if (issue.title.toLowerCase().includes('map')) {
      labels.push(`${config.labelPrefix.component}map`);
    }
    
    const response = await octokit.issues.create({
      owner: config.owner,
      repo: config.repo,
      title: issue.title,
      body: issue.body,
      milestone: milestone ? milestone.number : undefined,
      labels: labels
    });
    
    console.log(`✅ Created issue: ${issue.title} (#${response.data.number})`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error creating issue ${issue.title}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Create all issues from user stories
 */
async function createAllIssues() {
  console.log('Starting issue creation for LorePin project...');
  console.log(`Repository: ${config.owner}/${config.repo}`);
  console.log('-------------------------------------------');
  
  try {
    // Get all milestones
    const milestones = await getMilestones();
    console.log(`Found ${milestones.length} milestones`);
    
    // Get all user story files
    const userStoryFiles = [];
    for (let i = 1; i <= 6; i++) {
      userStoryFiles.push(path.join(__dirname, config.userStoriesPath, `Sprint${i}-UserStories.md`));
    }
    
    // Process each file
    for (const filePath of userStoryFiles) {
      try {
        console.log(`Processing file: ${path.basename(filePath)}`);
        
        // Parse user stories from file
        const issues = await parseUserStories(filePath);
        console.log(`Found ${issues.length} issues in ${path.basename(filePath)}`);
        
        // Get the corresponding milestone
        const sprintNumber = path.basename(filePath).match(/Sprint(\d+)/)[1];
        const milestone = milestones.find(m => m.title.includes(`Sprint ${sprintNumber}:`));
        
        if (!milestone) {
          console.warn(`⚠️ Milestone for Sprint ${sprintNumber} not found. Issues will be created without a milestone.`);
        }
        
        // Create issues
        for (const issue of issues) {
          await createIssue(issue, milestone);
        }
        
        console.log(`✅ Processed ${path.basename(filePath)}`);
      } catch (error) {
        console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
      }
    }
    
    console.log('-------------------------------------------');
    console.log('✅ All issues created successfully!');
  } catch (error) {
    console.error('❌ Failed to create all issues');
  }
}

// Execute the script
createAllIssues();