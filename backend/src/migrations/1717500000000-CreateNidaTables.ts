import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNidaTables1717500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create nida table
    await queryRunner.query(`
      CREATE TABLE "nida" (
        "nida_number" character varying NOT NULL,
        "first_name" character varying NOT NULL,
        "middle_name" character varying,
        "last_name" character varying NOT NULL,
        "other_names" character varying,
        "date_of_birth" character varying NOT NULL,
        "birth_certificate_number" character varying,
        "phone_number" character varying,
        "gender" character varying NOT NULL,
        "marital_status" character varying NOT NULL,
        "occupation" character varying,
        "employer_name" character varying,
        "dossier_number" character varying,
        "employment_status" character varying NOT NULL,
        "father_first_name" character varying,
        "father_middle_name" character varying,
        "father_last_name" character varying,
        "father_birth_country" character varying,
        "father_date_of_birth" character varying,
        "mother_first_name" character varying,
        "mother_middle_name" character varying,
        "mother_last_name" character varying,
        "mother_birth_country" character varying,
        "mother_date_of_birth" character varying,
        "citizenship_type" character varying NOT NULL,
        "naturalization_certificate_number" character varying,
        "birth_country" character varying NOT NULL,
        "birth_region" character varying NOT NULL,
        "birth_district" character varying NOT NULL,
        "birth_ward" character varying NOT NULL,
        "current_residence_house_number" character varying,
        "current_residence_region" character varying NOT NULL,
        "current_residence_postal_code" character varying,
        "current_residence_district" character varying NOT NULL,
        "current_residence_ward" character varying NOT NULL,
        "current_residence_village" character varying,
        "current_residence_street" character varying,
        "current_residence_postal_box" character varying,
        "permanent_residence_house_number" character varying,
        "permanent_residence_region" character varying NOT NULL,
        "permanent_residence_postal_code" character varying,
        "permanent_residence_district" character varying NOT NULL,
        "permanent_residence_ward" character varying NOT NULL,
        "permanent_residence_village" character varying,
        "permanent_residence_street" character varying,
        "permanent_residence_postal_box" character varying,
        "passport_number" character varying,
        "father_national_id" character varying,
        "mother_national_id" character varying,
        "driver_license_number" character varying,
        "voter_registration_number" character varying,
        "health_insurance_number" character varying,
        "tax_identification_number" character varying,
        "zanzibar_resident_id" character varying,
        "social_security_fund_type" character varying,
        "social_security_membership_number" character varying,
        "secondary_education_certificate_number" character varying,
        "higher_secondary_education_certificate_number" character varying,
        "applicant_signature" character varying,
        "official_use_executive_officer_name" character varying,
        "official_use_center_number" character varying,
        "official_use_region" character varying,
        "official_use_district" character varying,
        "official_use_ward" character varying,
        "official_use_center_name" character varying,
        "application_date" character varying,
        "registration_officer_name" character varying,
        "immigration_officer_name" character varying,
        "rita_rgo_officer_name" character varying,
        "weo_employer_name" character varying,
        "nida_officer_name" character varying,
        "primary_school_name" character varying,
        "primary_school_district" character varying,
        "primary_school_graduation_year" character varying,
        "is_verified" boolean NOT NULL DEFAULT false,
        "verification_date" character varying,
        "metadata" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_nida" PRIMARY KEY ("nida_number")
      )
    `);

    // Create nida_verifications table
    await queryRunner.query(`
      CREATE TABLE "nida_verifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "nida_number" character varying NOT NULL,
        "first_name" character varying NOT NULL,
        "last_name" character varying NOT NULL,
        "date_of_birth" character varying NOT NULL,
        "is_valid" boolean NOT NULL,
        "match_score" decimal(5,2) NOT NULL,
        "details" jsonb,
        "verification_date" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_nida_verifications" PRIMARY KEY ("id"),
        CONSTRAINT "FK_nida_verifications_nida" FOREIGN KEY ("nida_number") 
          REFERENCES "nida"("nida_number") ON DELETE CASCADE
      )
    `);

    // Add is_nida_verified column to citizen table
    await queryRunner.query(`
      ALTER TABLE "citizen" 
      ADD COLUMN "is_nida_verified" boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "nida_verifications"`);
    await queryRunner.query(`DROP TABLE "nida"`);
    await queryRunner.query(`ALTER TABLE "citizen" DROP COLUMN "is_nida_verified"`);
  }
} 