-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create agencies table (multi-tenant root)
CREATE TABLE agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    address TEXT,
    whatsapp_credits INTEGER DEFAULT 100,
    subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'suspended', 'cancelled')),
    subscription_plan TEXT DEFAULT 'basic',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (agency staff)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    auth_user_id UUID NOT NULL, -- References auth.users
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT NOT NULL DEFAULT 'consultant' CHECK (role IN ('admin', 'consultant', 'team_lead')),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(auth_user_id)
);

-- Create schools table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    type TEXT DEFAULT 'primary' CHECK (type IN ('primary', 'secondary', 'special', 'nursery')),
    ofsted_rating TEXT CHECK (ofsted_rating IN ('outstanding', 'good', 'requires_improvement', 'inadequate')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create candidates table (TAs/LSAs)
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    date_of_birth DATE,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    dbs_status TEXT DEFAULT 'pending' CHECK (dbs_status IN ('pending', 'clear', 'update_required', 'expired')),
    dbs_expiry_date DATE,
    qualifications JSONB DEFAULT '[]',
    experience_years INTEGER DEFAULT 0,
    specializations TEXT[] DEFAULT '{}',
    availability TEXT DEFAULT 'full_time' CHECK (availability IN ('full_time', 'part_time', 'supply', 'flexible')),
    transport_method TEXT CHECK (transport_method IN ('car', 'public_transport', 'walking', 'cycling')),
    max_travel_distance INTEGER DEFAULT 10, -- in miles
    hourly_rate_min DECIMAL(5,2),
    hourly_rate_max DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create candidate_agencies junction table (many-to-many relationship)
CREATE TABLE candidate_agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    assigned_consultant_id UUID REFERENCES users(id) ON DELETE SET NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(candidate_id, agency_id)
);

-- Create auth_tokens table (for magic links)
CREATE TABLE auth_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    token_type TEXT DEFAULT 'magic_link' CHECK (token_type IN ('magic_link', 'password_reset', 'email_verification')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    is_used BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create placements table
CREATE TABLE placements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
    position_title TEXT NOT NULL,
    position_type TEXT DEFAULT 'teaching_assistant' CHECK (position_type IN ('teaching_assistant', 'learning_support', 'sen_support', 'cover_supervisor')),
    year_group TEXT,
    subject_area TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    is_long_term BOOLEAN DEFAULT FALSE,
    daily_rate DECIMAL(6,2),
    hourly_rate DECIMAL(5,2),
    working_hours_start TIME,
    working_hours_end TIME,
    requirements TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comments TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    placement_id UUID REFERENCES placements(id) ON DELETE SET NULL,
    sent_by UUID REFERENCES users(id) ON DELETE SET NULL,
    message_type TEXT DEFAULT 'whatsapp' CHECK (message_type IN ('whatsapp', 'sms', 'email', 'system')),
    content TEXT NOT NULL,
    media_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
    external_message_id TEXT, -- Twilio message SID
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    failed_reason TEXT,
    cost_credits INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create message_templates table
CREATE TABLE message_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('welcome', 'placement_offer', 'reminder', 'feedback', 'general')),
    subject TEXT,
    content TEXT NOT NULL,
    variables JSONB DEFAULT '[]', -- Array of template variables like {{candidate_name}}
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for multi-tenant isolation

-- Agencies: Only accessible by agency members
CREATE POLICY "Agencies can view their own agency" ON agencies
    FOR SELECT USING (
        id IN (
            SELECT agency_id FROM users WHERE auth_user_id = auth.uid()
        )
    );

-- Users: Only accessible by same agency
CREATE POLICY "Users can view same agency users" ON users
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users WHERE auth_user_id = auth.uid()
        )
    );

-- Schools: Publicly readable (all agencies can see schools)
CREATE POLICY "Schools are publicly readable" ON schools
    FOR SELECT USING (true);

-- Candidates: Only accessible by associated agencies
CREATE POLICY "Candidates accessible by associated agencies" ON candidates
    FOR SELECT USING (
        id IN (
            SELECT ca.candidate_id FROM candidate_agencies ca
            JOIN users u ON u.agency_id = ca.agency_id
            WHERE u.auth_user_id = auth.uid()
        )
    );

-- Candidate_agencies: Only accessible by agency members
CREATE POLICY "Candidate agencies accessible by agency members" ON candidate_agencies
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users WHERE auth_user_id = auth.uid()
        )
    );

-- Auth tokens: Only accessible by candidate or associated agency
CREATE POLICY "Auth tokens accessible by candidate or agency" ON auth_tokens
    FOR SELECT USING (
        candidate_id IN (
            SELECT ca.candidate_id FROM candidate_agencies ca
            JOIN users u ON u.agency_id = ca.agency_id
            WHERE u.auth_user_id = auth.uid()
        )
    );

-- Placements: Only accessible by agency members
CREATE POLICY "Placements accessible by agency members" ON placements
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users WHERE auth_user_id = auth.uid()
        )
    );

-- Messages: Only accessible by agency members
CREATE POLICY "Messages accessible by agency members" ON messages
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users WHERE auth_user_id = auth.uid()
        )
    );

-- Message templates: Only accessible by agency members
CREATE POLICY "Message templates accessible by agency members" ON message_templates
    FOR SELECT USING (
        agency_id IN (
            SELECT agency_id FROM users WHERE auth_user_id = auth.uid()
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_users_agency_id ON users(agency_id);
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_candidate_agencies_candidate_id ON candidate_agencies(candidate_id);
CREATE INDEX idx_candidate_agencies_agency_id ON candidate_agencies(agency_id);
CREATE INDEX idx_auth_tokens_candidate_id ON auth_tokens(candidate_id);
CREATE INDEX idx_auth_tokens_token ON auth_tokens(token);
CREATE INDEX idx_auth_tokens_expires_at ON auth_tokens(expires_at);
CREATE INDEX idx_placements_agency_id ON placements(agency_id);
CREATE INDEX idx_placements_candidate_id ON placements(candidate_id);
CREATE INDEX idx_placements_school_id ON placements(school_id);
CREATE INDEX idx_messages_agency_id ON messages(agency_id);
CREATE INDEX idx_messages_candidate_id ON messages(candidate_id);
CREATE INDEX idx_message_templates_agency_id ON message_templates(agency_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_candidate_agencies_updated_at BEFORE UPDATE ON candidate_agencies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_placements_updated_at BEFORE UPDATE ON placements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON message_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();