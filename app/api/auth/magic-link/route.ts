import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { message: 'Phone number is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const adminClient = createAdminClient()

    // First, find or create candidate with this phone number using admin client
    const { data: candidate, error: candidateError } = await adminClient
      .from('candidates')
      .select('id, first_name, last_name')
      .eq('phone', phone)
      .single()

    if (candidateError && candidateError.code !== 'PGRST116') {
      console.error('Database error:', candidateError)
      return NextResponse.json(
        { message: 'Database error occurred' },
        { status: 500 }
      )
    }

    let candidateId: string

    if (!candidate) {
      // Create a new candidate record using admin client to bypass RLS
      const { data: newCandidate, error: createError } = await adminClient
        .from('candidates')
        .insert({
          phone,
          first_name: 'New',
          last_name: 'Candidate',
          // Assign to first available agency for testing
          email: `candidate-${Date.now()}@temp.com`
        })
        .select('id')
        .single()

      if (createError) {
        console.error('Error creating candidate:', createError)
        return NextResponse.json(
          { message: 'Failed to create candidate record' },
          { status: 500 }
        )
      }

      candidateId = newCandidate.id
    } else {
      candidateId = candidate.id
    }

    // Generate secure token for magic link
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    // Clean up any existing unused tokens for this candidate
    await supabase
      .from('auth_tokens')
      .delete()
      .eq('candidate_id', candidateId)
      .eq('is_used', false)
      .eq('token_type', 'magic_link')

    // Store the new token in the database using admin client
    const { error: tokenError } = await adminClient
      .from('auth_tokens')
      .insert({
        candidate_id: candidateId,
        token,
        token_type: 'magic_link',
        expires_at: expiresAt.toISOString()
      })

    if (tokenError) {
      console.error('Error storing auth token:', tokenError)
      return NextResponse.json(
        { message: 'Failed to generate magic link' },
        { status: 500 }
      )
    }

    // For Phase 1, we'll just log the token - Phase 2 will send via Twilio
    console.log(`Generated magic link for ${phone}: http://localhost:5000/auth/verify/${token}`)
    console.log(`Token expires at: ${expiresAt.toISOString()}`)

    return NextResponse.json({
      message: 'Magic link sent successfully',
      success: true,
      // Include token in development for testing
      ...(process.env.NODE_ENV === 'development' && { 
        debug_token: token,
        debug_link: `/auth/verify/${token}`
      })
    })

  } catch (error) {
    console.error('Magic link generation error:', error)
    
    return NextResponse.json(
      { message: 'Failed to send magic link' },
      { status: 500 }
    )
  }
}
