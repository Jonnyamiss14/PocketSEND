import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import AccountSetupRequired from './components/account-setup-required'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Get authenticated user
  const {
    data: { user: authUser },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !authUser) {
    redirect('/login')
  }

  // Use admin client to bypass RLS policies for user lookup
  const adminSupabase = createAdminClient()
  
  console.log('Protected Layout: Looking for user with auth_user_id:', authUser.id)
  
  // Try to get user database record using admin client
  const { data: userData, error: userError } = await adminSupabase
    .from('users')
    .select(`
      *,
      agency:agencies(*)
    `)
    .eq('auth_user_id', authUser.id)
    .maybeSingle()  // CRITICAL: Use maybeSingle() not single()

  console.log('Protected Layout: User lookup result:', { userData, userError })

  // If no user record exists in database, show setup page
  if (!userData) {
    console.log('User authenticated but no database record found:', authUser.id)
    return <AccountSetupRequired authUser={{ id: authUser.id, email: authUser.email || '' }} />
  }

  // If there was a database error, log it but continue
  if (userError) {
    console.warn('User lookup error (non-fatal):', userError.message)
  }

  console.log('Protected Layout: User found, proceeding to dashboard')
  
  // User is fully set up, render protected content
  return <>{children}</>
}