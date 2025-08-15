import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token is required'
      }, { status: 400 })
    }

    const adminClient = createAdminClient()
    
    // Find the token and check if it's valid
    const { data: authToken, error: tokenError } = await adminClient
      .from('auth_tokens')
      .select(`
        id,
        candidate_id,
        token,
        expires_at,
        is_used
      `)
      .eq('token', token)
      .single()

    if (tokenError || !authToken) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or expired token'
      }, { status: 400 })
    }

    // Check if token is already used
    if (authToken.is_used) {
      return NextResponse.json({ 
        success: false, 
        error: 'This link has already been used'
      }, { status: 400 })
    }

    // Check if token is expired
    const now = new Date()
    const expiresAt = new Date(authToken.expires_at)
    
    if (now > expiresAt) {
      return NextResponse.json({ 
        success: false, 
        expired: true,
        error: 'This link has expired. Please request a new one.'
      }, { status: 400 })
    }

    // Get candidate information
    const { data: candidate, error: candidateError } = await adminClient
      .from('candidates')
      .select('id, first_name, last_name, email, phone')
      .eq('id', authToken.candidate_id)
      .single()

    if (candidateError || !candidate) {
      return NextResponse.json({ 
        success: false, 
        error: 'Candidate not found'
      }, { status: 400 })
    }

    // Mark token as used
    await adminClient
      .from('auth_tokens')
      .update({ 
        is_used: true,
        used_at: now.toISOString()
      })
      .eq('id', authToken.id)

    // Create or update session (in a real app, you'd set up proper session management)
    // For now, we'll return candidate info for the frontend to handle
    
    return NextResponse.json({
      success: true,
      message: 'Token verified successfully',
      candidate: {
        id: candidate.id,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        email: candidate.email,
        phone: candidate.phone
      }
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error'
    }, { status: 500 })
  }
}