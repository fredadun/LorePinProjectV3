/**
 * Script to create GitHub project board for LorePin project
 * 
 * This script creates a Kanban-style project board with columns for
 * Backlog, To Do, In Progress, Review, and Done.
 * 
 * Usage:
 * 1. Make sure you have a GITHUB_TOKEN environment variable set
 * 2. Run: node create-project-board.js
 */

require('dotenv').config();
const { Octokit } = require('@octokit/rest');

// Configuration
const config = {
  owner: 'fredadun',
  repo: 'LorePinProjectV3',
  projectName: 'LorePin Development',
  projectDescription: 'Kanban board for tracking LorePin development tasks'
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

// Column definitions
const columns = [
  { name: 'Backlog', position: 1 },
  { name: 'To Do', position: 2 },
  { name: 'In Progress', position: 3 },
  { name: 'Review', position: 4 },
  { name: 'Done', position: 5 }
];

/**
 * Create a project board
 * @returns {Promise} - Promise resolving to the created project
 */
async function createProject() {
  try {
    console.log(`Creating project board: ${config.projectName}`);
    
    const response = await octokit.projects.createForRepo({
      owner: config.owner,
      repo: config.repo,
      name: config.projectName,
      body: config.projectDescription
    });
    
    console.log(`✅ Created project board: ${config.projectName} (ID: ${response.data.id})`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error creating project board:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Create a column in the project board
 * @param {number} projectId - The ID of the project
 * @param {Object} column - The column data
 * @returns {Promise} - Promise resolving to the created column
 */
async function createColumn(projectId, column) {
  try {
    console.log(`Creating column: ${column.name}`);
    
    const response = await octokit.projects.createColumn({
      project_id: projectId,
      name: column.name
    });
    
    console.log(`✅ Created column: ${column.name} (ID: ${response.data.id})`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error creating column ${column.name}:`, error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Create all columns for a project
 * @param {number} projectId - The ID of the project
 * @returns {Promise} - Promise resolving to an array of created columns
 */
async function createAllColumns(projectId) {
  console.log(`Creating columns for project ID: ${projectId}`);
  
  const createdColumns = [];
  
  // Sort columns by position
  const sortedColumns = [...columns].sort((a, b) => a.position - b.position);
  
  for (const column of sortedColumns) {
    const createdColumn = await createColumn(projectId, column);
    createdColumns.push(createdColumn);
  }
  
  return createdColumns;
}

/**
 * Create project board and columns
 */
async function createProjectBoard() {
  console.log('Starting project board creation for LorePin project...');
  console.log(`Repository: ${config.owner}/${config.repo}`);
  console.log('-------------------------------------------');
  
  try {
    // Create project board
    const project = await createProject();
    
    // Create columns
    await createAllColumns(project.id);
    
    console.log('-------------------------------------------');
    console.log('✅ Project board created successfully!');
    console.log(`Project URL: ${project.html_url}`);
  } catch (error) {
    console.error('❌ Failed to create project board');
  }
}

// Execute the script
createProjectBoard();