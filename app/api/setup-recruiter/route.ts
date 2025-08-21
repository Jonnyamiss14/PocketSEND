import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET() {
  try {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()
    
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        authError: authError?.message 
      }, { status: 401 })
    }

    // Check if user already exists (using admin client to bypass RLS)
    const { data: existingUser } = await adminSupabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (existingUser) {
      // User already exists, redirect to dashboard
      redirect('/recruiter-dashboard')
    }

    // Create or get demo agency (using admin client to bypass RLS)
    let agencyId: string
    
    const { data: existingAgency } = await adminSupabase
      .from('agencies')
      .select('id')
      .eq('email', 'demo@pocketsend.com')
      .single()

    if (existingAgency) {
      agencyId = existingAgency.id
    } else {
      // Create demo agency (using admin client to bypass RLS)
      const { data: newAgency, error: agencyError } = await adminSupabase
        .from('agencies')
        .insert({
          name: 'Demo Recruitment Agency',
          email: 'demo@pocketsend.com',
          phone: '+44 20 1234 5678',
          whatsapp_credits: 1000,
          subscription_status: 'active',
          subscription_plan: 'premium'
        })
        .select()
        .single()

      if (agencyError || !newAgency) {
        console.error('Error creating agency:', agencyError)
        return NextResponse.json({ 
          error: 'Failed to create agency',
          details: agencyError?.message 
        }, { status: 500 })
      }

      agencyId = newAgency.id
    }

    // Create user record (using admin client to bypass RLS)
    const { data: newUser, error: userError } = await adminSupabase
      .from('users')
      .insert({
        agency_id: agencyId,
        auth_user_id: user.id,
        email: user.email || '',
        first_name: user.email?.split('@')[0] || 'Demo',
        last_name: 'User',
        role: 'admin',
        is_active: true
      })
      .select()
      .single()

    if (userError || !newUser) {
      console.error('Error creating user:', userError)
      return NextResponse.json({ 
        error: 'Failed to create user',
        details: userError?.message 
      }, { status: 500 })
    }

    // Create some demo candidates for the agency
    const demoCandiates = [
      {
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.j@example.com',
        phone: '+44 7700 900001',
        address: 'London, UK',
        experience_level: 'entry',
        sen_experience: true,
        availability: 'immediate',
        salary_expectation: 22000,
        learning_streak: 7,
        confidence_score: 85,
        last_active_at: new Date().toISOString()
      },
      {
        first_name: 'Michael',
        last_name: 'Brown',
        email: 'michael.b@example.com',
        phone: '+44 7700 900002',
        address: 'Manchester, UK',
        experience_level: 'intermediate',
        sen_experience: true,
        availability: 'two_weeks',
        salary_expectation: 25000,
        learning_streak: 14,
        confidence_score: 92,
        last_active_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        first_name: 'Emma',
        last_name: 'Wilson',
        email: 'emma.w@example.com',
        phone: '+44 7700 900003',
        address: 'Birmingham, UK',
        experience_level: 'entry',
        sen_experience: false,
        availability: 'immediate',
        salary_expectation: 21000,
        learning_streak: 3,
        confidence_score: 68,
        last_active_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Insert demo candidates (using admin client to bypass RLS)
    const { data: candidates, error: candidatesError } = await adminSupabase
      .from('candidates')
      .insert(demoCandiates)
      .select()

    if (candidatesError) {
      console.error('Error creating demo candidates:', candidatesError)
      // Non-fatal error, continue
    }

    // Link candidates to agency (using admin client to bypass RLS)
    if (candidates && candidates.length > 0) {
      const candidateAgencyLinks = candidates.map(candidate => ({
        candidate_id: candidate.id,
        agency_id: agencyId,
        status: 'active',
        assigned_consultant_id: newUser.id
      }))

      const { error: linkError } = await adminSupabase
        .from('candidate_agencies')
        .insert(candidateAgencyLinks)

      if (linkError) {
        console.error('Error linking candidates to agency:', linkError)
        // Non-fatal error, continue
      }
    }

    // Redirect to dashboard
    redirect('/recruiter-dashboard')

  } catch (error) {
    console.error('Error in setup recruiter:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}