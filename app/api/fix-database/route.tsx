import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // First, let's check what tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (tablesError) {
      console.error('Error fetching tables:', tablesError)
    }

    // Try to check RLS policies
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_policies')
      .single()

    return NextResponse.json({
      success: true,
      tables: tables || [],
      policies: policies || 'Unable to fetch policies',
      message: 'Database diagnostic complete'
    })
  } catch (error) {
    console.error('Database diagnostic error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// This will disable RLS temporarily for testing
export async function POST() {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Create a simple test without RLS
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .limit(1)

    if (error) {
      // If agencies table doesn't exist, let's create it
      if (error.message.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          error: 'Table does not exist',
          suggestion: 'Run database migrations'
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      message: 'Database connection working'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}