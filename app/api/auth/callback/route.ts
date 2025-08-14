import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Determine redirect based on user role/type
      // For now, redirect to dashboard for agency users
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(`${origin}/login`)
}
