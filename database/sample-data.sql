-- Sample data for testing PocketSEND application
-- Run this after the main schema is created

-- Insert sample agency
INSERT INTO agencies (id, name, email, phone, address, whatsapp_credits, subscription_status) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Elite Education Recruitment', 'admin@eliteeducation.co.uk', '+44 20 7123 4567', '123 Education Lane, London, SW1A 1AA', 500, 'active');

-- Insert sample schools
INSERT INTO schools (id, name, address, phone, email, type, ofsted_rating) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Greenfield Primary School', '456 School Road, Birmingham, B12 3CD', '+44 121 234 5678', 'office@greenfield.sch.uk', 'primary', 'good'),
('550e8400-e29b-41d4-a716-446655440002', 'Riverside Secondary Academy', '789 Academy Street, Manchester, M1 2EF', '+44 161 345 6789', 'info@riverside.academy.uk', 'secondary', 'outstanding'),
('550e8400-e29b-41d4-a716-446655440003', 'Sunshine Special Needs School', '321 Care Close, Leeds, LS1 3GH', '+44 113 456 7890', 'admin@sunshine.special.uk', 'special', 'good');

-- Insert sample candidates
INSERT INTO candidates (id, first_name, last_name, email, phone, date_of_birth, address, dbs_status, experience_years, specializations, availability, hourly_rate_min, hourly_rate_max) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Sarah', 'Johnson', 'sarah.johnson@email.com', '+44 7700 900001', '1985-03-15', '12 Candidate Close, London, SW2 1AB', 'clear', 3, ARRAY['SEN Support', 'Autism'], 'full_time', 12.50, 18.00),
('550e8400-e29b-41d4-a716-446655440011', 'Michael', 'Thompson', 'michael.thompson@email.com', '+44 7700 900002', '1990-07-22', '34 Helper House, Birmingham, B15 2CD', 'clear', 2, ARRAY['Learning Support', 'Dyslexia'], 'part_time', 11.00, 16.00),
('550e8400-e29b-41d4-a716-446655440012', 'Emma', 'Williams', 'emma.williams@email.com', '+44 7700 900003', '1988-11-08', '56 Assistant Avenue, Manchester, M20 3EF', 'clear', 5, ARRAY['ADHD Support', 'Behavior Management'], 'full_time', 14.00, 20.00);

-- Link candidates to agency
INSERT INTO candidate_agencies (candidate_id, agency_id, status, assigned_consultant_id) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'active', null),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'active', null),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'active', null);

-- Insert sample placements
INSERT INTO placements (id, agency_id, candidate_id, school_id, position_title, position_type, start_date, end_date, daily_rate, status) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'SEN Teaching Assistant', 'sen_support', '2024-01-15', '2024-07-20', 95.00, 'in_progress'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 'Learning Support Assistant', 'learning_support', '2024-02-01', '2024-06-30', 85.00, 'confirmed'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', '1:1 SEN Support', 'sen_support', '2024-03-01', null, 110.00, 'pending');

-- Insert sample message templates
INSERT INTO message_templates (id, agency_id, name, category, subject, content, variables) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440000', 'Welcome New Candidate', 'welcome', 'Welcome to Elite Education', 'Hi {{candidate_name}}! Welcome to Elite Education Recruitment. We''re excited to help you find your next SEN placement. Your consultant will be in touch soon.', '["candidate_name"]'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440000', 'Placement Offer', 'placement_offer', 'New Placement Opportunity', 'Hi {{candidate_name}}, we have an exciting {{position_type}} role at {{school_name}} starting {{start_date}}. Daily rate: £{{daily_rate}}. Are you interested?', '["candidate_name", "position_type", "school_name", "start_date", "daily_rate"]'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440000', 'Preparation Reminder', 'reminder', 'Placement Preparation', 'Hi {{candidate_name}}, your placement at {{school_name}} starts {{start_date}}. Remember to complete your preparation modules. Good luck!', '["candidate_name", "school_name", "start_date"]');

-- Insert sample messages
INSERT INTO messages (id, agency_id, candidate_id, placement_id, message_type, content, status, sent_at) VALUES
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', 'whatsapp', 'Hi Sarah! Welcome to Elite Education Recruitment. We''re excited to help you find your next SEN placement.', 'delivered', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', null, 'whatsapp', 'Hi Michael, we have an exciting Learning Support role at Riverside Secondary Academy starting Feb 1st. Daily rate: £85. Are you interested?', 'read', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', null, 'whatsapp', 'Hi Emma, your placement at Sunshine Special Needs School starts March 1st. Remember to complete your preparation modules. Good luck!', 'sent', NOW() - INTERVAL '3 hours');