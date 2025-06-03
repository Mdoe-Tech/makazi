-- Migration: Add missing columns to citizen table
ALTER TABLE citizen
ADD COLUMN IF NOT EXISTS nationality VARCHAR(50) NOT NULL DEFAULT 'Tanzanian',
ADD COLUMN IF NOT EXISTS marital_status VARCHAR(20),
ADD COLUMN IF NOT EXISTS employment_status VARCHAR(20),
ADD COLUMN IF NOT EXISTS occupation VARCHAR(100),
ADD COLUMN IF NOT EXISTS employer_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS dossier_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS contact_details JSONB,
ADD COLUMN IF NOT EXISTS metadata JSONB,
ADD COLUMN IF NOT EXISTS verification_status_history JSONB; 