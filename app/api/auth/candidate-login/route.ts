import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Attempting login for:', email);

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Login failed - no user data' },
        { status: 401 }
      );
    }

    // Check if user is a candidate
    if (data.user.user_metadata?.user_type !== 'candidate') {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: 'This account is not registered as a candidate' },
        { status: 403 }
      );
    }

    console.log('Login successful for user:', data.user.id);

    // Get candidate profile from database
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (candidateError) {
      console.error('Error fetching candidate profile:', candidateError);
    }

    // Set session cookie for client-side auth
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: candidate?.first_name || data.user.user_metadata?.first_name,
        lastName: candidate?.last_name || data.user.user_metadata?.last_name
      },
      redirectTo: '/candidate-dashboard'
    });

    // Set auth cookies if session exists
    if (data.session) {
      response.cookies.set('access-token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed: ' + (error as Error).message },
      { status: 500 }
    );
  }
}