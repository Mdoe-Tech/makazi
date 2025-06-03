-- Drop all existing tables in the public schema
DO $$ DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Create ENUM types
CREATE TYPE marital_status_enum AS ENUM ('single', 'married', 'divorced', 'widowed');
CREATE TYPE employment_status_enum AS ENUM ('EMPLOYED', 'UNEMPLOYED', 'SELF_EMPLOYED', 'STUDENT', 'RETIRED');
CREATE TYPE registration_status_enum AS ENUM ('pending', 'biometric_validation', 'document_verification', 'nida_verification', 'approved', 'rejected');
CREATE TYPE role_enum AS ENUM ('ADMIN', 'SUPER_ADMIN', 'SYSTEM_ADMIN', 'REGISTRAR', 'VERIFIER', 'APPROVER');
CREATE TYPE document_type_enum AS ENUM ('PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE', 'BIRTH_CERTIFICATE', 'EDUCATION_CERTIFICATE', 'EMPLOYMENT_CERTIFICATE');
CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE notification_status_enum AS ENUM ('pending', 'sent', 'failed');

-- Create citizen table
CREATE TABLE citizen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    nida_number VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    middle_name VARCHAR,
    date_of_birth DATE NOT NULL,
    gender VARCHAR NOT NULL,
    nationality VARCHAR NOT NULL,
    email VARCHAR,
    phone_number VARCHAR,
    address JSONB NOT NULL,
    biometric_data JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    verification_status JSONB,
    other_names VARCHAR,
    marital_status marital_status_enum NOT NULL,
    occupation VARCHAR,
    employer_name VARCHAR,
    dossier_number VARCHAR,
    employment_status employment_status_enum,
    contact_details JSONB,
    registration_status registration_status_enum DEFAULT 'pending',
    documents JSONB,
    rejection_reason VARCHAR,
    verification_data JSONB,
    birth_certificate_number VARCHAR UNIQUE NOT NULL,
    metadata JSONB,
    verification_status_history JSONB
);

-- Create admin table
CREATE TABLE admin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    username VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phone_number VARCHAR,
    role role_enum DEFAULT 'ADMIN',
    is_active BOOLEAN DEFAULT TRUE,
    permissions JSONB,
    last_login JSONB
);

-- Create document table
CREATE TABLE document (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    document_type VARCHAR NOT NULL,
    document_number VARCHAR NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    issuing_authority VARCHAR NOT NULL,
    document_data JSONB NOT NULL,
    verification_status verification_status_enum DEFAULT 'pending',
    verification_details JSONB,
    citizen_id UUID REFERENCES citizen(id),
    metadata JSONB
);

-- Create nida table
CREATE TABLE nida (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    nida_number VARCHAR UNIQUE NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    middle_name VARCHAR,
    date_of_birth DATE NOT NULL,
    gender VARCHAR NOT NULL,
    nationality VARCHAR NOT NULL,
    address JSONB NOT NULL,
    biometric_data JSONB NOT NULL,
    metadata JSONB NOT NULL
);

-- Create biometric table
CREATE TABLE biometric (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    biometric_type VARCHAR NOT NULL,
    biometric_data VARCHAR NOT NULL,
    metadata JSONB NOT NULL,
    citizen_id UUID REFERENCES citizen(id),
    is_active BOOLEAN DEFAULT TRUE,
    verification_status JSONB
);

-- Create audit table
CREATE TABLE audit (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    action VARCHAR NOT NULL,
    entity_type VARCHAR NOT NULL,
    entity_id VARCHAR NOT NULL,
    changes JSONB NOT NULL,
    user_id VARCHAR NOT NULL,
    user_type VARCHAR NOT NULL,
    metadata JSONB NOT NULL
);

-- Create system_config table
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    key VARCHAR UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB NOT NULL
);

-- Create notification table
CREATE TABLE notification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    recipient_id VARCHAR NOT NULL,
    recipient_type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    message VARCHAR NOT NULL,
    data JSONB NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    status notification_status_enum DEFAULT 'pending',
    metadata JSONB NOT NULL,
    delivery_attempts JSONB DEFAULT '[]'
);

-- Create report table
CREATE TABLE report (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    report_type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    parameters JSONB NOT NULL,
    data JSONB NOT NULL,
    generated_by VARCHAR NOT NULL,
    metadata JSONB NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMP
); 