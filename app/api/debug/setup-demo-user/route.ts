import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // First, check if the demo agency exists
    const { data: existingAgency } = await supabase
      .from('agencies')
      .select('*')
      .eq('name', 'Demo Agency')
      .single()

    let agencyId = existingAgency?.id

    if (!existingAgency) {
      // Create demo agency (with minimal fields)
      const { data: newAgency, error: agencyError } = await supabase
        .from('agencies')
        .insert({
          name: 'Demo Agency'
        })
        .select()
        .single()

      if (agencyError) {
        return NextResponse.json({ error: 'Failed to create agency', details: agencyError.message }, { status: 500 })
      }

      agencyId = newAgency.id
    }

    // Check if auth user exists
    const { data: authUsers } = await supabase.auth.admin.listUsers()
    const existingAuthUser = authUsers?.users?.find(u => u.email === 'jonnyamiss@gmail.com')

    let authUserId = existingAuthUser?.id

    if (!existingAuthUser) {
      // Create auth user (this requires admin privileges)
      const { data: newAuthUser, error: authError } = await supabase.auth.admin.createUser({
        email: 'jonnyamiss@gmail.com',
        password: 'demo123456',
        email_confirm: true
      })

      if (authError) {
        return NextResponse.json({ error: 'Failed to create auth user', details: authError.message }, { status: 500 })
      }

      authUserId = newAuthUser.user?.id
    }

    if (!authUserId) {
      return NextResponse.json({ error: 'No auth user ID available' }, { status: 500 })
    }

    // Check if user exists in users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single()

    if (!existingUser) {
      // Create user record
      const { error: userError } = await supabase
        .from('users')
        .insert({
          agency_id: agencyId,
          auth_user_id: authUserId,
          email: 'jonnyamiss@gmail.com',
          first_name: 'Jonny',
          last_name: 'Amiss',
          role: 'admin'
        })

      if (userError) {
        return NextResponse.json({ error: 'Failed to create user record', details: userError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Demo user setup completed',
      credentials: {
        email: 'jonnyamiss@gmail.com',
        password: 'demo123456'
      },
      agency: {
        id: agencyId,
        name: 'Demo Agency'
      }
    })

  } catch (error) {
    console.error('Error setting up demo user:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}