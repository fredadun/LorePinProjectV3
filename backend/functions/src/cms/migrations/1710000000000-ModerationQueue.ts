import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModerationQueue1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create moderation_queue table
    await queryRunner.query(`
      CREATE TYPE moderation_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
      CREATE TYPE content_type AS ENUM ('challenge', 'submission', 'user_profile', 'comment');

      CREATE TABLE IF NOT EXISTS moderation_queue (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        content_type content_type NOT NULL,
        content_id VARCHAR(255) NOT NULL,
        status moderation_status NOT NULL DEFAULT 'pending',
        firebase_uid VARCHAR(128),
        content_data JSONB,
        media_url TEXT,
        ai_analysis JSONB,
        risk_score FLOAT,
        flags JSONB,
        moderator_id UUID,
        rejection_reason TEXT,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        moderated_at TIMESTAMPTZ,
        FOREIGN KEY (moderator_id) REFERENCES users(id) ON DELETE SET NULL
      );

      CREATE INDEX IF NOT EXISTS idx_moderation_queue_content_type ON moderation_queue(content_type);
      CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status);
      CREATE INDEX IF NOT EXISTS idx_moderation_queue_firebase_uid ON moderation_queue(firebase_uid);
      CREATE INDEX IF NOT EXISTS idx_moderation_queue_created_at ON moderation_queue(created_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop moderation_queue table
    await queryRunner.query(`
      DROP TABLE IF EXISTS moderation_queue;
      DROP TYPE IF EXISTS moderation_status;
      DROP TYPE IF EXISTS content_type;
    `);
  }
} 