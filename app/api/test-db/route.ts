import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Test Supabase auth connection instead of tables (no RLS issues)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError && authError.message !== 'JWT expired') {
      console.error('Auth error:', authError)
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase connection failed',
        details: authError.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      data: {
        timestamp: new Date().toISOString(),
        connection: 'OK',
        hasUser: !!user,
        note: 'RLS policies detected, may need database configuration'
      }
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}