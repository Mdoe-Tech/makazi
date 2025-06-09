-- Create admin_roles table
CREATE TABLE admin_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES admin(id) ON DELETE CASCADE,
    role admin_role_enum NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    UNIQUE(admin_id, role)
);

-- Create index for faster lookups
CREATE INDEX idx_admin_roles_admin_id ON admin_roles(admin_id);
CREATE INDEX idx_admin_roles_role ON admin_roles(role);

-- Add trigger to update updated_at
CREATE TRIGGER update_admin_roles_updated_at
    BEFORE UPDATE ON admin_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON admin_roles TO postgres; 