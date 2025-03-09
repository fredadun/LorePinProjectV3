import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

/**
 * Regional policy entity for managing region-specific policies
 */
@Entity('regional_policies')
export class RegionalPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  region: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  rules: {
    content_restrictions: string[];
    age_restrictions: number | null;
    location_restrictions: {
      type: string;
      coordinates: number[];
      radius: number;
    }[];
    time_restrictions: {
      start_time: string;
      end_time: string;
      days: string[];
    }[];
    other_restrictions: any;
  };

  @Column({ nullable: true })
  created_by: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 