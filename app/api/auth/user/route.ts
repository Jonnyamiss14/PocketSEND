import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get the current user from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user data from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        agencies (
          id,
          name,
          email,
          subscription_status
        )
      `)
      .eq('auth_user_id', user.id)
      .single()

    // If user doesn't exist in users table, they might be a new signup
    if (userError) {
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
        },
        isNewUser: true
      })
    }

    // Return user data with agency information
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        role: userData.role,
        agency_id: userData.agency_id,
        agency: userData.agencies
      },
      isNewUser: false
    })

  } catch (error) {
    console.error('Error in /api/auth/user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}