-- Add gender column to nida_verifications table
ALTER TABLE "nida_verifications"
ADD COLUMN IF NOT EXISTS "gender" VARCHAR(50); 