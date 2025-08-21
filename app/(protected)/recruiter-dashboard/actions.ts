'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface AddCandidateData {
  first_name: string
  last_name: string
  email?: string
  phone: string
  address: string
  availability: 'full_time' | 'part_time' | 'supply' | 'flexible'
  experience_years: number
  hourly_rate_min?: number
  hourly_rate_max?: number
  dbs_status: 'pending' | 'clear' | 'update_required' | 'expired'
  notes?: string
}

export async function addCandidate(data: AddCandidateData) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()
  
  try {
    // Get current user and verify they're authorized
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    console.log('Adding candidate for auth user:', user.id)

    // Get user's agency using admin client to bypass RLS
    const { data: userData, error: userError } = await adminSupabase
      .from('users')
      .select('id, agency_id, role')
      .eq('auth_user_id', user.id)
      .single()
      
    console.log('User data found:', { userData, userError })

    if (userError || !userData) {
      return { success: false, error: 'User not found or not authorized' }
    }

    // Create the candidate using admin client to bypass RLS
    const candidateData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email || null,
      phone: data.phone,
      address: data.address,
      availability: data.availability,
      experience_years: data.experience_years,
      hourly_rate_min: data.hourly_rate_min || null,
      hourly_rate_max: data.hourly_rate_max || null,
      dbs_status: data.dbs_status,
      notes: data.notes || null,
      learning_streak: 0,
      total_learning_minutes: 0,
      confidence_score: 0,
      last_active_at: new Date().toISOString(),
      is_active: true,
    }
    
    console.log('Creating candidate with data:', candidateData)
    
    const { data: candidate, error: candidateError } = await adminSupabase
      .from('candidates')
      .insert(candidateData)
      .select()
      .single()
      
    console.log('Candidate creation result:', { candidate, candidateError })

    if (candidateError) {
      console.error('Error creating candidate:', candidateError)
      return { success: false, error: 'Failed to create candidate' }
    }

    // Link the candidate to the agency using admin client
    const linkData = {
      candidate_id: candidate.id,
      agency_id: userData.agency_id,
      assigned_consultant_id: userData.id, // Use userData.id (from users table) not user.id (from auth)
      status: 'active',
      registration_date: new Date().toISOString(),
    }
    
    console.log('Linking candidate to agency with data:', linkData)
    
    const { error: linkError } = await adminSupabase
      .from('candidate_agencies')
      .insert(linkData)
      
    console.log('Link creation result:', { linkError })

    if (linkError) {
      console.error('Error linking candidate to agency:', linkError)
      // Try to cleanup the candidate record
      await adminSupabase.from('candidates').delete().eq('id', candidate.id)
      return { success: false, error: 'Failed to register candidate with agency' }
    }

    console.log('Successfully created candidate and agency link')

    // Revalidate the dashboard page to show the new candidate
    revalidatePath('/recruiter-dashboard')

    return { success: true, candidate }
  } catch (error) {
    console.error('Unexpected error adding candidate:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateCandidate(candidateId: string, data: Partial<AddCandidateData>) {
  const supabase = await createClient()
  
  try {
    // Get current user and verify they're authorized
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user's agency
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('agency_id')
      .eq('auth_user_id', user.id)
      .single()

    if (userError || !userData) {
      return { success: false, error: 'User not found or not authorized' }
    }

    // Verify the candidate belongs to this agency
    const { data: candidateAgency, error: caError } = await supabase
      .from('candidate_agencies')
      .select('candidate_id')
      .eq('candidate_id', candidateId)
      .eq('agency_id', userData.agency_id)
      .single()

    if (caError || !candidateAgency) {
      return { success: false, error: 'Candidate not found or not authorized' }
    }

    // Update the candidate
    const { error: updateError } = await supabase
      .from('candidates')
      .update(data)
      .eq('id', candidateId)

    if (updateError) {
      console.error('Error updating candidate:', updateError)
      return { success: false, error: 'Failed to update candidate' }
    }

    // Revalidate the dashboard page
    revalidatePath('/recruiter-dashboard')

    return { success: true }
  } catch (error) {
    console.error('Unexpected error updating candidate:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function exportCandidates(filters?: {
  search?: string
  location?: string
  status?: string
}) {
  const supabase = await createClient()
  
  try {
    // Get current user and verify they're authorized
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Get user's agency
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('agency_id')
      .eq('auth_user_id', user.id)
      .single()

    if (userError || !userData) {
      return { success: false, error: 'User not found or not authorized' }
    }

    // Build query with same filters as dashboard
    let query = supabase
      .from('candidates')
      .select(`
        first_name,
        last_name,
        email,
        phone,
        address,
        availability,
        experience_years,
        hourly_rate_min,
        hourly_rate_max,
        dbs_status,
        learning_streak,
        total_learning_minutes,
        confidence_score,
        last_active_at,
        is_active,
        candidate_agencies!inner(
          agency_id,
          status
        )
      `)
      .eq('candidate_agencies.agency_id', userData.agency_id)
      .order('last_active_at', { ascending: false })

    // Apply filters
    if (filters?.search) {
      query = query.or(
        `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      )
    }

    if (filters?.location) {
      query = query.ilike('address', `%${filters.location}%`)
    }

    if (filters?.status === 'active') {
      query = query.gte('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    } else if (filters?.status === 'inactive') {
      query = query.lt('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    }

    const { data: candidates, error } = await query

    if (error) {
      console.error('Error fetching candidates for export:', error)
      return { success: false, error: 'Failed to fetch candidates' }
    }

    // Convert to CSV format
    const headers = [
      'First Name',
      'Last Name', 
      'Email',
      'Phone',
      'Address',
      'Availability',
      'Experience (Years)',
      'Min Rate (£)',
      'Max Rate (£)',
      'DBS Status',
      'Learning Streak',
      'Total Learning (Minutes)',
      'Confidence Score (%)',
      'Last Active',
      'Status'
    ]

    const csvData = candidates?.map(candidate => [
      candidate.first_name,
      candidate.last_name,
      candidate.email || '',
      candidate.phone,
      candidate.address,
      candidate.availability,
      candidate.experience_years,
      candidate.hourly_rate_min || '',
      candidate.hourly_rate_max || '',
      candidate.dbs_status,
      candidate.learning_streak,
      candidate.total_learning_minutes,
      candidate.confidence_score,
      new Date(candidate.last_active_at).toLocaleString(),
      candidate.is_active ? 'Active' : 'Inactive'
    ]) || []

    const csv = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    return { success: true, csv, filename: `candidates_${new Date().toISOString().split('T')[0]}.csv` }
  } catch (error) {
    console.error('Unexpected error exporting candidates:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}