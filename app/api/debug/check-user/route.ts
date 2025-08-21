import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

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
      })
    }

    console.log('Debug: Auth user details:', {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    })

    // Check with regular client (affected by RLS)
    const { data: regularUser, error: regularError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    console.log('Debug: Regular client query:', { regularUser, regularError })

    // Check with admin client (bypasses RLS)
    const { data: adminUser, error: adminError } = await adminSupabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    console.log('Debug: Admin client query:', { adminUser, adminError })

    // Get all users in database for comparison
    const { data: allUsers } = await adminSupabase
      .from('users')
      .select('id, auth_user_id, email')
      .limit(10)

    return NextResponse.json({
      authUser: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      regularClient: {
        user: regularUser,
        error: regularError?.message
      },
      adminClient: {
        user: adminUser,
        error: adminError?.message
      },
      debugInfo: {
        allUsers: allUsers || [],
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json(
      { error: 'Debug endpoint failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}