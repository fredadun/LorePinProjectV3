import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

/**
 * Moderation status enum
 */
export enum ModerationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FLAGGED = 'flagged'
}

/**
 * Content type enum
 */
export enum ContentType {
  CHALLENGE = 'challenge',
  SUBMISSION = 'submission',
  USER_PROFILE = 'user_profile',
  COMMENT = 'comment'
}

/**
 * Moderation queue entity
 */
@Entity('moderation_queue')
export class ModerationQueueItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ContentType })
  content_type: ContentType;

  @Column()
  content_id: string;

  @Column({ type: 'enum', enum: ModerationStatus, default: ModerationStatus.PENDING })
  status: ModerationStatus;

  @Column({ nullable: true })
  firebase_uid: string;

  @Column({ type: 'jsonb', nullable: true })
  content_data: any;

  @Column({ nullable: true })
  media_url: string;

  @Column({ type: 'jsonb', nullable: true })
  ai_analysis: any;

  @Column({ type: 'float', nullable: true })
  risk_score: number;

  @Column({ type: 'jsonb', nullable: true })
  flags: any;

  @Column({ nullable: true })
  moderator_id: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'moderator_id' })
  moderator: User;

  @Column({ nullable: true })
  rejection_reason: string;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  moderated_at: Date;
} 