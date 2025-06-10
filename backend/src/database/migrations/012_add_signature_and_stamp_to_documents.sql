-- Add signature_url and stamp_url columns to document_requests table
ALTER TABLE document_requests
ADD COLUMN IF NOT EXISTS signature_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS stamp_url VARCHAR(255);

-- Update existing records to have NULL values for new columns
UPDATE document_requests
SET signature_url = NULL,
    stamp_url = NULL
WHERE signature_url IS NULL OR stamp_url IS NULL; 