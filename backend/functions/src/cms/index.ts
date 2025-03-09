import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { Request, Response, NextFunction } from 'express';
import { initializeDatabase } from './utils/database.config';
import { verifyToken, isSuperAdmin, isContentAdmin } from './middleware/auth.middleware';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { ModerationController } from './controllers/moderation.controller';
import { ChallengeController } from './controllers/challenge.controller';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Initialize Express app
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Initialize controllers
const userController = new UserController();
const roleController = new RoleController();
const moderationController = new ModerationController();
const challengeController = new ChallengeController();

// Initialize database
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ message: 'Database initialization error' });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User routes
app.get('/users', verifyToken, isSuperAdmin, userController.getUsers.bind(userController));
app.get('/users/:id', verifyToken, isContentAdmin, userController.getUserById.bind(userController));
app.put('/users/:id', verifyToken, isSuperAdmin, userController.updateUser.bind(userController));
app.post('/users/:id/roles', verifyToken, isSuperAdmin, userController.assignRoles.bind(userController));
app.get('/me', verifyToken, userController.getCurrentUser.bind(userController));

// Role routes
app.get('/roles', verifyToken, isContentAdmin, roleController.getAllRoles.bind(roleController));
app.get('/roles/:id', verifyToken, isContentAdmin, roleController.getRoleById.bind(roleController));
app.post('/roles', verifyToken, isSuperAdmin, roleController.createRole.bind(roleController));
app.put('/roles/:id', verifyToken, isSuperAdmin, roleController.updateRole.bind(roleController));
app.delete('/roles/:id', verifyToken, isSuperAdmin, roleController.deleteRole.bind(roleController));
app.post('/roles/:id/permissions', verifyToken, isSuperAdmin, roleController.assignPermissions.bind(roleController));

// Permission routes
app.get('/permissions', verifyToken, isContentAdmin, roleController.getAllPermissions.bind(roleController));
app.post('/permissions', verifyToken, isSuperAdmin, roleController.createPermission.bind(roleController));

// Moderation routes
app.get('/moderation/queue', verifyToken, isContentAdmin, moderationController.getQueue.bind(moderationController));
app.get('/moderation/queue/:id', verifyToken, isContentAdmin, moderationController.getQueueItemById.bind(moderationController));
app.post('/moderation/queue', verifyToken, moderationController.addToQueue.bind(moderationController));
app.put('/moderation/queue/:id/status', verifyToken, isContentAdmin, moderationController.updateQueueItemStatus.bind(moderationController));
app.get('/moderation/stats', verifyToken, isContentAdmin, moderationController.getModerationStats.bind(moderationController));
app.post('/moderation/queue/:id/update-video-analysis', verifyToken, isContentAdmin, moderationController.updateVideoAnalysis.bind(moderationController));

// Challenge routes
app.get('/challenges', verifyToken, challengeController.getChallenges.bind(challengeController));
app.get('/challenges/:id', verifyToken, challengeController.getChallengeById.bind(challengeController));
app.post('/challenges', verifyToken, challengeController.createChallenge.bind(challengeController));
app.put('/challenges/:id', verifyToken, challengeController.updateChallenge.bind(challengeController));
app.delete('/challenges/:id', verifyToken, challengeController.deleteChallenge.bind(challengeController));
app.post('/challenges/:id/submit', verifyToken, challengeController.submitChallengeForApproval.bind(challengeController));
app.post('/challenges/:id/approve', verifyToken, isContentAdmin, challengeController.approveChallenge.bind(challengeController));
app.post('/challenges/:id/reject', verifyToken, isContentAdmin, challengeController.rejectChallenge.bind(challengeController));
app.post('/challenges/:id/feature', verifyToken, isContentAdmin, challengeController.featureChallenge.bind(challengeController));

// Regional policy routes
app.get('/regional-policies', verifyToken, isContentAdmin, challengeController.getRegionalPolicies.bind(challengeController));
app.get('/regional-policies/:id', verifyToken, isContentAdmin, challengeController.getRegionalPolicyById.bind(challengeController));
app.post('/regional-policies', verifyToken, isContentAdmin, challengeController.createRegionalPolicy.bind(challengeController));
app.put('/regional-policies/:id', verifyToken, isContentAdmin, challengeController.updateRegionalPolicy.bind(challengeController));
app.delete('/regional-policies/:id', verifyToken, isContentAdmin, challengeController.deleteRegionalPolicy.bind(challengeController));

// Export the Express app as a Firebase Function
export const cms = functions.region('europe-west2').https.onRequest(app); 