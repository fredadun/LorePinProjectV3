import { Request, Response } from 'express';
import { ModerationService } from '../services/moderation.service';
import { ContentType, ModerationStatus } from '../models/moderation-queue.entity';

/**
 * Controller for handling moderation queue operations
 */
export class ModerationController {
  private moderationService: ModerationService;

  constructor() {
    this.moderationService = new ModerationService();
  }

  /**
   * Get all items in the moderation queue with optional filtering
   */
  public async getQueue(req: Request, res: Response): Promise<Response> {
    try {
      const status = req.query.status as ModerationStatus | undefined;
      const content_type = req.query.contentType as ContentType | undefined;
      const firebase_uid = req.query.userId as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.page ? (parseInt(req.query.page as string) - 1) * limit : 0;

      const result = await this.moderationService.getQueue({
        status,
        content_type,
        firebase_uid,
        limit,
        offset
      });

      return res.status(200).json(result);
    } catch (error: any) {
      console.error('Error getting moderation queue:', error);
      return res.status(500).json({ message: 'Failed to get moderation queue', error: error.message });
    }
  }

  /**
   * Get a specific item from the moderation queue by ID
   */
  public async getQueueItemById(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      
      const queueItem = await this.moderationService.getQueueItemById(id);
      
      if (!queueItem) {
        return res.status(404).json({ message: 'Moderation queue item not found' });
      }

      return res.status(200).json(queueItem);
    } catch (error: any) {
      console.error('Error getting moderation queue item:', error);
      return res.status(500).json({ message: 'Failed to get moderation queue item', error: error.message });
    }
  }

  /**
   * Add a new item to the moderation queue
   */
  public async addToQueue(req: Request, res: Response): Promise<Response> {
    try {
      const { contentType, contentId, contentData, mediaUrl } = req.body;
      
      if (!contentType || !contentId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Add user ID from authenticated request
      const firebase_uid = req.user.uid;

      const newQueueItem = await this.moderationService.addToQueue({
        content_type: contentType as ContentType,
        content_id: contentId,
        firebase_uid,
        content_data: contentData,
        media_url: mediaUrl
      });

      return res.status(201).json(newQueueItem);
    } catch (error: any) {
      console.error('Error adding to moderation queue:', error);
      return res.status(500).json({ message: 'Failed to add to moderation queue', error: error.message });
    }
  }

  /**
   * Update the status of a moderation queue item
   */
  public async updateQueueItemStatus(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      const { status, rejectionReason, notes } = req.body;
      
      if (!status || !Object.values(ModerationStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      // Add moderator ID from authenticated request
      const moderatorId = req.user.uid;

      const updatedItem = await this.moderationService.updateQueueItemStatus(
        id,
        {
          status,
          rejection_reason: rejectionReason,
          notes
        },
        moderatorId
      );
      
      if (!updatedItem) {
        return res.status(404).json({ message: 'Moderation queue item not found' });
      }

      return res.status(200).json(updatedItem);
    } catch (error: any) {
      console.error('Error updating moderation queue item status:', error);
      return res.status(500).json({ message: 'Failed to update moderation queue item status', error: error.message });
    }
  }

  /**
   * Get moderation statistics
   * This is a placeholder method that will be implemented in the future
   */
  public async getModerationStats(req: Request, res: Response): Promise<Response> {
    try {
      const timeframe = req.query.timeframe as string || '7d'; // Default to last 7 days
      
      // Placeholder for future implementation
      const stats = {
        pending: 0,
        approved: 0,
        rejected: 0,
        flagged: 0,
        averageProcessingTime: 0,
        timeframe
      };
      
      return res.status(200).json(stats);
    } catch (error: any) {
      console.error('Error getting moderation stats:', error);
      return res.status(500).json({ message: 'Failed to get moderation stats', error: error.message });
    }
  }

  /**
   * Update video analysis for a queue item
   */
  public async updateVideoAnalysis(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      
      const updatedItem = await this.moderationService.updateVideoAnalysis(id);
      
      if (!updatedItem) {
        return res.status(404).json({ message: 'Moderation queue item not found or has no video analysis' });
      }
      
      return res.status(200).json(updatedItem);
    } catch (error: any) {
      console.error('Error updating video analysis:', error);
      return res.status(500).json({ message: 'Failed to update video analysis', error: error.message });
    }
  }
}
