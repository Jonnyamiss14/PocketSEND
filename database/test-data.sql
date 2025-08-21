-- Test data for PocketSEND dashboard
-- Run this in Supabase SQL Editor after running the main migration

-- Insert test candidates with learning metrics
WITH new_candidates AS (
  INSERT INTO candidates (
    first_name,
    last_name,
    email,
    phone,
    address,
    availability,
    experience_years,
    dbs_status,
    hourly_rate_min,
    hourly_rate_max,
    learning_streak,
    total_learning_minutes,
    confidence_score,
    last_active_at,
    is_active
  )
  VALUES 
    (
      'Sarah',
      'Johnson',
      'sarah.j@test.com',
      '+447700900123',
      '123 London Road, London, SW1A 1AA',
      'full_time',
      2,
      'clear',
      18.50,
      22.00,
      7,
      420,
      85,
      NOW(),
      true
    ),
    (
      'Michael',
      'Brown',
      'mike.b@test.com',
      '+447700900456',
      '456 Manchester Street, Manchester, M1 2AB',
      'part_time',
      4,
      'clear',
      20.00,
      25.00,
      14,
      680,
      92,
      NOW() - INTERVAL '2 days',
      true
    ),
    (
      'Emma',
      'Wilson',
      'emma.w@test.com',
      '+447700900789',
      '789 Birmingham Avenue, Birmingham, B1 1CD',
      'supply',
      1,
      'pending',
      16.00,
      20.00,
      3,
      180,
      68,
      NOW() - INTERVAL '5 days',
      true
    ),
    (
      'James',
      'Davis',
      'james.d@test.com',
      '+447700900012',
      '321 Leeds Close, Leeds, LS1 2EF',
      'flexible',
      3,
      'clear',
      19.00,
      24.00,
      21,
      1050,
      78,
      NOW() - INTERVAL '1 day',
      true
    ),
    (
      'Sophie',
      'Taylor',
      'sophie.t@test.com',
      '+447700900345',
      '654 Bristol Road, Bristol, BS1 3GH',
      'full_time',
      5,
      'clear',
      21.00,
      26.00,
      0,
      0,
      45,
      NOW() - INTERVAL '10 days',
      true
    )
  RETURNING id
)
-- Link all new candidates to the existing agency
INSERT INTO candidate_agencies (candidate_id, agency_id, status, assigned_consultant_id, registration_date)
SELECT 
  new_candidates.id,
  'd56a31c7-efcf-41f9-8570-1538735316cf'::uuid,
  'active',
  '797b65f9-9542-45bd-bd36-72b069397722'::uuid,  -- The authenticated user's ID
  NOW()
FROM new_candidates;

-- Add some preparation modules for the candidates to show learning progress
WITH candidate_ids AS (
  SELECT c.id, c.first_name 
  FROM candidates c
  JOIN candidate_agencies ca ON c.id = ca.candidate_id
  WHERE ca.agency_id = 'd56a31c7-efcf-41f9-8570-1538735316cf'::uuid
  LIMIT 3
)
INSERT INTO preparation_modules (candidate_id, module_name, module_type, completed_at, score, time_spent_minutes, is_completed)
SELECT 
  candidate_ids.id,
  'SEN Awareness Training',
  'micro_learning',
  NOW() - INTERVAL '1 day',
  85,
  15,
  true
FROM candidate_ids
UNION ALL
SELECT 
  candidate_ids.id,
  'Behavior Management',
  'micro_learning',
  NOW() - INTERVAL '3 days',
  78,
  20,
  true
FROM candidate_ids
WHERE candidate_ids.first_name IN ('Sarah', 'Michael')
UNION ALL
SELECT 
  candidate_ids.id,
  'Communication Skills',
  'assessment',
  NULL,
  NULL,
  0,
  false
FROM candidate_ids
WHERE candidate_ids.first_name = 'Emma';

-- Verify the test data was inserted correctly
SELECT 
  'Test Data Summary' as info,
  COUNT(*) as total_candidates
FROM candidates c
JOIN candidate_agencies ca ON c.id = ca.candidate_id
WHERE ca.agency_id = 'd56a31c7-efcf-41f9-8570-1538735316cf'::uuid;