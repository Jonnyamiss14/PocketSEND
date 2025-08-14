import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface VerifyTokenPageProps {
  params: {
    token: string
  }
}

export default async function VerifyTokenPage({ params }: VerifyTokenPageProps) {
  const { token } = params
  const supabase = await createClient()

  try {
    // Verify the token exists and is not expired
    const { data: authToken, error: tokenError } = await supabase
      .from('auth_tokens')
      .select(`
        id,
        candidate_id,
        expires_at,
        is_used,
        candidates (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `)
      .eq('token', token)
      .eq('token_type', 'magic_link')
      .single()

    if (tokenError || !authToken) {
      redirect('/candidate-login?error=invalid_token')
    }

    // Check if token is expired
    if (new Date(authToken.expires_at) < new Date()) {
      redirect('/candidate-login?error=expired_token')
    }

    // Check if token is already used
    if (authToken.is_used) {
      redirect('/candidate-login?error=token_used')
    }

    // Mark token as used
    await supabase
      .from('auth_tokens')
      .update({
        is_used: true,
        used_at: new Date().toISOString()
      })
      .eq('id', authToken.id)

    // Create a session for the candidate
    // In Phase 2, we'll implement proper candidate authentication
    // For now, redirect to candidate portal with candidate info
    redirect(`/portal?candidate_id=${authToken.candidate_id}&verified=true`)

  } catch (error) {
    console.error('Token verification error:', error)
    redirect('/candidate-login?error=verification_failed')
  }
}