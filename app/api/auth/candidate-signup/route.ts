import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { insertCandidateSignupSchema } from '@/shared/schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request data
    const parseResult = insertCandidateSignupSchema.safeParse(body)
    if (!parseResult.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid form data',
        details: parseResult.error.issues
      }, { status: 400 })
    }

    const { firstName, lastName, email, phone, experienceLevel, agencyCode } = parseResult.data
    
    if (!firstName || !lastName || !phone) {
      return NextResponse.json({ 
        success: false, 
        error: 'First name, last name, and phone are required'
      }, { status: 400 })
    }

    const adminClient = createAdminClient()
    
    // Check if candidate already exists
    const { data: existingCandidate } = await adminClient
      .from('candidates')
      .select('id')
      .eq('phone', phone)
      .single()

    if (existingCandidate) {
      return NextResponse.json({ 
        success: false, 
        error: 'A candidate with this phone number already exists'
      }, { status: 400 })
    }

    // Create candidate record
    const { data: candidate, error: candidateError } = await adminClient
      .from('candidates')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone,
        experience_level: experienceLevel,
        confidence_level: experienceLevel === 'new' ? 30 : experienceLevel === 'some' ? 50 : 70,
        is_active: true
      })
      .select()
      .single()

    if (candidateError) {
      console.error('Candidate creation error:', candidateError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create candidate account'
      }, { status: 500 })
    }

    // If agency code provided, link to agency
    if (agencyCode) {
      // Verify agency code (could be a special invite code)
      const { data: agency } = await adminClient
        .from('agencies')
        .select('id')
        .eq('invite_code', agencyCode)
        .single()

      if (agency) {
        await adminClient
          .from('candidate_agencies')
          .insert({
            candidate_id: candidate.id,
            agency_id: agency.id,
            status: 'active'
          })
      }
    }

    // Generate and store magic link token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await adminClient
      .from('auth_tokens')
      .insert({
        candidate_id: candidate.id,
        token: token,
        token_type: 'magic_link',
        expires_at: expiresAt.toISOString()
      })

    // Send welcome email if email provided
    if (email) {
      // Queue welcome email (implement email service)
      console.log('Queue welcome email for:', email)
    }

    // Send WhatsApp magic link (in production, use Twilio)
    const magicLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify/${token}`
    console.log(`WhatsApp message to ${phone}: Welcome to PocketSEND! Access your portal: ${magicLink}`)

    return NextResponse.json({
      success: true,
      message: 'Candidate account created successfully',
      data: {
        candidate_id: candidate.id,
        phone: phone,
        debug_link: process.env.NODE_ENV === 'development' ? magicLink : undefined
      }
    })

  } catch (error) {
    console.error('Candidate signup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error'
    }, { status: 500 })
  }
}