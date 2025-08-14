import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, agencyName } = await request.json()
    
    if (!email || !password || !agencyName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email, password, and agency name are required'
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Create the user account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          agency_name: agencyName
        }
      }
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create account',
        details: authError.message
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create user account'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      data: {
        user_id: authData.user.id,
        email: authData.user.email,
        agency_name: agencyName,
        needs_verification: !authData.user.email_confirmed_at
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}