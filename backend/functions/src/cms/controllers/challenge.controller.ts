import { Request, Response } from 'express';
import { ChallengeService } from '../services/challenge.service';
import { ChallengeStatus, ChallengeDifficulty } from '../models/challenge.entity';

/**
 * Controller for handling challenge operations
 */
export class ChallengeController {
  private challengeService: ChallengeService;

  constructor() {
    this.challengeService = new ChallengeService();
  }

  /**
   * Get all challenges with optional filtering
   */
  public async getChallenges(req: Request, res: Response): Promise<Response> {
    try {
      const status = req.query.status as ChallengeStatus | undefined;
      const difficulty = req.query.difficulty as ChallengeDifficulty | undefined;
      const firebase_uid = req.query.userId as string | undefined;
      const creator_id = req.query.creatorId as string | undefined;
      const sponsor_id = req.query.sponsorId as string | undefined;
      const is_featured = req.query.featured ? req.query.featured === 'true' : undefined;
      const tags = req.query.tags ? (req.query.tags as string).split(',') : undefined;
      const start_date_from = req.query.startDateFrom ? new Date(req.query.startDateFrom as string) : undefined;
      const start_date_to = req.query.startDateTo ? new Date(req.query.startDateTo as string) : undefined;
      const end_date_from = req.query.endDateFrom ? new Date(req.query.endDateFrom as string) : undefined;
      const end_date_to = req.query.endDateTo ? new Date(req.query.endDateTo as string) : undefined;
      const search = req.query.search as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.page ? (parseInt(req.query.page as string) - 1) * limit : 0;

      const result = await this.challengeService.getChallenges({
        status,
        difficulty,
        firebase_uid,
        creator_id,
        sponsor_id,
        is_featured,
        tags,
        start_date_from,
        start_date_to,
        end_date_from,
        end_date_to,
        search,
        limit,
        offset
      });

      return res.status(200).json({
        items: result.items,
        total: result.total,
        page: offset / limit + 1,
        limit,
        pages: Math.ceil(result.total / limit)
      });
    } catch (error: any) {
      console.error('Error getting challenges:', error);
      return res.status(500).json({ message: 'Failed to get challenges', error: error.message });
    }
  }

  /**
   * Get a challenge by ID
   */
  public async getChallengeById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      
      const challenge = await this.challengeService.getChallengeById(id);
      
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }

      return res.status(200).json(challenge);
    } catch (error: any) {
      console.error('Error getting challenge:', error);
      return res.status(500).json({ message: 'Failed to get challenge', error: error.message });
    }
  }

  /**
   * Create a new challenge
   */
  public async createChallenge(req: Request, res: Response): Promise<Response> {
    try {
      const {
        title,
        description,
        difficulty,
        sponsor_id,
        location,
        rules,
        rewards,
        start_date,
        end_date,
        is_private,
        media,
        requirements,
        tags,
        regional_policies
      } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
      }

      // Add user ID from authenticated request
      const firebase_uid = req.user.uid;
      const creator_id = req.dbUser?.id;

      const challenge = await this.challengeService.createChallenge({
        title,
        description,
        difficulty,
        firebase_uid,
        creator_id,
        sponsor_id,
        location,
        rules,
        rewards,
        start_date: start_date ? new Date(start_date) : undefined,
        end_date: end_date ? new Date(end_date) : undefined,
        is_private,
        media,
        requirements,
        tags,
        regional_policies
      });

      return res.status(201).json(challenge);
    } catch (error: any) {
      console.error('Error creating challenge:', error);
      return res.status(500).json({ message: 'Failed to create challenge', error: error.message });
    }
  }

  /**
   * Update a challenge
   */
  public async updateChallenge(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const {
        title,
        description,
        difficulty,
        sponsor_id,
        location,
        rules,
        rewards,
        start_date,
        end_date,
        is_private,
        media,
        requirements,
        tags,
        regional_policies
      } = req.body;
      
      // Get the challenge to check ownership
      const challenge = await this.challengeService.getChallengeById(id);
      
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }
      
      // Check if user is the creator or has admin rights
      const firebase_uid = req.user.uid;
      const isAdmin = req.dbUser?.hasAnyRole(['super_admin', 'content_admin']);
      
      if (challenge.firebase_uid !== firebase_uid && !isAdmin) {
        return res.status(403).json({ message: 'You do not have permission to update this challenge' });
      }
      
      // Check if challenge is in a state that can be updated
      if (challenge.status !== ChallengeStatus.DRAFT && !isAdmin) {
        return res.status(400).json({ message: 'Only challenges in draft status can be updated by non-admins' });
      }

      const updatedChallenge = await this.challengeService.updateChallenge(id, {
        title,
        description,
        difficulty,
        sponsor_id,
        location,
        rules,
        rewards,
        start_date: start_date ? new Date(start_date) : undefined,
        end_date: end_date ? new Date(end_date) : undefined,
        is_private,
        media,
        requirements,
        tags,
        regional_policies
      });

      return res.status(200).json(updatedChallenge);
    } catch (error: any) {
      console.error('Error updating challenge:', error);
      return res.status(500).json({ message: 'Failed to update challenge', error: error.message });
    }
  }

  /**
   * Submit a challenge for approval
   */
  public async submitChallengeForApproval(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const firebase_uid = req.user.uid;
      
      try {
        const challenge = await this.challengeService.submitChallengeForApproval(id, firebase_uid);
        
        if (!challenge) {
          return res.status(404).json({ message: 'Challenge not found' });
        }
        
        return res.status(200).json(challenge);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    } catch (error: any) {
      console.error('Error submitting challenge for approval:', error);
      return res.status(500).json({ message: 'Failed to submit challenge for approval', error: error.message });
    }
  }

  /**
   * Approve a challenge
   */
  public async approveChallenge(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const approver_id = req.dbUser?.id;
      
      if (!approver_id) {
        return res.status(400).json({ message: 'Approver ID is required' });
      }
      
      try {
        const challenge = await this.challengeService.approveChallenge(id, approver_id);
        
        if (!challenge) {
          return res.status(404).json({ message: 'Challenge not found' });
        }
        
        return res.status(200).json(challenge);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    } catch (error: any) {
      console.error('Error approving challenge:', error);
      return res.status(500).json({ message: 'Failed to approve challenge', error: error.message });
    }
  }

  /**
   * Reject a challenge
   */
  public async rejectChallenge(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const { rejection_reason } = req.body;
      
      if (!rejection_reason) {
        return res.status(400).json({ message: 'Rejection reason is required' });
      }
      
      try {
        const challenge = await this.challengeService.rejectChallenge(id, rejection_reason);
        
        if (!challenge) {
          return res.status(404).json({ message: 'Challenge not found' });
        }
        
        return res.status(200).json(challenge);
      } catch (error: any) {
        return res.status(400).json({ message: error.message });
      }
    } catch (error: any) {
      console.error('Error rejecting challenge:', error);
      return res.status(500).json({ message: 'Failed to reject challenge', error: error.message });
    }
  }

  /**
   * Feature a challenge
   */
  public async featureChallenge(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const { is_featured } = req.body;
      
      if (is_featured === undefined) {
        return res.status(400).json({ message: 'is_featured is required' });
      }
      
      const challenge = await this.challengeService.featureChallenge(id, is_featured);
      
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }
      
      return res.status(200).json(challenge);
    } catch (error: any) {
      console.error('Error featuring challenge:', error);
      return res.status(500).json({ message: 'Failed to feature challenge', error: error.message });
    }
  }

  /**
   * Delete a challenge
   */
  public async deleteChallenge(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      
      // Get the challenge to check ownership
      const challenge = await this.challengeService.getChallengeById(id);
      
      if (!challenge) {
        return res.status(404).json({ message: 'Challenge not found' });
      }
      
      // Check if user is the creator or has admin rights
      const firebase_uid = req.user.uid;
      const isAdmin = req.dbUser?.hasAnyRole(['super_admin', 'content_admin']);
      
      if (challenge.firebase_uid !== firebase_uid && !isAdmin) {
        return res.status(403).json({ message: 'You do not have permission to delete this challenge' });
      }
      
      const deleted = await this.challengeService.deleteChallenge(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Challenge not found or could not be deleted' });
      }
      
      return res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting challenge:', error);
      return res.status(500).json({ message: 'Failed to delete challenge', error: error.message });
    }
  }

  /**
   * Get all regional policies
   */
  public async getRegionalPolicies(req: Request, res: Response): Promise<Response> {
    try {
      const region = req.query.region as string | undefined;
      
      const policies = await this.challengeService.getRegionalPolicies(region);
      
      return res.status(200).json(policies);
    } catch (error: any) {
      console.error('Error getting regional policies:', error);
      return res.status(500).json({ message: 'Failed to get regional policies', error: error.message });
    }
  }

  /**
   * Get a regional policy by ID
   */
  public async getRegionalPolicyById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      
      const policy = await this.challengeService.getRegionalPolicyById(id);
      
      if (!policy) {
        return res.status(404).json({ message: 'Regional policy not found' });
      }
      
      return res.status(200).json(policy);
    } catch (error: any) {
      console.error('Error getting regional policy:', error);
      return res.status(500).json({ message: 'Failed to get regional policy', error: error.message });
    }
  }

  /**
   * Create a new regional policy
   */
  public async createRegionalPolicy(req: Request, res: Response): Promise<Response> {
    try {
      const { name, region, description, rules } = req.body;
      
      if (!name || !region || !rules) {
        return res.status(400).json({ message: 'Name, region, and rules are required' });
      }
      
      const created_by = req.dbUser?.id;
      
      const policy = await this.challengeService.createRegionalPolicy({
        name,
        region,
        description,
        rules,
        created_by
      });
      
      return res.status(201).json(policy);
    } catch (error: any) {
      console.error('Error creating regional policy:', error);
      return res.status(500).json({ message: 'Failed to create regional policy', error: error.message });
    }
  }

  /**
   * Update a regional policy
   */
  public async updateRegionalPolicy(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const { name, region, description, rules } = req.body;
      
      const policy = await this.challengeService.updateRegionalPolicy(id, {
        name,
        region,
        description,
        rules
      });
      
      if (!policy) {
        return res.status(404).json({ message: 'Regional policy not found' });
      }
      
      return res.status(200).json(policy);
    } catch (error: any) {
      console.error('Error updating regional policy:', error);
      return res.status(500).json({ message: 'Failed to update regional policy', error: error.message });
    }
  }

  /**
   * Delete a regional policy
   */
  public async deleteRegionalPolicy(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      
      const deleted = await this.challengeService.deleteRegionalPolicy(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Regional policy not found or could not be deleted' });
      }
      
      return res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting regional policy:', error);
      return res.status(500).json({ message: 'Failed to delete regional policy', error: error.message });
    }
  }
} 