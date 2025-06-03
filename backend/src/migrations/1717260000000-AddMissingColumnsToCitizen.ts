import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMissingColumnsToCitizen1717260000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE citizen
      ADD COLUMN IF NOT EXISTS marital_status VARCHAR(20),
      ADD COLUMN IF NOT EXISTS employment_status VARCHAR(20),
      ADD COLUMN IF NOT EXISTS occupation VARCHAR(100),
      ADD COLUMN IF NOT EXISTS employer_name VARCHAR(100),
      ADD COLUMN IF NOT EXISTS dossier_number VARCHAR(20),
      ADD COLUMN IF NOT EXISTS contact_details JSONB,
      ADD COLUMN IF NOT EXISTS metadata JSONB,
      ADD COLUMN IF NOT EXISTS verification_status_history JSONB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE citizen
      DROP COLUMN IF EXISTS marital_status,
      DROP COLUMN IF EXISTS employment_status,
      DROP COLUMN IF EXISTS occupation,
      DROP COLUMN IF EXISTS employer_name,
      DROP COLUMN IF EXISTS dossier_number,
      DROP COLUMN IF EXISTS contact_details,
      DROP COLUMN IF EXISTS metadata,
      DROP COLUMN IF EXISTS verification_status_history
    `);
  }
} 