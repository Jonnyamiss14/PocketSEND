import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 })
    }

    // Check if user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    const authUser = authUsers?.users?.find(u => u.email === email)

    // Check if user exists in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select(`
        *,
        agencies (
          id,
          name
        )
      `)
      .eq('email', email)
      .single()

    // Check all agencies
    const { data: allAgencies, error: agenciesError } = await supabase
      .from('agencies')
      .select('*')

    return NextResponse.json({
      debug: {
        email: email,
        authUser: authUser ? { id: authUser.id, email: authUser.email, created_at: authUser.created_at } : null,
        userData: userData || null,
        userError: userError?.message || null,
        allAgencies: allAgencies || [],
        agenciesError: agenciesError?.message || null,
        migration_applied: 'Check if candidates table has learning_streak, confidence_score columns'
      }
    })

  } catch (error) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}