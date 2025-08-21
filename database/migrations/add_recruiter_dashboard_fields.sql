-- Add missing fields for recruiter dashboard
-- These fields are needed for the dashboard functionality

ALTER TABLE candidates ADD COLUMN IF NOT EXISTS learning_streak INTEGER DEFAULT 0;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS total_learning_minutes INTEGER DEFAULT 0;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS confidence_score INTEGER DEFAULT 0 CHECK (confidence_score >= 0 AND confidence_score <= 100);
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for better performance on dashboard queries
CREATE INDEX IF NOT EXISTS idx_candidates_last_active_at ON candidates(last_active_at);
CREATE INDEX IF NOT EXISTS idx_candidates_confidence_score ON candidates(confidence_score);
CREATE INDEX IF NOT EXISTS idx_candidates_learning_streak ON candidates(learning_streak);

-- Create preparation_modules table if it doesn't exist
CREATE TABLE IF NOT EXISTS preparation_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    placement_id UUID REFERENCES placements(id) ON DELETE SET NULL,
    module_name TEXT NOT NULL,
    module_type TEXT DEFAULT 'micro_learning' CHECK (module_type IN ('micro_learning', 'assessment', 'roleplay')),
    completed_at TIMESTAMP WITH TIME ZONE,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for preparation_modules
CREATE INDEX IF NOT EXISTS idx_preparation_modules_candidate_id ON preparation_modules(candidate_id);
CREATE INDEX IF NOT EXISTS idx_preparation_modules_placement_id ON preparation_modules(placement_id);
CREATE INDEX IF NOT EXISTS idx_preparation_modules_completed_at ON preparation_modules(completed_at);

-- Create ai_conversations table if it doesn't exist
CREATE TABLE IF NOT EXISTS ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    placement_id UUID REFERENCES placements(id) ON DELETE SET NULL,
    conversation_type TEXT DEFAULT 'roleplay' CHECK (conversation_type IN ('roleplay', 'assessment', 'coaching')),
    messages JSONB DEFAULT '[]',
    completed BOOLEAN DEFAULT FALSE,
    final_score INTEGER CHECK (final_score >= 0 AND final_score <= 100),
    duration_minutes INTEGER DEFAULT 0,
    scenario TEXT,
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for ai_conversations
CREATE INDEX IF NOT EXISTS idx_ai_conversations_candidate_id ON ai_conversations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_placement_id ON ai_conversations(placement_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_completed ON ai_conversations(completed);

-- Enable RLS on new tables
ALTER TABLE preparation_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for preparation_modules
CREATE POLICY IF NOT EXISTS "Preparation modules accessible by associated agencies" ON preparation_modules
    FOR SELECT USING (
        candidate_id IN (
            SELECT ca.candidate_id FROM candidate_agencies ca
            JOIN users u ON u.agency_id = ca.agency_id
            WHERE u.auth_user_id = auth.uid()
        )
    );

-- Add RLS policies for ai_conversations
CREATE POLICY IF NOT EXISTS "AI conversations accessible by associated agencies" ON ai_conversations
    FOR SELECT USING (
        candidate_id IN (
            SELECT ca.candidate_id FROM candidate_agencies ca
            JOIN users u ON u.agency_id = ca.agency_id
            WHERE u.auth_user_id = auth.uid()
        )
    );

-- Add updated_at triggers for new tables
CREATE TRIGGER update_preparation_modules_updated_at BEFORE UPDATE ON preparation_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    
CREATE TRIGGER update_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get recruiter stats
CREATE OR REPLACE FUNCTION get_recruiter_stats(agency_uuid UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
    total_candidates_count INTEGER;
    active_learners_count INTEGER;
    placements_this_week_count INTEGER;
    average_confidence_score DECIMAL;
BEGIN
    -- Get total candidates count
    SELECT COUNT(*)
    INTO total_candidates_count
    FROM candidates c
    JOIN candidate_agencies ca ON c.id = ca.candidate_id
    WHERE ca.agency_id = agency_uuid
    AND c.is_active = true;
    
    -- Get active learners (active in last 7 days)
    SELECT COUNT(*)
    INTO active_learners_count
    FROM candidates c
    JOIN candidate_agencies ca ON c.id = ca.candidate_id
    WHERE ca.agency_id = agency_uuid
    AND c.is_active = true
    AND c.last_active_at >= NOW() - INTERVAL '7 days';
    
    -- Get placements this week
    SELECT COUNT(*)
    INTO placements_this_week_count
    FROM placements p
    WHERE p.agency_id = agency_uuid
    AND p.created_at >= DATE_TRUNC('week', NOW());
    
    -- Get average confidence score
    SELECT COALESCE(AVG(c.confidence_score), 0)
    INTO average_confidence_score
    FROM candidates c
    JOIN candidate_agencies ca ON c.id = ca.candidate_id
    WHERE ca.agency_id = agency_uuid
    AND c.is_active = true;
    
    -- Build result JSON
    SELECT json_build_object(
        'total_candidates', total_candidates_count,
        'active_learners', active_learners_count,
        'placements_this_week', placements_this_week_count,
        'average_confidence', ROUND(average_confidence_score, 1)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;