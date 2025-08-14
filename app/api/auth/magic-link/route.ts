import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
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

    // Generate secure token for magic link
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now

    const supabase = await createClient()

    // For Phase 1, we'll just generate the token and return success
    // In Phase 2, this will be stored in database and sent via Twilio
    
    // TODO: Store token in candidates table with expiration
    // TODO: Send WhatsApp message via Twilio with magic link
    
    console.log(`Generated magic link token for ${phone}: ${token}`)
    console.log(`Token expires at: ${expiresAt.toISOString()}`)

    return NextResponse.json({
      message: 'Magic link sent successfully',
      success: true
    })

  } catch (error) {
    console.error('Magic link generation error:', error)
    
    return NextResponse.json(
      { message: 'Failed to send magic link' },
      { status: 500 }
    )
  }
}
