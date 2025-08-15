import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, mobileNumber, password } = body;

    console.log('Creating Supabase Auth user for:', email);

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for testing
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        mobile_number: mobileNumber,
        user_type: 'candidate'
      }
    });

    if (authError) {
      console.error('Supabase auth error:', authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    console.log('Auth user created with ID:', authData.user.id);

    // Step 2: Create candidate profile in the candidates table
    const { error: dbError } = await supabaseAdmin
      .from('candidates')
      .insert({
        id: authData.user.id, // Use the Supabase Auth UUID
        first_name: firstName,
        last_name: lastName,
        email,
        mobile_number: mobileNumber,
        phone: mobileNumber, // Also set phone field if it exists
      });

    if (dbError) {
      // If database insert fails, clean up the auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create candidate profile: ' + dbError.message },
        { status: 500 }
      );
    }

    console.log('Candidate profile created successfully');

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! You can now log in.',
      candidateId: authData.user.id
    });
  } catch (error) {
    console.error('Candidate creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create account: ' + (error as Error).message },
      { status: 500 }
    );
  }
}