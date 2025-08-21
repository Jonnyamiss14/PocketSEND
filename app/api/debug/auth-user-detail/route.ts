import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        authError: authError?.message 
      }, { status: 401 })
    }

    // Try to find this user in the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        agencies (
          id,
          name
        )
      `)
      .eq('auth_user_id', user.id)
      .single()

    // Get all users in the users table for debugging
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('auth_user_id, email, first_name, last_name, agency_id')

    // Get all agencies
    const { data: allAgencies, error: agenciesError } = await supabase
      .from('agencies')
      .select('*')

    return NextResponse.json({
      authUser: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      userLookup: {
        found: !!userData,
        data: userData,
        error: userError?.message
      },
      debug: {
        searchedForAuthUserId: user.id,
        allUsersInDatabase: allUsers || [],
        allUsersError: allUsersError?.message,
        allAgencies: allAgencies || [],
        agenciesError: agenciesError?.message
      }
    })

  } catch (error) {
    console.error('Error in auth user detail:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}