import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { StatsCards } from './components/stats-cards'
import { CandidatesGrid } from './components/candidates-grid'
import { Filters } from './components/filters'
import { AddCandidateModal } from './components/add-candidate-modal'
import { ExportButton } from './components/export-button'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

interface SearchParams {
  search?: string
  location?: string
  status?: string
  page?: string
}

export default async function RecruiterDashboard({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()
  
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams
  
  // Get current user and verify they're a recruiter
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user's agency - auth_user_id is correct column name in users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, agency_id, role')
    .eq('auth_user_id', user.id)
    .maybeSingle() // Use maybeSingle() for safety - layout should handle missing users

  if (userError || !userData) {
    // User exists in auth but not in users table - show setup page
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-amber-800 mb-4">
            Account Setup Required
          </h1>
          <p className="text-amber-700 mb-4">
            Your account is authenticated, but you need to complete your profile setup.
          </p>
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Auth User ID:</strong> {user.id}</p>
            <p><strong>Error:</strong> {userError?.message || 'User record not found in database'}</p>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                To fix this, you need to create a user record in the database:
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li>Create an agency record in the agencies table</li>
                <li>Create a user record in the users table with auth_user_id: <code className="bg-gray-100 px-1">{user.id}</code></li>
                <li>Link the user to the agency via agency_id</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-6 space-x-3">
            <a 
              href="/api/setup-recruiter"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
            >
              Auto-Setup Demo Account
            </a>
            <a 
              href="/login"
              className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 inline-block"
            >
              Back to Login
            </a>
            <a 
              href="/api/debug/auth-user-detail" 
              target="_blank"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
            >
              View Debug Info
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Build candidates query with filters using admin client to bypass RLS
  let candidatesQuery = adminSupabase
    .from('candidates')
    .select(`
      *,
      candidate_agencies!inner(
        agency_id,
        status,
        assigned_consultant_id,
        registration_date,
        assigned_at
      ),
      placements(count),
      preparation_modules(count)
    `)
    .eq('candidate_agencies.agency_id', userData.agency_id)
    .order('last_active_at', { ascending: false })

  // Apply search filter
  if (params.search) {
    candidatesQuery = candidatesQuery.or(
      `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,email.ilike.%${params.search}%`
    )
  }

  // Apply location filter
  if (params.location) {
    candidatesQuery = candidatesQuery.ilike('address', `%${params.location}%`)
  }

  // Apply status filter
  if (params.status === 'active') {
    candidatesQuery = candidatesQuery.gte('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  } else if (params.status === 'inactive') {
    candidatesQuery = candidatesQuery.lt('last_active_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  }

  // Pagination
  const page = parseInt(params.page || '1')
  const limit = 20
  const offset = (page - 1) * limit

  candidatesQuery = candidatesQuery.range(offset, offset + limit - 1)

  const { data: candidates, error: candidatesError } = await candidatesQuery

  if (candidatesError) {
    console.error('Error fetching candidates:', candidatesError)
  }

  // Get stats for the overview cards - safe RPC call with fallback
  const { data: stats, error: statsError } = await adminSupabase.rpc('get_recruiter_stats', {
    agency_uuid: userData.agency_id
  }).maybeSingle()

  // Fallback stats calculation if RPC fails
  const fallbackStats = {
    total_candidates: candidates?.length || 0,
    active_learners: candidates?.filter(c => {
      const lastActive = new Date(c.last_active_at || 0)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      return lastActive > weekAgo
    }).length || 0,
    placements_this_week: 0, // Will be 0 until placements table is populated
    average_confidence: (candidates && candidates.length > 0)
      ? Math.round(candidates.reduce((sum, c) => sum + (c.confidence_score || 0), 0) / candidates.length)
      : 0
  }

  const initialStats = stats || fallbackStats

  if (statsError) {
    console.warn('RPC stats failed, using fallback:', statsError.message)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recruiter Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your candidates and track their preparation progress
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <AddCandidateModal>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </AddCandidateModal>
          
          <ExportButton searchParams={params} />
        </div>
      </div>

      {/* Stats Overview */}
      <StatsCards 
        initialStats={initialStats as any}
        agencyId={userData.agency_id}
        userId={userData.id}
      />

      {/* Filters */}
      <Filters />

      {/* Candidates Grid */}
      <CandidatesGrid 
        initialCandidates={candidates || []}
        agencyId={userData.agency_id}
        userId={userData.id}
        searchParams={params}
      />
    </div>
  )
}