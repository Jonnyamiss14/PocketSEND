import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const authId = formData.get('auth_id') as string
    const email = formData.get('email') as string

    if (!authId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const adminSupabase = createAdminClient()

    // Check if user already exists (race condition protection)
    console.log('Checking for existing user with auth_user_id:', authId)
    const { data: existingUser, error: existingUserError } = await adminSupabase
      .from('users')
      .select('id, email, agency_id')
      .eq('auth_user_id', authId)
      .maybeSingle()

    console.log('Existing user query result:', { existingUser, existingUserError })

    if (existingUser) {
      // User record already exists, return success with redirect
      console.log('User already exists, returning redirect')
      return NextResponse.json({ success: true, redirect: '/recruiter-dashboard' })
    }

    // Create or get default agency
    let { data: agency } = await adminSupabase
      .from('agencies')
      .select('id')
      .eq('name', 'Default Agency')
      .maybeSingle()

    if (!agency) {
      // Create default agency
      const { data: newAgency, error: agencyError } = await adminSupabase
        .from('agencies')
        .insert({
          name: 'Default Agency',
          email: email,
          phone: '+44 20 1234 5678',
          whatsapp_credits: 1000,
          subscription_status: 'active',
          subscription_plan: 'basic'
        })
        .select('id')
        .single()

      if (agencyError || !newAgency) {
        console.error('Error creating agency:', agencyError)
        return NextResponse.json(
          { error: 'Failed to create agency' },
          { status: 500 }
        )
      }

      agency = newAgency
    }

    // Create user record
    const { data: newUser, error: userError } = await adminSupabase
      .from('users')
      .insert({
        id: crypto.randomUUID(),
        auth_user_id: authId,
        agency_id: agency.id,
        email: email,
        first_name: email.split('@')[0] || 'User',
        last_name: 'Account',
        role: 'admin',
        is_active: true
      })
      .select()
      .single()

    if (userError || !newUser) {
      console.error('Error creating user:', userError)
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    console.log('Successfully created user record:', newUser.id)

    // Return success with redirect URL
    return NextResponse.json({ success: true, redirect: '/recruiter-dashboard' })

  } catch (error) {
    console.error('Error in setup-user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}