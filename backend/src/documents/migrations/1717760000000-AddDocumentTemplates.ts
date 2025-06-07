import { MigrationInterface, QueryRunner } from 'typeorm';
import { DocumentType } from '../enums/document-type.enum';

export class AddDocumentTemplates1717760000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO document_templates (
        type, title, description, required_fields, processing_time, fee, template_content, created_at, updated_at
      ) VALUES
      (
        '${DocumentType.INTRODUCTION_LETTER}',
        'Introduction Letter',
        'Official letter introducing a citizen to another organization or institution',
        ARRAY['full_name', 'nida_number', 'purpose', 'date']::text[],
        '2-3 business days',
        5000,
        'This is to certify that {{full_name}} (NIDA: {{nida_number}}) is a registered citizen...',
        NOW(),
        NOW()
      ),
      (
        '${DocumentType.SPONSORSHIP_LETTER}',
        'Sponsorship Letter',
        'Official letter confirming sponsorship of a citizen for a specific purpose',
        ARRAY['full_name', 'nida_number', 'sponsor_name', 'purpose', 'date']::text[],
        '2-3 business days',
        5000,
        'This is to confirm that {{sponsor_name}} is sponsoring {{full_name}} (NIDA: {{nida_number}}) for {{purpose}}...',
        NOW(),
        NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM document_templates WHERE type IN ('${DocumentType.INTRODUCTION_LETTER}', '${DocumentType.SPONSORSHIP_LETTER}')`);
  }
} 