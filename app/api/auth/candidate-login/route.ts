import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required'
      }, { status: 400 })
    }

    const adminClient = createAdminClient()
    
    // Find candidate by email
    const { data: candidate, error: candidateError } = await adminClient
      .from('candidates')
      .select('id, first_name, last_name, email, phone, password_hash, is_active')
      .eq('email', email)
      .single()

    if (candidateError || !candidate) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email or password'
      }, { status: 401 })
    }

    // Check if candidate account is active
    if (!candidate.is_active) {
      return NextResponse.json({ 
        success: false, 
        error: 'Account is disabled. Please contact support.'
      }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, candidate.password_hash)
    
    if (!isPasswordValid) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email or password'
      }, { status: 401 })
    }

    // In a real application, you would:
    // 1. Create a JWT token or session
    // 2. Set secure HTTP-only cookies
    // 3. Implement proper session management
    
    // For now, we'll return candidate data for frontend to handle
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      candidate: {
        id: candidate.id,
        firstName: candidate.first_name,
        lastName: candidate.last_name,
        email: candidate.email,
        phone: candidate.phone
      }
    })

  } catch (error) {
    console.error('Candidate login error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error'
    }, { status: 500 })
  }
}