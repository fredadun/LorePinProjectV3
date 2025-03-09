const fs = require('fs');
const path = require('path');

// Configuration for document reorganization
const config = {
  // Mapping of source files to destination files
  fileMapping: [
    // Getting Started
    { src: 'docs/ProjectSetup.md', dest: 'docs-new/01-getting-started/project-setup.md' },
    { src: 'docs/SetupGuide.md', dest: 'docs-new/01-getting-started/setup-guide.md' },
    { src: 'docs/DependencyRequirements.md', dest: 'docs-new/01-getting-started/dependency-requirements.md' },
    
    // Architecture
    { src: 'docs/TechnicalArchitecture.md', dest: 'docs-new/02-architecture/technical-architecture.md' },
    { src: 'docs/MobileArchitecture.md', dest: 'docs-new/02-architecture/mobile-architecture.md' },
    { src: 'docs/LorePinAuthFlow.md', dest: 'docs-new/02-architecture/authentication-flow.md' },
    
    // Development
    { src: 'docs/BranchingWorkflow.md', dest: 'docs-new/03-development/branching-workflow.md' },
    { src: 'docs/GitHubWorkflow.md', dest: 'docs-new/03-development/github-workflow.md' },
    { src: 'docs/LorePinImplementationProcess.md', dest: 'docs-new/03-development/implementation-process.md' },
    
    // User Journeys
    { src: 'docs/LorePinUserJourneyMap.md', dest: 'docs-new/04-user-journeys/user-journey-map.md' },
    { src: 'docs/ApplicationUsageUserJourney.md', dest: 'docs-new/04-user-journeys/application-usage-journey.md' },
    { src: 'docs/LorePinMembershipUserJourney.md', dest: 'docs-new/04-user-journeys/membership-user-journey.md' },
    { src: 'docs/LorePinAuthFlow.md', dest: 'docs-new/04-user-journeys/auth-flow.md' },
    
    // Project Management
    { src: 'docs/AgileFramework.md', dest: 'docs-new/05-project-management/agile-framework.md' },
    { src: 'docs/ProjectManagement/DevelopmentProcessGuide.md', dest: 'docs-new/05-project-management/development-process-guide.md' },
    { src: 'docs/ProjectManagement/SprintPlanningProcess.md', dest: 'docs-new/05-project-management/sprint-planning-process.md' },
    { src: 'docs/ProjectManagement/LabelSystem.md', dest: 'docs-new/05-project-management/label-system.md' },
    { src: 'docs/ProjectManagement/MilestonesSetup.md', dest: 'docs-new/05-project-management/milestones-setup.md' },
    { src: 'docs/ProjectManagement/ProjectBoardSetup.md', dest: 'docs-new/05-project-management/project-board-setup.md' },
    
    // Sprint User Stories
    { src: 'docs/ProjectManagement/UserStories/Sprint1-UserStories.md', dest: 'docs-new/05-project-management/sprints/sprint1-user-stories.md' },
    { src: 'docs/ProjectManagement/UserStories/Sprint2-UserStories.md', dest: 'docs-new/05-project-management/sprints/sprint2-user-stories.md' },
    { src: 'docs/ProjectManagement/UserStories/Sprint3-UserStories.md', dest: 'docs-new/05-project-management/sprints/sprint3-user-stories.md' },
    { src: 'docs/ProjectManagement/UserStories/Sprint4-UserStories.md', dest: 'docs-new/05-project-management/sprints/sprint4-user-stories.md' },
    { src: 'docs/ProjectManagement/UserStories/Sprint5-UserStories.md', dest: 'docs-new/05-project-management/sprints/sprint5-user-stories.md' },
    { src: 'docs/ProjectManagement/UserStories/Sprint6-UserStories.md', dest: 'docs-new/05-project-management/sprints/sprint6-user-stories.md' },
    
    // Deployment
    { src: 'docs/CICDPipelines.md', dest: 'docs-new/06-deployment/cicd-pipelines.md' },
    { src: 'docs/GitHubActionsSetup.md', dest: 'docs-new/06-deployment/github-actions-setup.md' },
    
    // Components
    { src: 'docs/components/authentication.md', dest: 'docs-new/07-components/authentication.md' },
    { src: 'docs/components/README.md', dest: 'docs-new/07-components/overview.md' },
  ],
  
  // Files to merge (source files will be combined into destination file)
  fileMerges: [
    {
      dest: 'docs-new/06-deployment/environment-configuration.md',
      sources: ['docs/MCPServerAutomation.md'],
      title: '# Environment Configuration\n\nThis document describes the environment configuration for the LorePin project.\n\n'
    },
    {
      dest: 'docs-new/07-components/challenges.md',
      sources: [],
      title: '# Challenges Component\n\nThis document describes the Challenges component of the LorePin system.\n\n'
    },
    {
      dest: 'docs-new/07-components/lorecoins.md',
      sources: [],
      title: '# LoreCoins Component\n\nThis document describes the LoreCoins virtual currency component of the LorePin system.\n\n'
    }
  ]
};

// Function to ensure directory exists
function ensureDirectoryExists(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
}

// Function to copy a file
function copyFile(src, dest) {
  try {
    ensureDirectoryExists(dest);
    fs.copyFileSync(src, dest);
    console.log(`Copied: ${src} -> ${dest}`);
    return true;
  } catch (error) {
    console.error(`Error copying ${src} to ${dest}: ${error.message}`);
    return false;
  }
}

// Function to merge files
function mergeFiles(sources, dest, title) {
  try {
    ensureDirectoryExists(dest);
    
    let content = title || '';
    
    for (const src of sources) {
      if (fs.existsSync(src)) {
        const sourceContent = fs.readFileSync(src, 'utf8');
        // Remove the title (first line starting with #) to avoid duplication
        const contentWithoutTitle = sourceContent.replace(/^#[^\n]*\n/, '');
        content += contentWithoutTitle + '\n\n';
        console.log(`Merged content from: ${src}`);
      } else {
        console.warn(`Source file not found: ${src}`);
      }
    }
    
    fs.writeFileSync(dest, content);
    console.log(`Created merged file: ${dest}`);
    return true;
  } catch (error) {
    console.error(`Error merging files to ${dest}: ${error.message}`);
    return false;
  }
}

// Main function to reorganize documentation
function reorganizeDocs() {
  console.log('Starting documentation reorganization...');
  
  // Copy individual files
  for (const mapping of config.fileMapping) {
    if (fs.existsSync(mapping.src)) {
      copyFile(mapping.src, mapping.dest);
    } else {
      console.warn(`Source file not found: ${mapping.src}`);
    }
  }
  
  // Merge files
  for (const merge of config.fileMerges) {
    mergeFiles(merge.sources, merge.dest, merge.title);
  }
  
  console.log('Documentation reorganization completed!');
}

// Execute the reorganization
reorganizeDocs(); 