import { getConnection } from '../utils/database.config';
import { Challenge, ChallengeStatus, ChallengeDifficulty } from '../models/challenge.entity';
import { RegionalPolicy } from '../models/regional-policy.entity';
import { ModerationService } from './moderation.service';
import { ContentType } from '../models/moderation-queue.entity';

/**
 * Service for challenge management
 */
export class ChallengeService {
  private moderationService: ModerationService;

  constructor() {
    this.moderationService = new ModerationService();
  }

  /**
   * Create a new challenge
   * @param data The challenge data
   * @returns The created challenge
   */
  async createChallenge(data: {
    title: string;
    description: string;
    difficulty?: ChallengeDifficulty;
    firebase_uid: string;
    creator_id?: string;
    sponsor_id?: string;
    location?: any;
    rules?: any;
    rewards?: any;
    start_date?: Date;
    end_date?: Date;
    is_private?: boolean;
    media?: any;
    requirements?: string[];
    tags?: string[];
    regional_policies?: any[];
  }): Promise<Challenge> {
    const connection = await getConnection();
    const repository = connection.getRepository(Challenge);
    
    // Create new challenge
    const challenge = repository.create({
      title: data.title,
      description: data.description,
      difficulty: data.difficulty || ChallengeDifficulty.BEGINNER,
      status: ChallengeStatus.DRAFT,
      firebase_uid: data.firebase_uid,
      creator_id: data.creator_id,
      sponsor_id: data.sponsor_id,
      location: data.location,
      rules: data.rules,
      rewards: data.rewards,
      start_date: data.start_date,
      end_date: data.end_date,
      is_private: data.is_private || false,
      media: data.media,
      requirements: data.requirements,
      tags: data.tags,
      regional_policies: data.regional_policies
    });
    
    // Save challenge
    const savedChallenge = await repository.save(challenge);
    
    return savedChallenge;
  }

  /**
   * Get all challenges with optional filtering
   * @param filters Optional filters
   * @returns The challenges and total count
   */
  async getChallenges(filters?: {
    status?: ChallengeStatus;
    difficulty?: ChallengeDifficulty;
    firebase_uid?: string;
    creator_id?: string;
    sponsor_id?: string;
    is_featured?: boolean;
    tags?: string[];
    start_date_from?: Date;
    start_date_to?: Date;
    end_date_from?: Date;
    end_date_to?: Date;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: Challenge[]; total: number }> {
    const connection = await getConnection();
    const repository = connection.getRepository(Challenge);
    
    // Build query
    let query = repository.createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.creator', 'creator')
      .leftJoinAndSelect('challenge.approver', 'approver');
    
    // Apply filters
    if (filters) {
      if (filters.status) {
        query = query.andWhere('challenge.status = :status', { status: filters.status });
      }
      
      if (filters.difficulty) {
        query = query.andWhere('challenge.difficulty = :difficulty', { difficulty: filters.difficulty });
      }
      
      if (filters.firebase_uid) {
        query = query.andWhere('challenge.firebase_uid = :firebase_uid', { firebase_uid: filters.firebase_uid });
      }
      
      if (filters.creator_id) {
        query = query.andWhere('challenge.creator_id = :creator_id', { creator_id: filters.creator_id });
      }
      
      if (filters.sponsor_id) {
        query = query.andWhere('challenge.sponsor_id = :sponsor_id', { sponsor_id: filters.sponsor_id });
      }
      
      if (filters.is_featured !== undefined) {
        query = query.andWhere('challenge.is_featured = :is_featured', { is_featured: filters.is_featured });
      }
      
      if (filters.tags && filters.tags.length > 0) {
        query = query.andWhere('challenge.tags @> :tags', { tags: JSON.stringify(filters.tags) });
      }
      
      if (filters.start_date_from) {
        query = query.andWhere('challenge.start_date >= :start_date_from', { start_date_from: filters.start_date_from });
      }
      
      if (filters.start_date_to) {
        query = query.andWhere('challenge.start_date <= :start_date_to', { start_date_to: filters.start_date_to });
      }
      
      if (filters.end_date_from) {
        query = query.andWhere('challenge.end_date >= :end_date_from', { end_date_from: filters.end_date_from });
      }
      
      if (filters.end_date_to) {
        query = query.andWhere('challenge.end_date <= :end_date_to', { end_date_to: filters.end_date_to });
      }
      
      if (filters.search) {
        query = query.andWhere('(challenge.title ILIKE :search OR challenge.description ILIKE :search)', { search: `%${filters.search}%` });
      }
    }
    
    // Get total count
    const total = await query.getCount();
    
    // Apply pagination
    if (filters?.limit) {
      query = query.limit(filters.limit);
      
      if (filters.offset) {
        query = query.offset(filters.offset);
      }
    }
    
    // Order by created_at
    query = query.orderBy('challenge.created_at', 'DESC');
    
    // Get challenges
    const items = await query.getMany();
    
    return { items, total };
  }

  /**
   * Get a challenge by ID
   * @param id The challenge ID
   * @returns The challenge or null if not found
   */
  async getChallengeById(id: string): Promise<Challenge | null> {
    const connection = await getConnection();
    const repository = connection.getRepository(Challenge);
    
    return repository.findOne({
      where: { id },
      relations: ['creator', 'approver']
    });
  }

  /**
   * Update a challenge
   * @param id The challenge ID
   * @param data The challenge data to update
   * @returns The updated challenge
   */
  async updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge | null> {
    const connection = await getConnection();
    const repository = connection.getRepository(Challenge);
    
    // Get challenge
    const challenge = await repository.findOne({ where: { id } });
    
    if (!challenge) {
      return null;
    }
    
    // Update challenge
    repository.merge(challenge, data);
    
    // Save challenge
    return repository.save(challenge);
  }

  /**
   * Submit a challenge for approval
   * @param id The challenge ID
   * @param firebase_uid The user ID submitting the challenge
   * @returns The updated challenge
   */
  async submitChallengeForApproval(id: string, firebase_uid: string): Promise<Challenge | null> {
    const connection = await getConnection();
    const repository = connection.getRepository(Challenge);
    
    // Get challenge
    const challenge = await repository.findOne({ where: { id } });
    
    if (!challenge) {
      return null;
    }
    
    // Check if user is the creator
    if (challenge.firebase_uid !== firebase_uid) {
      throw new Error('Only the creator can submit a challenge for approval');
    }
    
    // Check if challenge is in draft status
    if (challenge.status !== ChallengeStatus.DRAFT) {
      throw new Error('Only challenges in draft status can be submitted for approval');
    }
    
    // Update challenge status
    challenge.status = ChallengeStatus.PENDING_APPROVAL;
    
    // Save challenge
    const updatedChallenge = await repository.save(challenge);
    
    // Add to moderation queue
    await this.moderationService.addToQueue({
      content_type: ContentType.CHALLENGE,
      content_id: challenge.id,
      firebase_uid,
      content_data: {
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        location: challenge.location,
        rules: challenge.rules,
        rewards: challenge.rewards,
        start_date: challenge.start_date,
        end_date: challenge.end_date,
        media: challenge.media,
        requirements: challenge.requirements,
        tags: challenge.tags,
        regional_policies: challenge.regional_policies
      }
    });
    
    return updatedChallenge;
  }

  /**
   * Approve a challenge
   * @param id The challenge ID
   * @param approver_id The approver ID
   * @returns The updated challenge
   */
  async approveChallenge(id: string, approver_id: string): Promise<Challenge | null> {
    const connection = await getConnection();
    const repository = connection.getRepository(Challenge);
    
    // Get challenge
    const challenge = await repository.findOne({ where: { id } });
    
    if (!challenge) {
      return null;
    }
    
    // Check if challenge is pending approval
    if (challenge.status !== ChallengeStatus.PENDING_APPROVAL) {
      throw new Error('Only challenges pending approval can be approved');
    }
    
    // Update challenge
    challenge.status = ChallengeStatus.APPROVED;
    challenge.approved_by = approver_id;
    challenge.approved_at = new Date();
    
    // If start date is in the past or not set, set status to active
    if (!challenge.start_date || challenge.start_date <= new Date()) {
      challenge.status = ChallengeStatus.ACTIVE;
    }
    
    // Save challenge
    return repository.save(challenge);
  }

  /**
   * Reject a challenge
   * @param id The challenge ID
   * @param rejection_reason The reason for rejection
   * @returns The updated challenge
   */
  async rejectChallenge(id: string, rejection_reason: string): Promise<Challenge | null> {
    const connection = await getConnection();
    const repository = connection.getRepository(Challenge);
    
    // Get challenge
    const challenge = await repository.findOne({ where: { id } });
    
    if (!challenge) {
      return null;
    }
    
    // Check if challenge is pending approval
    if (challenge.status !== ChallengeStatus.PENDING_APPROVAL) {
      throw new Error('Only challenges pending approval can be rejected');
    }
    
    // Update challenge
    challenge.status = ChallengeStatus.REJECTED;
    challenge.rejection_reason = rejection_reason;
    
    // Save challenge
    return repository.save(challenge);
  }

  /**
   * Feature a challenge
   * @param id The challenge ID
   * @param is_featured Whether to feature the challenge
   * @returns The updated challenge
   */
  async featureChallenge(id: string, is_featured: boolean): Promise<Challenge | null> {
    const connection = await getConnection();
    const repository = connection.getRepository(Challenge);
    
    // Get challenge
    const challenge = await repository.findOne({ where: { id } });
    
    if (!challenge) {
      return null;
    }
    
    // Update challenge
    challenge.is_featured = is_featured;
    
    // Save challenge
    return repository.save(challenge);
  }

  /**
   * Delete a challenge
   * @param id The challenge ID
   * @returns Whether the challenge was deleted
   */
  async deleteChallenge(id: string): Promise<boolean> {
    const connection = await getConnection();
    const repository = connection.getRepository(Challenge);
    
    // Delete challenge
    const result = await repository.delete(id);
    
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }

  /**
   * Create a regional policy
   * @param data The regional policy data
   * @returns The created regional policy
   */
  async createRegionalPolicy(data: {
    name: string;
    region: string;
    description?: string;
    rules: any;
    created_by?: string;
  }): Promise<RegionalPolicy> {
    const connection = await getConnection();
    const repository = connection.getRepository(RegionalPolicy);
    
    // Create new regional policy
    const policy = repository.create({
      name: data.name,
      region: data.region,
      description: data.description,
      rules: data.rules,
      created_by: data.created_by
    });
    
    // Save regional policy
    return repository.save(policy);
  }

  /**
   * Get all regional policies
   * @param region Optional region filter
   * @returns The regional policies
   */
  async getRegionalPolicies(region?: string): Promise<RegionalPolicy[]> {
    const connection = await getConnection();
    const repository = connection.getRepository(RegionalPolicy);
    
    // Build query
    let query = repository.createQueryBuilder('policy')
      .leftJoinAndSelect('policy.creator', 'creator');
    
    // Apply region filter
    if (region) {
      query = query.where('policy.region = :region', { region });
    }
    
    // Order by name
    query = query.orderBy('policy.name', 'ASC');
    
    // Get policies
    return query.getMany();
  }

  /**
   * Get a regional policy by ID
   * @param id The regional policy ID
   * @returns The regional policy or null if not found
   */
  async getRegionalPolicyById(id: string): Promise<RegionalPolicy | null> {
    const connection = await getConnection();
    const repository = connection.getRepository(RegionalPolicy);
    
    return repository.findOne({
      where: { id },
      relations: ['creator']
    });
  }

  /**
   * Update a regional policy
   * @param id The regional policy ID
   * @param data The regional policy data to update
   * @returns The updated regional policy
   */
  async updateRegionalPolicy(id: string, data: Partial<RegionalPolicy>): Promise<RegionalPolicy | null> {
    const connection = await getConnection();
    const repository = connection.getRepository(RegionalPolicy);
    
    // Get regional policy
    const policy = await repository.findOne({ where: { id } });
    
    if (!policy) {
      return null;
    }
    
    // Update regional policy
    repository.merge(policy, data);
    
    // Save regional policy
    return repository.save(policy);
  }

  /**
   * Delete a regional policy
   * @param id The regional policy ID
   * @returns Whether the regional policy was deleted
   */
  async deleteRegionalPolicy(id: string): Promise<boolean> {
    const connection = await getConnection();
    const repository = connection.getRepository(RegionalPolicy);
    
    // Delete regional policy
    const result = await repository.delete(id);
    
    return result.affected !== null && result.affected !== undefined && result.affected > 0;
  }
} 