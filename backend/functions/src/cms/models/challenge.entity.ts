import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

/**
 * Challenge status enum
 */
export enum ChallengeStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

/**
 * Challenge difficulty enum
 */
export enum ChallengeDifficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

/**
 * Challenge entity
 */
@Entity('challenges')
export class Challenge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ 
    type: 'simple-enum', 
    enum: ChallengeStatus, 
    default: ChallengeStatus.DRAFT 
  })
  status: ChallengeStatus;

  @Column({ 
    type: 'simple-enum', 
    enum: ChallengeDifficulty, 
    default: ChallengeDifficulty.BEGINNER 
  })
  difficulty: ChallengeDifficulty;

  @Column({ nullable: true })
  firebase_uid: string;

  @Column({ nullable: true })
  creator_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @Column({ nullable: true })
  sponsor_id: string;

  @Column({ type: 'simple-json', nullable: true })
  location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  rules: any;

  @Column({ type: 'simple-json', nullable: true })
  rewards: {
    lore_coins: number;
    experience_points: number;
    badges: string[];
    other_rewards: any;
  };

  @Column({ nullable: true })
  start_date: Date;

  @Column({ nullable: true })
  end_date: Date;

  @Column({ default: false })
  is_featured: boolean;

  @Column({ default: false })
  is_private: boolean;

  @Column({ type: 'simple-json', nullable: true })
  media: {
    cover_image: string;
    gallery: string[];
    video_url: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  requirements: string[];

  @Column({ type: 'simple-json', nullable: true })
  tags: string[];

  @Column({ type: 'simple-json', nullable: true })
  regional_policies: {
    region: string;
    policy_id: string;
    restrictions: string[];
  }[];

  @Column({ nullable: true })
  approved_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by' })
  approver: User;

  @Column({ nullable: true })
  approved_at: Date;

  @Column({ nullable: true })
  rejection_reason: string;

  @Column({ type: 'integer', default: 0 })
  submission_count: number;

  @Column({ type: 'integer', default: 0 })
  view_count: number;

  @Column({ type: 'integer', default: 0 })
  participant_count: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 