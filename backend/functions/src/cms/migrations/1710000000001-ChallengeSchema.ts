import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChallengeSchema1710000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create challenge status and difficulty enums
    await queryRunner.query(`
      CREATE TYPE challenge_status AS ENUM (
        'draft', 
        'pending_approval', 
        'approved', 
        'rejected', 
        'active', 
        'completed', 
        'archived'
      );
      
      CREATE TYPE challenge_difficulty AS ENUM (
        'beginner', 
        'intermediate', 
        'advanced', 
        'expert'
      );
    `);

    // Create challenges table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS challenges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status challenge_status NOT NULL DEFAULT 'draft',
        difficulty challenge_difficulty NOT NULL DEFAULT 'beginner',
        firebase_uid VARCHAR(128),
        creator_id UUID,
        sponsor_id VARCHAR(255),
        location JSONB,
        rules JSONB,
        rewards JSONB,
        start_date TIMESTAMPTZ,
        end_date TIMESTAMPTZ,
        is_featured BOOLEAN NOT NULL DEFAULT FALSE,
        is_private BOOLEAN NOT NULL DEFAULT FALSE,
        media JSONB,
        requirements JSONB,
        tags JSONB,
        regional_policies JSONB,
        approved_by UUID,
        approved_at TIMESTAMPTZ,
        rejection_reason TEXT,
        submission_count INTEGER NOT NULL DEFAULT 0,
        view_count INTEGER NOT NULL DEFAULT 0,
        participant_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
      CREATE INDEX IF NOT EXISTS idx_challenges_firebase_uid ON challenges(firebase_uid);
      CREATE INDEX IF NOT EXISTS idx_challenges_creator_id ON challenges(creator_id);
      CREATE INDEX IF NOT EXISTS idx_challenges_sponsor_id ON challenges(sponsor_id);
      CREATE INDEX IF NOT EXISTS idx_challenges_is_featured ON challenges(is_featured);
      CREATE INDEX IF NOT EXISTS idx_challenges_start_date ON challenges(start_date);
      CREATE INDEX IF NOT EXISTS idx_challenges_end_date ON challenges(end_date);
    `);

    // Create regional_policies table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS regional_policies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        region VARCHAR(255) NOT NULL,
        description TEXT,
        rules JSONB NOT NULL,
        created_by UUID,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        UNIQUE(name, region)
      );
      
      CREATE INDEX IF NOT EXISTS idx_regional_policies_region ON regional_policies(region);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables and types
    await queryRunner.query(`
      DROP TABLE IF EXISTS regional_policies;
      DROP TABLE IF EXISTS challenges;
      DROP TYPE IF EXISTS challenge_difficulty;
      DROP TYPE IF EXISTS challenge_status;
    `);
  }
} 