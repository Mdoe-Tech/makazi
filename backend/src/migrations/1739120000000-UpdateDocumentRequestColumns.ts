import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDocumentRequestColumns1739120000000 implements MigrationInterface {
    name = 'UpdateDocumentRequestColumns1739120000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_requests" ALTER COLUMN "signature_url" TYPE text`);
        await queryRunner.query(`ALTER TABLE "document_requests" ALTER COLUMN "stamp_url" TYPE text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "document_requests" ALTER COLUMN "signature_url" TYPE character varying(255)`);
        await queryRunner.query(`ALTER TABLE "document_requests" ALTER COLUMN "stamp_url" TYPE character varying(255)`);
    }
} 