-- Drop existing table if it exists
DROP TABLE IF EXISTS document_templates;

-- Create document_templates table
CREATE TABLE IF NOT EXISTS document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    required_fields TEXT[] NOT NULL,
    processing_time VARCHAR(50) NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    template_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial document templates
INSERT INTO document_templates (type, title, description, required_fields, processing_time, fee, template_content)
VALUES 
(
    'INTRODUCTION_LETTER',
    'Introduction Letter',
    'Official letter introducing a citizen to another organization or institution',
    ARRAY['full_name', 'nida_number', 'purpose', 'date'],
    '2-3 business days',
    5000.00,
    'This is to certify that {{full_name}} (NIDA: {{nida_number}}) is a registered citizen...'
),
(
    'SPONSORSHIP_LETTER',
    'Sponsorship Letter',
    'Official letter confirming sponsorship of a citizen for a specific purpose',
    ARRAY['full_name', 'nida_number', 'sponsor_name', 'purpose', 'date'],
    '2-3 business days',
    5000.00,
    'This is to confirm that {{sponsor_name}} is sponsoring {{full_name}} (NIDA: {{nida_number}}) for {{purpose}}...'
); 