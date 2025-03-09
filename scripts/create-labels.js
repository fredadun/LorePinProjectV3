/**
 * Script to create GitHub labels for LorePin project
 * 
 * This script creates all the labels defined in the LabelSystem.md document,
 * organized by category (priority, type, component, status, sprint).
 * 
 * Usage:
 * 1. Make sure you have a GITHUB_TOKEN environment variable set
 * 2. Run: node create-labels.js
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3'
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

// Label definitions based on LabelSystem.md
const labels = [
  // Priority Labels
  { name: 'priority:high', color: 'FF0000', description: 'Critical issues that must be addressed immediately' },
  { name: 'priority:medium', color: 'FFA500', description: 'Important issues that should be addressed soon' },
  { name: 'priority:low', color: 'FFFF00', description: 'Issues that can be addressed when time permits' },
  
  // Type Labels
  { name: 'type:feature', color: '0075CA', description: 'New functionality or enhancements' },
  { name: 'type:bug', color: 'D73A4A', description: 'Something isn\'t working as expected' },
  { name: 'type:documentation', color: '0075CA', description: 'Improvements or additions to documentation' },
  { name: 'type:refactor', color: 'A2EEEF', description: 'Code changes that neither fix a bug nor add a feature' },
  { name: 'type:test', color: 'BFDADC', description: 'Adding or modifying tests' },
  { name: 'type:design', color: 'CC99FF', description: 'UI/UX design work' },
  { name: 'type:security', color: 'D93F0B', description: 'Security-related issues' },
  { name: 'type:performance', color: '0E8A16', description: 'Performance improvements' },
  
  // Component Labels
  { name: 'component:frontend', color: '1D76DB', description: 'Related to the web frontend' },
  { name: 'component:backend', color: '0E8A16', description: 'Related to the Firebase backend' },
  { name: 'component:mobile', color: '5319E7', description: 'Related to the Flutter mobile app' },
  { name: 'component:auth', color: 'FEF2C0', description: 'Authentication-related' },
  { name: 'component:challenges', color: 'FBCA04', description: 'Challenge system-related' },
  { name: 'component:lorecoins', color: 'C5DEF5', description: 'LoreCoins system-related' },
  { name: 'component:map', color: 'BFD4F2', description: 'Map and location features' },
  { name: 'component:media', color: 'D4C5F9', description: 'Media handling (photos/videos)' },
  
  // Status Labels
  { name: 'status:blocked', color: 'D93F0B', description: 'Blocked by another issue or external factor' },
  { name: 'status:in-progress', color: '0E8A16', description: 'Currently being worked on' },
  { name: 'status:review', color: 'FBCA04', description: 'Ready for review' },
  { name: 'status:ready', color: '0075CA', description: 'Ready to be worked on' },
  { name: 'status:wontfix', color: 'E4E669', description: 'This will not be worked on' },
  { name: 'status:duplicate', color: 'CFD3D7', description: 'This issue already exists' },
  
  // Sprint Labels
  { name: 'sprint:1', color: 'C2E0C6', description: 'Sprint 1: User Onboarding & Profiles' },
  { name: 'sprint:2', color: 'C2E0C6', description: 'Sprint 2: Challenge System (Core)' },
  { name: 'sprint:3', color: 'C2E0C6', description: 'Sprint 3: LoreCoins Reward System' },
  { name: 'sprint:4', color: 'C2E0C6', description: 'Sprint 4: Content Discovery & Feed' },
  { name: 'sprint:5', color: 'C2E0C6', description: 'Sprint 5: Social Features & Sponsor Tools' },
  { name: 'sprint:6', color: 'C2E0C6', description: 'Sprint 6: Testing & Launch Prep' }
];

/**
 * Create or update a label in GitHub
 * @param {Object} label - The label data
 * @returns {Promise} - Promise resolving to the created/updated label
 */
async function createOrUpdateLabel(label) {
  try {
    // Check if label exists
    try {
      await octokit.issues.getLabel({
        owner: config.owner,
        repo: config.repo,
        name: label.name
      });
      
      // Label exists, update it
      console.log(`Updating label: ${label.name}`);
      const response = await octokit.issues.updateLabel({
        owner: config.owner,
        repo: config.repo,
        name: label.name,
        color: label.color,
        description: label.description
      });
      
      console.log(`✅ Updated label: ${label.name}`);
      return response.data;
    } catch (error) {
      if (error.status === 404) {
        // Label doesn't exist, create it
        console.log(`Creating label: ${label.name}`);
        const response = await octokit.issues.createLabel({
          owner: config.owner,
          repo: config.repo,
          name: label.name,
          color: label.color,
          description: label.description
        });
        
        console.log(`✅ Created label: ${label.name}`);
        return response.data;
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error(`❌ Error with label ${label.name}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Create all labels
 */
async function createAllLabels() {
  console.log('Starting label creation for LorePin project...');
  console.log(`Repository: ${config.owner}/${config.repo}`);
  console.log(`Total labels to create/update: ${labels.length}`);
  console.log('-------------------------------------------');
  
  try {
    // Process labels by category
    console.log('Creating Priority labels...');
    for (const label of labels.filter(l => l.name.startsWith('priority:'))) {
      await createOrUpdateLabel(label);
    }
    
    console.log('\nCreating Type labels...');
    for (const label of labels.filter(l => l.name.startsWith('type:'))) {
      await createOrUpdateLabel(label);
    }
    
    console.log('\nCreating Component labels...');
    for (const label of labels.filter(l => l.name.startsWith('component:'))) {
      await createOrUpdateLabel(label);
    }
    
    console.log('\nCreating Status labels...');
    for (const label of labels.filter(l => l.name.startsWith('status:'))) {
      await createOrUpdateLabel(label);
    }
    
    console.log('\nCreating Sprint labels...');
    for (const label of labels.filter(l => l.name.startsWith('sprint:'))) {
      await createOrUpdateLabel(label);
    }
    
    console.log('-------------------------------------------');
    console.log('✅ All labels created/updated successfully!');
  } catch (error) {
    console.error('❌ Failed to create/update all labels');
  }
}

// Execute the script
createAllLabels();