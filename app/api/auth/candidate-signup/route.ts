import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, mobileNumber, password } = await request.json()
    
    if (!firstName || !lastName || !email || !mobileNumber || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'All fields are required'
      }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ 
        success: false, 
        error: 'Password must be at least 8 characters'
      }, { status: 400 })
    }

    const adminClient = createAdminClient()
    
    // Check if candidate already exists with same email or phone
    const { data: existingCandidate } = await adminClient
      .from('candidates')
      .select('id')
      .or(`email.eq.${email},phone.eq.${mobileNumber}`)
      .single()

    if (existingCandidate) {
      return NextResponse.json({ 
        success: false, 
        error: 'A candidate with this email or mobile number already exists'
      }, { status: 400 })
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create candidate record
    const { data: candidate, error: candidateError } = await adminClient
      .from('candidates')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: mobileNumber,
        password_hash: passwordHash,
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

    return NextResponse.json({
      success: true,
      message: 'Candidate account created successfully',
      data: {
        candidate_id: candidate.id,
        email: email
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