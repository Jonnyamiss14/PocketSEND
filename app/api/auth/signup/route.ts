import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, agencyName } = await request.json()
    
    if (!email || !password || !agencyName) {
      return NextResponse.json({ 
        success: false, 
        error: 'All fields required'
      }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    })

    if (authError || !authData.user) {
      return NextResponse.json({ 
        success: false, 
        error: authError?.message || 'Signup failed'
      }, { status: 400 })
    }

    // Step 2: Create agency and user records using the database function
    const adminClient = createAdminClient()
    const { data: setupData, error: setupError } = await adminClient
      .rpc('create_agency_with_user', {
        p_auth_id: authData.user.id,
        p_email: email,
        p_agency_name: agencyName
      })

    if (setupError || !setupData?.success) {
      console.error('Setup error:', setupError)
      return NextResponse.json({ 
        success: true,
        warning: 'Account created but agency setup pending. Please contact support.',
        data: { user_id: authData.user.id, email }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Agency account created successfully',
      data: {
        user_id: authData.user.id,
        agency_id: setupData.agency_id,
        email: authData.user.email
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error'
    }, { status: 500 })
  }
}